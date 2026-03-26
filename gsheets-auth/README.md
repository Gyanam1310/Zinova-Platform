# Google Sheets Auth Backend

Signup & Login using Google Sheets as the database.

---

## 1. Google Sheet Setup

1. Go to [sheets.google.com](https://sheets.google.com) and create a new sheet.
2. In **row 1**, add these exact headers (one per column):

   | A    | B     | C        |
   |------|-------|----------|
   | Name | Email | Password |

3. Copy the Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/COPY_THIS_PART/edit
   ```

---

## 2. Google API Setup

### Step 1 — Enable the Sheets API
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or select an existing one)
3. Search for **"Google Sheets API"** → click **Enable**

### Step 2 — Create a Service Account
1. In the left menu go to **IAM & Admin → Service Accounts**
2. Click **Create Service Account**
3. Give it any name (e.g. `sheets-auth`) → click **Create and Continue** → **Done**

### Step 3 — Download the JSON key
1. Click on the service account you just created
2. Go to the **Keys** tab → **Add Key → Create new key → JSON**
3. A file downloads — rename it to `service_account.json`
4. Move it into this `gsheets-auth/` folder

### Step 4 — Share the Sheet with the service account
1. Open your Google Sheet
2. Click **Share** (top right)
3. Paste the service account email (looks like `name@project.iam.gserviceaccount.com`)
   — you can find it inside `service_account.json` under `"client_email"`
4. Give it **Editor** access → click **Send**

---

## 3. Local Setup

```bash
# 1. Enter the project folder
cd gsheets-auth

# 2. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
cp .env.example .env
# Edit .env — paste your GOOGLE_SHEET_ID
```

---

## 4. Run the server

```bash
uvicorn main:app --reload --port 8001
```

Server runs at **http://localhost:8001**

---

## 5. API Endpoints

### Health check
```
GET /health
→ { "status": "ok" }
```

### Signup
```
POST /signup
Content-Type: application/json

{ "name": "Alice", "email": "alice@example.com", "password": "secret123" }

→ 201  { "message": "Account created for Alice." }
→ 409  { "detail": "Email already registered." }
```

### Login
```
POST /login
Content-Type: application/json

{ "email": "alice@example.com", "password": "secret123" }

→ 200  { "message": "Login successful.", "user": { "name": "Alice", "email": "..." } }
→ 401  { "detail": "Invalid email or password." }
```

### Get all users (name + email only)
```
GET /users
→ [ { "name": "Alice", "email": "alice@example.com" }, ... ]
```

---

## 6. Test with curl

```bash
# Signup
curl -X POST http://localhost:8001/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"secret123"}'

# Login
curl -X POST http://localhost:8001/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"secret123"}'
```

Or open **http://localhost:8001/docs** for the interactive Swagger UI.
