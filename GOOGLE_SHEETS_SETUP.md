# Google Sheets Integration Setup Guide

This guide walks through setting up Google Sheets as the database for Zinova.

## 📋 Your Google Sheet ID

```
1XASEPqrt6_ahm6oYCq99cDqeSHVL367tySmSRwk2IYQ
```

## 🔑 Step 1: Create Google Cloud Service Account

### 1.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a Project" → "New Project"
3. Enter project name: "Zinova"
4. Click "Create"

### 1.2 Enable Google Sheets API

1. In the Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google Sheets API"
3. Click on it and press "Enable"

### 1.3 Create Service Account

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Fill in:
   - Service account name: "zinova-backend"
   - Service account ID: (auto-filled)
   - Description: "Backend service for Zinova"
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

### 1.4 Create and Download JSON Key

1. In "Credentials", find your service account
2. Click on it to open details
3. Go to "Keys" tab
4. Click "Add Key" → "Create new key"
5. Choose "JSON"
6. Click "Create" - the JSON file will download

### 1.5 Share Google Sheet with Service Account

1. Open the downloaded JSON file
2. Find the `client_email` field (looks like: `zinova-backend@project-id.iam.gserviceaccount.com`)
3. Go to your Google Sheet: https://docs.google.com/spreadsheets/d/1XASEPqrt6_ahm6oYCq99cDqeSHVL367tySmSRwk2IYQ/edit
4. Click "Share" button
5. Paste the service account email
6. Give it "Editor" access
7. Click "Share"

## 📝 Step 2: Set Up Sheet Structure

Your Google Sheet needs three sheets (tabs) with the following structure:

### Sheet 1: "Users"

| Column | Type | Description |
|--------|------|-------------|
| A | email | User email address |
| B | created_at | ISO timestamp |
| C | last_login | ISO timestamp |
| D | preferences | JSON string |

**Example Row:**
```
user@example.com | 2024-01-15T10:30:00Z | 2024-01-15T10:30:00Z | {"theme":"light"}
```

### Sheet 2: "Inventory"

| Column | Type | Description |
|--------|------|-------------|
| A | id | Unique identifier (UUID) |
| B | item_name | Name of food item |
| C | quantity | Numeric quantity |
| D | unit | Unit of measurement (kg, liters, etc) |
| E | expiry_date | Date in YYYY-MM-DD format |
| F | category | Category (vegetables, dairy, etc) |
| G | user_email | User's email |
| H | created_at | ISO timestamp |
| I | updated_at | ISO timestamp |

**Example Row:**
```
550e8400-e29b-41d4-a716-446655440000 | Tomatoes | 5 | kg | 2024-01-25 | vegetables | user@example.com | 2024-01-15T10:30:00Z | 2024-01-15T10:30:00Z
```

### Sheet 3: "Analytics"

| Column | Type | Description |
|--------|------|-------------|
| A | user_email | User's email |
| B | metric_name | Name of metric |
| C | metric_value | Numeric value |
| D | timestamp | ISO timestamp |
| E | category | Category of metric |

**Example Row:**
```
user@example.com | total_food_saved | 45.5 | 2024-01-15T10:30:00Z | waste_reduction
```

## 🔧 Step 3: Configure Backend

### 3.1 Add Google Sheets Library

The backend needs the Google Sheets library. It's already in requirements.txt:

```bash
pip install google-auth-oauthlib google-auth-httplib2 google-api-python-client
```

### 3.2 Store Service Account Credentials

1. Copy the downloaded JSON file to: `backend/credentials.json`
2. Update `.env`:
   ```env
   GOOGLE_SHEETS_CREDENTIALS_PATH=backend/credentials.json
   GOOGLE_SHEETS_ID=1XASEPqrt6_ahm6oYCq99cDqeSHVL367tySmSRwk2IYQ
   ```

### 3.3 Implement Google Sheets Service

The backend needs a Google Sheets service module. See `backend/app/services/sheets.py` (to be created by your teammate).

## 🧪 Step 4: Testing

### Test 1: Verify Service Account Access

