@echo off
REM Zinova Quick Start Script for Windows
REM This script helps you set up and start the Zinova application

setlocal enabledelayedexpansion

echo.
echo 🚀 Zinova - AI-Based Food Optimization Platform
echo ================================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

echo ✅ Docker and Docker Compose are installed
echo.

REM Check if .env file exists
if not exist .env (
    echo 📝 Creating .env file from template...
    copy .env.docker .env
    echo ⚠️  Please edit .env and add your Brevo SMTP credentials
    echo    Then run this script again.
    echo.
    echo    Required fields:
    echo    - POSTGRES_PASSWORD
    echo    - JWT_SECRET (min 32 characters)
    echo    - BREVO_EMAIL
    echo    - BREVO_PASSWORD
    echo.
    pause
    exit /b 0
)

echo ✅ .env file found
echo.

REM Check if required environment variables are set
findstr /M "your-brevo-email@example.com" .env >nul
if not errorlevel 1 (
    echo ❌ Please update BREVO_EMAIL in .env file
    pause
    exit /b 1
)

findstr /M "your-brevo-password" .env >nul
if not errorlevel 1 (
    echo ❌ Please update BREVO_PASSWORD in .env file
    pause
    exit /b 1
)

findstr /M "change_me_to_secure_password" .env >nul
if not errorlevel 1 (
    echo ❌ Please update POSTGRES_PASSWORD in .env file
    pause
    exit /b 1
)

echo ✅ Environment variables are configured
echo.

REM Build and start services
echo 🔨 Building Docker images...
docker-compose build

echo.
echo 🚀 Starting services...
docker-compose up -d

echo.
echo ⏳ Waiting for services to be ready...
timeout /t 5 /nobreak

echo.
echo ================================================
echo ✅ Zinova is ready!
echo ================================================
echo.
echo 🌐 Access the application:
echo    Frontend: http://localhost
echo    API: http://localhost/api
echo    Health: http://localhost/api/health
echo.
echo 📝 Test the flow:
echo    1. Go to http://localhost/login
echo    2. Enter your email
echo    3. Check your email for OTP
echo    4. Enter OTP code
echo    5. You should see the dashboard
echo.
echo 📋 Useful commands:
echo    View logs: docker-compose logs -f
echo    Stop: docker-compose down
echo    Restart: docker-compose restart
echo.
echo 📚 Documentation: See DEPLOYMENT.md for more details
echo.
pause
