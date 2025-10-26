#!/bin/bash

# Health Check Script for Local Docker Services
# Verifies PostgreSQL, PostgREST, and n8n are running

set -e

echo "🔍 Checking local services health..."

# Check PostgreSQL
echo "📊 Checking PostgreSQL..."
if docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
  echo "✓ PostgreSQL is healthy (port 5434)"
else
  echo "❌ PostgreSQL is not responding"
  exit 1
fi

# Check PostgREST
echo "🔌 Checking PostgREST API..."
if curl -I http://localhost:3001/ 2>&1 | grep -q "HTTP"; then
  echo "✓ PostgREST is healthy (port 3001)"
else
  echo "❌ PostgREST is not responding"
  exit 1
fi

# Check n8n
echo "⚙️  Checking n8n..."
if curl -sf http://localhost:5678/healthz > /dev/null 2>&1; then
  echo "✓ n8n is healthy"
else
  echo "❌ n8n is not responding"
  exit 1
fi

echo ""
echo "✨ All services are healthy!"
echo ""
echo "Service URLs:"
echo "  PostgreSQL:  postgresql://postgres:localdev123@localhost:5434/jobapp"
echo "  PostgREST:   http://localhost:3001"
echo "  n8n:         http://localhost:5678 (admin / localdev123)"
echo ""
echo "Note: Port 5434 used for PostgreSQL to avoid conflict with local PostgreSQL on 5432"
echo "Note: Port 3001 used for PostgREST to avoid conflict with Next.js dev server on 3000"
