# Zinova Deployment Guide

This guide covers deploying Zinova using Docker Compose for both development and production environments.

## Prerequisites

- Docker and Docker Compose installed
- Brevo SMTP credentials (for OTP emails)
- A strong JWT_SECRET (minimum 32 characters)

## Quick Start (Development)

### 1. Clone and Setup

```bash
git clone <repository-url>
cd zinova
```

### 2. Create Environment File

```bash
cp .env.docker .env
```

Edit `.env` and fill in your credentials:

```env
# PostgreSQL
POSTGRES_USER=zinova_user
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=zinova_db

# Backend
JWT_SECRET=your-very-secure-secret-key-min-32-chars
CORS_ORIGIN=http://localhost

# Brevo SMTP
BREVO_SMTP_SERVER=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_EMAIL=your-brevo-email@example.com
BREVO_PASSWORD=your-brevo-password
BREVO_SENDER_EMAIL=noreply@zinova.com
```

### 3. Build and Start Services

```bash
docker-compose up --build
```

This will:
- Build the frontend React app
- Build the backend FastAPI app
- Start PostgreSQL database
- Start the backend service
- Start the frontend with Nginx reverse proxy

### 4. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost/api
- **Health Check**: http://localhost/api/health

### 5. Test the Flow

1. Go to http://localhost/login
2. Enter your email address
3. Check your email for the OTP code
4. Enter the OTP code
5. You should be redirected to the dashboard

## Environment Variables

### Frontend (.env)

```env
VITE_API_BASE_URL=/api
VITE_LOG_LEVEL=debug
```

### Backend (.env)

```env
# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# JWT Configuration
JWT_SECRET=your-secret-key-min-32-chars

# Brevo SMTP
BREVO_SMTP_SERVER=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_EMAIL=your-email@brevo.com
BREVO_PASSWORD=your-password
BREVO_SENDER_EMAIL=noreply@zinova.com

# Google Sheets (for future use)
GOOGLE_SHEETS_CREDENTIALS_PATH=/app/credentials.json
GOOGLE_SHEETS_ID=your-sheet-id
```

## Docker Compose Services

### Frontend Service
- **Port**: 80 (exposed)
- **Build**: Multi-stage build with Node.js and Nginx
- **Purpose**: Serves React app and proxies /api requests to backend

### Backend Service
- **Port**: 8000 (internal)
- **Build**: Python 3.12 with FastAPI
- **Purpose**: Handles authentication, data endpoints, and business logic
- **Health Check**: Checks /api/health endpoint every 10 seconds

### Database Service
- **Port**: 5432 (internal)
- **Image**: PostgreSQL 16 Alpine
- **Purpose**: Stores user and application data
- **Health Check**: Verifies database is ready before starting backend

## Common Commands

### Start Services
```bash
docker-compose up
```

### Start in Background
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f
```

### View Specific Service Logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Rebuild Images
```bash
docker-compose up --build
```

### Remove Everything (including volumes)
```bash
docker-compose down -v
```

## Troubleshooting

### Backend Health Check Failing

If the backend health check is failing:

1. Check backend logs:
   ```bash
   docker-compose logs backend
   ```

2. Verify environment variables are set correctly in `.env`

3. Ensure JWT_SECRET is set and at least 32 characters

### Frontend Not Loading

1. Check frontend logs:
   ```bash
   docker-compose logs frontend
   ```

2. Verify Nginx configuration in `nginx/nginx.conf`

3. Check that backend is healthy:
   ```bash
   curl http://localhost/api/health
   ```

### Database Connection Issues

1. Check database logs:
   ```bash
   docker-compose logs db
   ```

2. Verify PostgreSQL credentials in `.env`

3. Ensure database is healthy:
   ```bash
   docker-compose ps
   ```

### OTP Not Sending

1. Verify Brevo SMTP credentials in `.env`

2. Check backend logs for SMTP errors:
   ```bash
   docker-compose logs backend | grep -i smtp
   ```

3. Test SMTP connection manually:
   ```bash
   python -c "
   import smtplib
   server = smtplib.SMTP('smtp-relay.brevo.com', 587)
   server.starttls()
   server.login('your-email', 'your-password')
   print('SMTP connection successful')
   "
   ```

## Production Deployment

For production deployment:

1. **Update CORS_ORIGIN** to your production domain
2. **Generate a strong JWT_SECRET** (use `openssl rand -base64 32`)
3. **Use environment-specific .env files**
4. **Enable HTTPS** with a reverse proxy (e.g., Traefik, Nginx)
5. **Set up proper logging and monitoring**
6. **Use a production database** (managed PostgreSQL service)
7. **Configure backup strategies** for the database

### Example Production .env

```env
POSTGRES_USER=zinova_prod
POSTGRES_PASSWORD=very-secure-password-here
POSTGRES_DB=zinova_production

JWT_SECRET=your-production-secret-key-min-32-chars
CORS_ORIGIN=https://zinova.example.com

BREVO_SMTP_SERVER=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_EMAIL=production-email@brevo.com
BREVO_PASSWORD=production-password
BREVO_SENDER_EMAIL=noreply@zinova.example.com
```

## Health Checks

The application includes health checks for all services:

- **Backend**: GET /api/health (returns `{"status": "ok"}`)
- **Database**: PostgreSQL readiness check
- **Frontend**: Nginx is always ready once built

Monitor health status:
```bash
docker-compose ps
```

## Performance Optimization

### Frontend
- Multi-stage Docker build reduces image size
- Nginx gzip compression enabled
- Static asset caching configured

### Backend
- Uvicorn with async request handling
- Connection pooling for database
- OTP in-memory caching

### Database
- PostgreSQL 16 Alpine (lightweight)
- Persistent volume for data
- Health checks ensure availability

## Next Steps

1. **Set up Google Sheets integration** for persistent data storage
2. **Add form validation** with React Hook Form + Zod
3. **Implement analytics** with Recharts
4. **Set up monitoring** with Prometheus/Grafana
5. **Configure CI/CD** with GitHub Actions or similar
6. **Set up SSL/TLS** for production HTTPS

## Support

For issues or questions:
1. Check the logs: `docker-compose logs -f`
2. Review the requirements in `.kiro/specs/production-integration/requirements.md`
3. Check the design document in `.kiro/specs/production-integration/design.md`