```python
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

# Load credentials
credentials = Credentials.from_service_account_file(
    'backend/credentials.json',
    scopes=['https://www.googleapis.com/auth/spreadsheets']
)

# Build service
service = build('sheets', 'v4', credentials=credentials)

# Test read
result = service.spreadsheets().values().get(
    spreadsheetId='1XASEPqrt6_ahm6oYCq99cDqeSHVL367tySmSRwk2IYQ',
    range='Users!A:D'
).execute()

print(result.get('values', []))
```

### Test 2: Create User Record

```python
# Append user to Users sheet
service.spreadsheets().values().append(
    spreadsheetId='1XASEPqrt6_ahm6oYCq99cDqeSHVL367tySmSRwk2IYQ',
    range='Users!A:D',
    valueInputOption='USER_ENTERED',
    body={
        'values': [[
            'test@example.com',
            '2024-01-15T10:30:00Z',
            '2024-01-15T10:30:00Z',
            '{"theme":"light"}'
        ]]
    }
).execute()
```

### Test 3: Create Inventory Item

```python
import uuid
from datetime import datetime

# Append inventory item
service.spreadsheets().values().append(
    spreadsheetId='1XASEPqrt6_ahm6oYCq99cDqeSHVL367tySmSRwk2IYQ',
    range='Inventory!A:I',
    valueInputOption='USER_ENTERED',
    body={
        'values': [[
            str(uuid.uuid4()),
            'Tomatoes',
            5,
            'kg',
            '2024-01-25',
            'vegetables',
            'test@example.com',
            datetime.utcnow().isoformat() + 'Z',
            datetime.utcnow().isoformat() + 'Z'
        ]]
    }
).execute()
```

## 📊 Implementation Tasks for Your Teammate

### Task 1: Create Google Sheets Service Module
- File: `backend/app/services/sheets.py`
- Implement CRUD operations for Users, Inventory, Analytics
- Add error handling and retry logic

### Task 2: Update OTP Verification
- When OTP is verified, create user record in Google Sheets
- Update last_login on each login

### Task 3: Update Dashboard Endpoint
- Fetch user data from Google Sheets instead of mock data
- Fetch inventory items from Google Sheets
- Fetch analytics from Google Sheets

### Task 4: Add Inventory Endpoints
- POST /api/inventory - Create inventory item
- GET /api/inventory - Get user's inventory items
- PUT /api/inventory/{id} - Update inventory item
- DELETE /api/inventory/{id} - Delete inventory item

### Task 5: Add Analytics Endpoints
- POST /api/analytics - Create analytics record
- GET /api/analytics - Get user's analytics

### Task 6: Testing
- Write unit tests for Google Sheets operations
- Write integration tests for complete flow
- Test error scenarios (API failures, invalid data, etc)

## 🚀 Implementation Checklist

- [ ] Google Cloud project created
- [ ] Google Sheets API enabled
- [ ] Service account created
- [ ] JSON key downloaded
- [ ] Google Sheet shared with service account
- [ ] Sheet structure created (Users, Inventory, Analytics)
- [ ] credentials.json stored in backend/
- [ ] .env updated with GOOGLE_SHEETS_ID
- [ ] Google Sheets service module created
- [ ] OTP verification updated to create user in Sheets
- [ ] Dashboard endpoint updated to fetch from Sheets
- [ ] Inventory endpoints implemented
- [ ] Analytics endpoints implemented
- [ ] Tests written and passing
- [ ] End-to-end flow tested

## 📚 Reference Documentation

- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Service Account Setup](https://cloud.google.com/docs/authentication/getting-started)
- [Python Google Sheets Client](https://github.com/googleapis/google-api-python-client)

## 🆘 Troubleshooting

### "Permission denied" Error
- Verify service account email is shared with the Google Sheet
- Check that the email has "Editor" access

### "Spreadsheet not found" Error
- Verify GOOGLE_SHEETS_ID is correct
- Check that the Sheet ID matches the URL

### "API not enabled" Error
- Go to Google Cloud Console
- Enable Google Sheets API
- Wait a few minutes for changes to propagate

### "Invalid credentials" Error
- Verify credentials.json file exists
- Check that the file path is correct
- Verify the JSON file is valid

## 📞 Support

For issues:
1. Check the troubleshooting section above
2. Review Google Sheets API documentation
3. Check backend logs: `docker-compose logs backend`
4. Verify all environment variables are set correctly
