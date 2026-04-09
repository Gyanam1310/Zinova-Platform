# Zinova Quick Start Guide

Get Zinova running in minutes with Docker!

## 🚀 One-Command Start

### macOS/Linux
```bash
chmod +x start.sh
./start.sh
```

### Windows
```bash
start.bat
```

## 📋 Manual Setup (5 minutes)

### 1. Prerequisites
- Docker and Docker Compose installed
- Brevo SMTP credentials (for OTP emails)

### 2. Configure Environment

```bash
# Copy the template
cp .env.docker .env

# Edit .env with your credentials
# Required:
# - POSTGRES_PASSWORD (any secure password)
# - JWT_SECRET (generate: openssl rand -base64 32)
# - BREVO_EMAIL (your Brevo email)
# - BREVO_PASSWORD (your Brevo password)
```

### 3. Start Services

```bash
docker-compose up --build
```

### 4. Access Application

- **Frontend**: http://localhost
- **API**: http://localhost/api
- **Health Check**: http://localhost/api/health

## 🧪 Test the Complete Flow

1. **Open Login Page**
   ```
   http://localhost/login
   ```

2. **Enter Your Email**
   - Type any email address
   - Click "Send OTP"

3. **Check Email for OTP**
   - Look for email from Brevo
   - Copy the 6-digit code

4. **Enter OTP Code**
   - Paste the code in the OTP field
   - Click "Verify OTP"

5. **View Dashboard**
   - You should be redirected to the dashboard
   - See your email, inventory, and analytics

6. **Test Logout**
   - Click "Logout" button
   - You should be redirected to login page

## 🔧 Troubleshooting

### OTP Not Sending?

Check backend logs:
```bash
docker-compose logs backend | grep -i smtp
```

Verify Brevo credentials in `.env`:
- BREVO_EMAIL should be your Brevo login email
- BREVO_PASSWORD should be your Brevo SMTP password (not account password)

### Can't Access Frontend?

Check if services are running:
```bash
docker-compose ps
```

All three services should show "Up":
- frontend
- backend
- db

### Backend Health Check Failing?

Check backend logs:
```bash
docker-compose logs backend
```

Common issues:
- JWT_SECRET not set or too short (min 32 chars)
- BREVO credentials incorrect
- Port 8000 already in use

### Database Connection Issues?

Check database logs:
```bash
docker-compose logs db
```

Verify PostgreSQL credentials in `.env`:
- POSTGRES_USER: zinova_user
- POSTGRES_PASSWORD: your secure password
- POSTGRES_DB: zinova_db

## 📚 Architecture

```
┌─────────────────────────────────────────┐
│         User Browser                    │
│      http://localhost                   │
└────────────────┬────────────────────────┘
                 │
        ┌────────▼────────┐
        │  Nginx (Port 80)│
        │  Reverse Proxy  │
        └────────┬────────┘
                 │
    ┌────────────┼────────────┐
    │                         │
┌───▼────────┐      ┌────────▼──────┐
│  Frontend  │      │  Backend      │
│  React     │      │  FastAPI      │
│  (Port 80) │      │  (Port 8000)  │
└────────────┘      └────────┬──────┘
                             │
                    ┌────────▼────────┐
                    │  PostgreSQL     │
                    │  Database       │
                    │  (Port 5432)    │
                    └─────────────────┘
```

## 🔐 Security Notes

- **JWT_SECRET**: Generate a strong secret with `openssl rand -base64 32`
- **POSTGRES_PASSWORD**: Use a secure password, not "password"
- **BREVO_PASSWORD**: Use your SMTP password, not your account password
- **CORS_ORIGIN**: Set to your production domain in production

## 📊 What's Included

✅ **OTP Authentication**
- Email-based login with Brevo SMTP
- 6-digit OTP codes
- 10-minute expiration

✅ **Dashboard**
- User session information
- Food inventory tracking
- Analytics metrics

✅ **Backend API**
- FastAPI with async support
- JWT token authentication
- CORS configuration

✅ **Frontend**
- React 18 with TypeScript
- Tailwind CSS styling
- Shadcn UI components

✅ **Infrastructure**
- Docker containerization
- Nginx reverse proxy
- PostgreSQL database
- Health checks

## 🚀 Next Steps

### For Development
1. Explore the codebase in `src/` (frontend) and `backend/` (backend)
2. Check the spec documents in `.kiro/specs/production-integration/`
3. Run tests: `npm run test` (frontend), `pytest` (backend)

### For Production
1. Update `CORS_ORIGIN` to your domain
2. Generate a strong `JWT_SECRET`
3. Use a managed PostgreSQL service
4. Set up HTTPS with a reverse proxy
5. Configure monitoring and logging

### For Enhancement
1. **Google Sheets Integration**: Store data persistently
2. **Form Validation**: Add React Hook Form + Zod
3. **Analytics**: Add Recharts visualizations
4. **Testing**: Add property-based tests
5. **CI/CD**: Set up GitHub Actions

## 📖 Documentation

- **DEPLOYMENT.md**: Detailed deployment guide
- **README.md**: Project overview
- **.kiro/specs/production-integration/requirements.md**: 50 detailed requirements
- **.kiro/specs/production-integration/design.md**: Technical design document
- **.kiro/specs/production-integration/tasks.md**: Implementation tasks

## 💡 Tips

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Stop Services
```bash
docker-compose down
```

### Restart Services
```bash
docker-compose restart
```

### Remove Everything
```bash
docker-compose down -v
```

### Rebuild Images
```bash
docker-compose up --build
```

## 🆘 Need Help?

1. Check the logs: `docker-compose logs -f`
2. Review DEPLOYMENT.md for detailed troubleshooting
3. Check the spec documents for requirements and design
4. Verify all environment variables are set correctly

## 📝 Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| POSTGRES_USER | Yes | - | PostgreSQL username |
| POSTGRES_PASSWORD | Yes | - | PostgreSQL password |
| POSTGRES_DB | Yes | - | PostgreSQL database name |
| JWT_SECRET | Yes | - | JWT signing secret (min 32 chars) |
| CORS_ORIGIN | Yes | - | Frontend origin for CORS |
| BREVO_SMTP_SERVER | Yes | - | Brevo SMTP server |
| BREVO_SMTP_PORT | Yes | - | Brevo SMTP port |
| BREVO_EMAIL | Yes | - | Brevo SMTP email |
| BREVO_PASSWORD | Yes | - | Brevo SMTP password |
| BREVO_SENDER_EMAIL | No | BREVO_EMAIL | Email to send from |

## 🎉 You're Ready!

Your Zinova application is now running. Start testing and building!

```bash
# View the application
open http://localhost

# View the API
open http://localhost/api/health

# View logs
docker-compose logs -f
```

Happy coding! 🚀
