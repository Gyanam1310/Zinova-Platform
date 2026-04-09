#!/bin/bash

# Zinova Quick Start Script
# This script helps you set up and start the Zinova application

set -e

echo "🚀 Zinova - AI-Based Food Optimization Platform"
echo "================================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.docker .env
    echo "⚠️  Please edit .env and add your Brevo SMTP credentials"
    echo "   Then run this script again."
    echo ""
    echo "   Required fields:"
    echo "   - POSTGRES_PASSWORD"
    echo "   - JWT_SECRET (min 32 characters)"
    echo "   - BREVO_EMAIL"
    echo "   - BREVO_PASSWORD"
    echo ""
    exit 0
fi

echo "✅ .env file found"
echo ""

# Check if required environment variables are set
if grep -q "your-brevo-email@example.com" .env; then
    echo "❌ Please update BREVO_EMAIL in .env file"
    exit 1
fi

if grep -q "your-brevo-password" .env; then
    echo "❌ Please update BREVO_PASSWORD in .env file"
    exit 1
fi

if grep -q "change_me_to_secure_password" .env; then
    echo "❌ Please update POSTGRES_PASSWORD in .env file"
    exit 1
fi

echo "✅ Environment variables are configured"
echo ""

# Build and start services
echo "🔨 Building Docker images..."
docker-compose build

echo ""
echo "🚀 Starting services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check if services are running
if docker-compose ps | grep -q "backend.*Up"; then
    echo "✅ Backend is running"
else
    echo "❌ Backend failed to start"
    docker-compose logs backend
    exit 1
fi

if docker-compose ps | grep -q "frontend.*Up"; then
    echo "✅ Frontend is running"
else
    echo "❌ Frontend failed to start"
    docker-compose logs frontend
    exit 1
fi

if docker-compose ps | grep -q "db.*Up"; then
    echo "✅ Database is running"
else
    echo "❌ Database failed to start"
    docker-compose logs db
    exit 1
fi

echo ""
echo "================================================"
echo "✅ Zinova is ready!"
echo "================================================"
echo ""
echo "🌐 Access the application:"
echo "   Frontend: http://localhost"
echo "   API: http://localhost/api"
echo "   Health: http://localhost/api/health"
echo ""
echo "📝 Test the flow:"
echo "   1. Go to http://localhost/login"
echo "   2. Enter your email"
echo "   3. Check your email for OTP"
echo "   4. Enter OTP code"
echo "   5. You should see the dashboard"
echo ""
echo "📋 Useful commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop: docker-compose down"
echo "   Restart: docker-compose restart"
echo ""
echo "📚 Documentation: See DEPLOYMENT.md for more details"
echo ""
