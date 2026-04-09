# Google Sheets Implementation Guide for Your Teammate

This guide provides step-by-step instructions for integrating Google Sheets into the Zinova backend.

## 📋 Overview

The Google Sheets service has been created in `backend/app/services/sheets.py`. Your teammate needs to:

1. Set up Google Cloud credentials
2. Update the OTP verification endpoint to create users in Google Sheets
3. Update the dashboard endpoint to fetch data from Google Sheets
4. Add inventory and analytics endpoints
5. Test the complete flow

## 🔑 Step 1: Set Up Google Cloud Credentials

### 1.1 Follow the Setup Guide

Your teammate should follow the complete setup in `GOOGLE_SHEETS_SETUP.md`:
- Create Google Cloud project
- Enable Google Sheets API
- Create service account
- Download JSON key
- Share Google Sheet with service account
- Create sheet structure (Users, Inventory, Analytics)

### 1.2 Store Credentials

1. Save the downloaded JSON file as `backend/credentials.json`
2. Update `.env`:
   ```env
   GOOGLE_SHEETS_CREDENTIALS_PATH=backend/credentials.json
   GOOGLE_SHEETS_ID=1XASEPqrt6_ahm6oYCq99cDqeSHVL367tySmSRwk2IYQ
   ```

## 🔧 Step 2: Update OTP Verification Endpoint

### Current Code (backend/app/routes/otp.py)

The current `/api/auth/verify-otp` endpoint returns a token but doesn't create a user in Google Sheets.

### Updated Code

```python
# At the top of otp.py, add:
from app.services.sheets import get_sheets_service

# In the verify_otp function, after token generation:
@router.post("/verify-otp")
def verify_otp(body: VerifyRequest):
    """Verify OTP code and return JWT token"""
    otp_data = otp_store.get(body.email)

    if not otp_data:
        raise HTTPException(status_code=400, detail="No OTP found. Request a new one.")

    # Check if OTP has expired
    if is_otp_expired(otp_data["created_at"]):
        del otp_store[body.email]
        raise HTTPException(status_code=400, detail="OTP has expired. Request a new one.")

    # Verify OTP matches
    if otp_data["otp"] != body.otp.strip():
        raise HTTPException(status_code=400, detail="Invalid OTP.")

    # Delete OTP after successful verification
    del otp_store[body.email]

    # Generate JWT token
    token = generate_jwt_token(body.email)

    # ✨ NEW: Create or update user in Google Sheets
    sheets_service = get_sheets_service()
    if sheets_service and sheets_service.is_available():
        user = sheets_service.get_user(body.email)
        if not user:
            # Create new user
            sheets_service.create_user(body.email)
        else:
            # Update last login
            sheets_service.update_user_last_login(body.email)
    
    return {
        "message": "OTP verified successfully.",
        "token": token,
        "email": body.email
    }
```

## 📊 Step 3: Update Dashboard Endpoint

### Current Code (backend/app/routes/dashboard.py)

The current endpoint returns mock data. Update it to fetch from Google Sheets:

```python
# At the top of dashboard.py, add:
from app.services.sheets import get_sheets_service

# Replace the get_dashboard function:
@router.get("/dashboard")
def get_dashboard(user_email: str = Depends(verify_token)):
    """Get dashboard data for authenticated user"""
    
    sheets_service = get_sheets_service()
    
    # If Google Sheets is not available, return mock data
    if not sheets_service or not sheets_service.is_available():
        return {
            "user": {
                "email": user_email,
                "created_at": datetime.utcnow().isoformat(),
                "last_login": datetime.utcnow().isoformat(),
            },
            "inventory": [
                {
                    "id": "1",
                    "item_name": "Tomatoes",
                    "quantity": 5,
                    "unit": "kg",
                    "expiry_date": "2024-01-25",
                    "category": "vegetables",
                },
            ],
            "analytics": {
                "total_food_saved": 45.5,
                "waste_reduction_percentage": 32,
                "items_tracked": 3,
            },
        }
    
    # ✨ NEW: Fetch from Google Sheets
    user = sheets_service.get_user(user_email)
    inventory_items = sheets_service.get_inventory_items(user_email)
    analytics_records = sheets_service.get_analytics(user_email)
    
    # Calculate analytics metrics
    total_food_saved = sum(item['quantity'] for item in inventory_items)
    waste_reduction = len(analytics_records) * 10  # Example calculation
    
    return {
        "user": {
            "email": user_email,
            "created_at": user['created_at'] if user else datetime.utcnow().isoformat(),
            "last_login": user['last_login'] if user else datetime.utcnow().isoformat(),
        },
        "inventory": inventory_items,
        "analytics": {
            "total_food_saved": total_food_saved,
            "waste_reduction_percentage": waste_reduction,
            "items_tracked": len(inventory_items),
        },
    }
```

