import jwt
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional
from app.config.settings import JWT_SECRET, JWT_ALGORITHM

router = APIRouter(prefix="/api", tags=["dashboard"])


def verify_token(authorization: Optional[str] = Header(None)) -> str:
    """Verify JWT token and return user email"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    try:
        # Extract token from "Bearer <token>"
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authorization scheme")
        
        # Decode token
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email = payload.get("sub")
        
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        return email
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid authorization header format")


@router.get("/dashboard")
def get_dashboard(user_email: str = Depends(verify_token)):
    """Get dashboard data for authenticated user"""
    
    # Sample data for demo
    dashboard_data = {
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
            {
                "id": "2",
                "item_name": "Milk",
                "quantity": 2,
                "unit": "liters",
                "expiry_date": "2024-01-20",
                "category": "dairy",
            },
            {
                "id": "3",
                "item_name": "Bread",
                "quantity": 1,
                "unit": "loaf",
                "expiry_date": "2024-01-18",
                "category": "bakery",
            },
        ],
        "analytics": {
            "total_food_saved": 45.5,
            "waste_reduction_percentage": 32,
            "items_tracked": 3,
        },
    }
    
    return dashboard_data
