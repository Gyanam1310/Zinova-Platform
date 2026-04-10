import logging
import os
import re
import uuid
from datetime import datetime
from functools import lru_cache
from pathlib import Path
from typing import Literal

from fastapi import APIRouter, HTTPException
from google.oauth2 import service_account
from googleapiclient.discovery import build
from pydantic import BaseModel

router = APIRouter(prefix="/api", tags=["form"])
EMAIL_REGEX = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
logger = logging.getLogger(__name__)

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
SPREADSHEET_ID = os.getenv(
    "GOOGLE_SPREADSHEET_ID", "1_T4c75_Jjbi8b16HJLqsSeBK3iZxRLQCgpq-OnXJCGY"
)
SHEET_RANGE = os.getenv("GOOGLE_SHEET_RANGE", "Sheet1!A:H")
SERVICE_ACCOUNT_FILE = os.getenv(
    "GOOGLE_SERVICE_ACCOUNT_FILE",
    str(Path(__file__).resolve().parents[3] / "service-account.json"),
)


class SubmitRequest(BaseModel):
    name: str
    email: str
    organization: str = ""
    message: str = ""
    source: Literal["landing", "contact"] = "landing"


@lru_cache(maxsize=1)
def get_sheets_client():
    if not SPREADSHEET_ID:
        raise RuntimeError("GOOGLE_SPREADSHEET_ID is not configured")

    service_account_path = Path(SERVICE_ACCOUNT_FILE)
    if not service_account_path.exists():
        raise RuntimeError(
            f"Service account file not found at: {service_account_path}"
        )

    credentials = service_account.Credentials.from_service_account_file(
        str(service_account_path), scopes=SCOPES
    )

    return build("sheets", "v4", credentials=credentials, cache_discovery=False)


@router.post("/submit")
def submit_form(body: SubmitRequest):
    name = body.name.strip()
    email = str(body.email).strip()
    organization = body.organization.strip()
    message = body.message.strip()
    source = body.source.strip() if body.source else "landing"

    if not name:
        raise HTTPException(status_code=400, detail="name is required")
    if not email:
        raise HTTPException(status_code=400, detail="email is required")
    if not EMAIL_REGEX.match(email):
        raise HTTPException(status_code=400, detail="email format is invalid")

    row_id = str(uuid.uuid4())
    timestamp = datetime.now().isoformat()

    row = [
        row_id,
        timestamp,
        name,
        email,
        organization or "",
        message or "",
        source or "landing",
        "new",
    ]

    try:
        sheets = get_sheets_client()
        sheets.spreadsheets().values().append(
            spreadsheetId=SPREADSHEET_ID,
            range="Sheet1!A:H",
            valueInputOption="USER_ENTERED",
            insertDataOption="INSERT_ROWS",
            body={"values": [row]},
        ).execute()

        logger.info("Form submission stored: %s <%s>", name, email)
        return {"success": True, "message": "Data stored successfully"}

    except Exception as exc:
        logger.exception("Google Sheets append failed")
        return {"success": False, "error": str(exc)}