## 🛒 Step 4: Add Inventory Endpoints

Create a new file: `backend/app/routes/inventory.py`

```python
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import Optional
from app.routes.dashboard import verify_token
from app.services.sheets import get_sheets_service

router = APIRouter(prefix="/api/inventory", tags=["inventory"])


class InventoryItemRequest(BaseModel):
    item_name: str
    quantity: float
    unit: str
    expiry_date: str
    category: str


@router.post("")
def create_inventory_item(
    body: InventoryItemRequest,
    user_email: str = Depends(verify_token)
):
    """Create a new inventory item"""
    sheets_service = get_sheets_service()
    
    if not sheets_service or not sheets_service.is_available():
        raise HTTPException(status_code=500, detail="Google Sheets service not available")
    
    item_id = sheets_service.create_inventory_item(
        item_name=body.item_name,
        quantity=body.quantity,
        unit=body.unit,
        expiry_date=body.expiry_date,
        category=body.category,
        user_email=user_email
    )
    
    if not item_id:
        raise HTTPException(status_code=500, detail="Failed to create inventory item")
    
    return {
        "id": item_id,
        "message": "Inventory item created successfully"
    }


@router.get("")
def get_inventory_items(user_email: str = Depends(verify_token)):
    """Get all inventory items for the user"""
    sheets_service = get_sheets_service()
    
    if not sheets_service or not sheets_service.is_available():
        raise HTTPException(status_code=500, detail="Google Sheets service not available")
    
    items = sheets_service.get_inventory_items(user_email)
    return {"items": items}


@router.put("/{item_id}")
def update_inventory_item(
    item_id: str,
    body: InventoryItemRequest,
    user_email: str = Depends(verify_token)
):
    """Update an inventory item"""
    sheets_service = get_sheets_service()
    
    if not sheets_service or not sheets_service.is_available():
        raise HTTPException(status_code=500, detail="Google Sheets service not available")
    
    success = sheets_service.update_inventory_item(
        item_id=item_id,
        user_email=user_email,
        item_name=body.item_name,
        quantity=body.quantity,
        unit=body.unit,
        expiry_date=body.expiry_date,
        category=body.category
    )
    
    if not success:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    
    return {"message": "Inventory item updated successfully"}


@router.delete("/{item_id}")
def delete_inventory_item(
    item_id: str,
    user_email: str = Depends(verify_token)
):
    """Delete an inventory item"""
    sheets_service = get_sheets_service()
    
    if not sheets_service or not sheets_service.is_available():
        raise HTTPException(status_code=500, detail="Google Sheets service not available")
    
    success = sheets_service.delete_inventory_item(item_id, user_email)
    
    if not success:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    
    return {"message": "Inventory item deleted successfully"}
```

## 📈 Step 5: Add Analytics Endpoints

Create a new file: `backend/app/routes/analytics.py`

```python
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.routes.dashboard import verify_token
from app.services.sheets import get_sheets_service

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


class AnalyticsRecordRequest(BaseModel):
    metric_name: str
    metric_value: float
    category: str


@router.post("")
def create_analytics_record(
    body: AnalyticsRecordRequest,
    user_email: str = Depends(verify_token)
):
    """Create an analytics record"""
    sheets_service = get_sheets_service()
    
    if not sheets_service or not sheets_service.is_available():
        raise HTTPException(status_code=500, detail="Google Sheets service not available")
    
    success = sheets_service.create_analytics_record(
        user_email=user_email,
        metric_name=body.metric_name,
        metric_value=body.metric_value,
        category=body.category
    )
    
    if not success:
        raise HTTPException(status_code=500, detail="Failed to create analytics record")
    
    return {"message": "Analytics record created successfully"}


@router.get("")
def get_analytics(user_email: str = Depends(verify_token)):
    """Get all analytics records for the user"""
    sheets_service = get_sheets_service()
    
    if not sheets_service or not sheets_service.is_available():
        raise HTTPException(status_code=500, detail="Google Sheets service not available")
    
    records = sheets_service.get_analytics(user_email)
    return {"records": records}
```

