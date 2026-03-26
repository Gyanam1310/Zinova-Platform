import os
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

# ── SMTP config from .env ─────────────────────────────────────────────────────
SMTP_SERVER   = os.getenv("BREVO_SMTP_SERVER", "smtp-relay.brevo.com")
SMTP_PORT     = int(os.getenv("BREVO_SMTP_PORT", "587"))
SMTP_LOGIN    = os.getenv("BREVO_EMAIL")       # SMTP login: a5e205001@smtp-brevo.com
SMTP_PASSWORD = os.getenv("BREVO_PASSWORD")    # SMTP key
SENDER_EMAIL  = os.getenv("BREVO_SENDER_EMAIL", SMTP_LOGIN)  # verified sender

# OTP store: { "user@email.com": "123456" }
otp_store = {}

# ── Email sender ──────────────────────────────────────────────────────────────

def send_email(to_email: str, otp: str):
    print(f"[DEBUG] Sending OTP {otp} to {to_email}")
    print(f"[DEBUG] SMTP login: {SMTP_LOGIN}")
    print(f"[DEBUG] From (sender): {SENDER_EMAIL}")

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Your Zinova OTP Code"
    msg["From"]    = SENDER_EMAIL   # must be a verified sender in Brevo
    msg["To"]      = to_email

    body = MIMEText(
        f"Hello,\n\nYour Zinova verification code is:\n\n  {otp}\n\n"
        f"This code is valid for one use only.\n\nDo not share it with anyone.",
        "plain"
    )
    msg.attach(body)

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.set_debuglevel(1)   # prints full SMTP conversation to terminal
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(SMTP_LOGIN, SMTP_PASSWORD)
        server.sendmail(SENDER_EMAIL, to_email, msg.as_string())
        print(f"[SUCCESS] Email sent to {to_email}")

# ── FastAPI app ───────────────────────────────────────────────────────────────

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class EmailRequest(BaseModel):
    email: str

class VerifyRequest(BaseModel):
    email: str
    otp: str


@app.get("/health")
def health():
    return {"status": "ok", "smtp_login": SMTP_LOGIN, "sender": SENDER_EMAIL}


@app.post("/send-otp")
def send_otp(body: EmailRequest):
    otp = str(random.randint(100000, 999999))
    otp_store[body.email] = otp
    print(f"[OTP] {body.email} → {otp}")

    try:
        send_email(body.email, otp)
    except Exception as e:
        print(f"[ERROR] Email failed: {e}")
        raise HTTPException(status_code=500, detail=f"Email sending failed: {e}")

    return {"message": "OTP sent to your email."}


@app.post("/verify-otp")
def verify_otp(body: VerifyRequest):
    stored = otp_store.get(body.email)

    if not stored:
        raise HTTPException(status_code=400, detail="No OTP found. Request a new one.")

    if stored != body.otp.strip():
        raise HTTPException(status_code=400, detail="Invalid OTP.")

    del otp_store[body.email]
    return {"message": "OTP verified successfully."}


# ── Standalone test (run directly: python main.py) ────────────────────────────
if __name__ == "__main__":
    test_email = input("Enter email to test: ").strip()
    test_otp = str(random.randint(100000, 999999))
    print(f"Sending OTP {test_otp} to {test_email}...")
    try:
        send_email(test_email, test_otp)
        print("Done! Check your inbox.")
    except Exception as e:
        print(f"FAILED: {e}")
