#!/bin/bash

# Test script for API endpoints
# Usage: ./test_endpoints.sh http://localhost:8000

BASE_URL=${1:-http://localhost:8000}

echo "Testing API endpoints at $BASE_URL"
echo ""

# Health check
echo "1. Health check:"
curl -s "$BASE_URL/v1/health" | jq .
echo ""

# Pricing
echo "2. Pricing:"
curl -s "$BASE_URL/v1/pricing" | jq .
echo ""

# Free quota
echo "3. Free quota:"
curl -s "$BASE_URL/v1/free-quota" | jq .
echo ""

# Request magic link
echo "4. Request magic link:"
curl -s -X POST "$BASE_URL/v1/auth/request-magic-link" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}' | jq .
echo ""

echo "Note: For job creation endpoints, you'll need to provide files and authentication."
echo "See README.md for full testing instructions."