## 🔌 Step 6: Register New Routes in main.py

Update `backend/main.py`:

```python
from app.routes import otp, dashboard, inventory, analytics

# ... existing code ...

app.include_router(otp.router)
app.include_router(dashboard.router)
app.include_router(inventory.router)  # ✨ NEW
app.include_router(analytics.router)  # ✨ NEW
```

## 🧪 Step 7: Testing

### Test 1: Verify Google Sheets Connection

```bash
# In Python shell
from app.services.sheets import get_sheets_service

service = get_sheets_service()
print(f"Service available: {service.is_available()}")
```

### Test 2: Create User

```bash
# Test OTP flow
curl -X POST http://localhost:8000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Check Google Sheet - user should be created
```

### Test 3: Create Inventory Item

```bash
# Get token first (from OTP verification)
TOKEN="your-jwt-token"

curl -X POST http://localhost:8000/api/inventory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "item_name": "Tomatoes",
    "quantity": 5,
    "unit": "kg",
    "expiry_date": "2024-01-25",
    "category": "vegetables"
  }'

# Check Google Sheet - inventory item should be created
```

### Test 4: Get Dashboard

```bash
TOKEN="your-jwt-token"

curl -X GET http://localhost:8000/api/dashboard \
  -H "Authorization: Bearer $TOKEN"

# Should return user data, inventory items, and analytics from Google Sheets
```

## 📋 Implementation Checklist

- [ ] Google Cloud project created and configured
- [ ] Service account JSON key downloaded
- [ ] Google Sheet shared with service account
- [ ] Sheet structure created (Users, Inventory, Analytics tabs)
- [ ] `backend/credentials.json` file created
- [ ] `.env` updated with GOOGLE_SHEETS_ID
- [ ] `backend/app/services/sheets.py` reviewed and understood
- [ ] OTP verification endpoint updated to create users
- [ ] Dashboard endpoint updated to fetch from Google Sheets
- [ ] `backend/app/routes/inventory.py` created
- [ ] `backend/app/routes/analytics.py` created
- [ ] `backend/main.py` updated with new routes
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Test OTP flow creates user in Google Sheets
- [ ] Test inventory endpoints work
- [ ] Test analytics endpoints work
- [ ] Test dashboard displays data from Google Sheets
- [ ] End-to-end flow tested

## 🚀 Running the Tests

```bash
# Install dependencies
cd backend
pip install -r requirements.txt

# Start backend
uvicorn main:app --reload

# In another terminal, run tests
python -m pytest tests/  # if tests exist

# Or manually test with curl commands above
```

## 🆘 Troubleshooting

### "Google Sheets service not available"
- Check that `credentials.json` exists in `backend/`
- Verify `GOOGLE_SHEETS_ID` is set in `.env`
- Check backend logs for authentication errors

### "Permission denied" when accessing Google Sheet
- Verify service account email is shared with the Google Sheet
- Check that the email has "Editor" access
- Wait a few minutes for permissions to propagate

### "Sheet not found" error
- Verify sheet names are exactly: "Users", "Inventory", "Analytics"
- Check that sheets exist in the Google Sheet
- Verify sheet names match in the code

### Data not appearing in Google Sheet
- Check backend logs for errors
- Verify the data format matches the sheet structure
- Test the Google Sheets API directly with the test code

## 📚 Reference

- Google Sheets Service: `backend/app/services/sheets.py`
- OTP Routes: `backend/app/routes/otp.py`
- Dashboard Routes: `backend/app/routes/dashboard.py`
- Google Sheets Setup: `GOOGLE_SHEETS_SETUP.md`

## 💡 Tips

1. **Test incrementally**: Test each endpoint as you implement it
2. **Check logs**: Always check `docker-compose logs backend` for errors
3. **Verify data**: Check the Google Sheet directly to verify data is being written
4. **Use Postman**: Use Postman or similar tool to test API endpoints
5. **Keep credentials safe**: Never commit `credentials.json` to version control

Good luck! 🚀
