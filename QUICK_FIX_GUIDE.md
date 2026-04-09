# Quick Fix Guide - Get Running in 5 Minutes

## 🚀 TL;DR - Just Run These Commands

```bash
# 1. Install frontend dependencies
npm install

# 2. Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..

# 3. Start frontend (Terminal 1)
npm run dev

# 4. Start backend (Terminal 2)
cd backend
uvicorn main:app --reload

# 5. Open browser
# Frontend: http://localhost:5173
# Backend: http://localhost:8000/api/health
```

---

## ✅ What Was Fixed

| Issue | Fix |
|-------|-----|
| CallToAction duplicate component | ✅ Merged into one clean component |
| Missing JWT/email packages | ✅ Added to requirements.txt |
| Dashboard router not registered | ✅ Added to backend/main.py |
| Build errors | ✅ All resolved |

---

## 🔧 Environment Setup

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### Backend (.env)
```env
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your-secret-key-min-32-chars
BREVO_SMTP_SERVER=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_EMAIL=your-email@brevo.com
BREVO_PASSWORD=your-password
BREVO_SENDER_EMAIL=noreply@zinova.com
```

---

## 📊 Port Configuration

| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Backend | 8000 | http://localhost:8000 |
| API | 8000 | http://localhost:8000/api |

---

## 🧪 Quick Tests

### Test Frontend
```bash
npm run dev
# Should load without errors
```

### Test Backend
```bash
cd backend
uvicorn main:app --reload
# Should start without errors
```

### Test API Health
```bash
curl http://localhost:8000/api/health
# Should return: {"status": "ok"}
```

---

## 🐛 Common Issues & Fixes

### "npm ERR! Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### "ModuleNotFoundError" in backend
```bash
cd backend
pip install --upgrade -r requirements.txt
```

### "Port already in use"
```bash
# macOS/Linux
lsof -ti:5173 | xargs kill -9  # Frontend
lsof -ti:8000 | xargs kill -9  # Backend

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### "CORS error"
Make sure `.env` has correct URLs:
```env
# Backend .env
CORS_ORIGIN=http://localhost:5173

# Frontend .env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/components/CallToAction.tsx` | Fixed component |
| `backend/requirements.txt` | Updated dependencies |
| `backend/main.py` | Updated with dashboard router |
| `MERGE_FIXES.md` | Detailed explanation |
| `DEMO_READY.md` | Demo preparation |

---

## ✨ Features Ready

✅ OTP Authentication
✅ Dashboard
✅ Form Submission
✅ Page Transitions
✅ Dark Mode
✅ Responsive Design

---

## 🎯 Next Steps

1. Run the commands above
2. Test both frontend and backend
3. Check MERGE_FIXES.md for details
4. Follow DEMO_READY.md for demo prep
5. Deploy with Docker when ready

---

**Everything is fixed and ready to go! 🚀**
