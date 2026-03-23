#!/bin/bash
# API Snap End-to-End Validation Script
# Run against a local or production instance to verify the full user journey.
# Usage: ./scripts/validate.sh [BASE_URL]

set -euo pipefail

BASE="${1:-http://localhost:3000}"
COOKIES=$(mktemp)
PASS=0
FAIL=0
EMAIL="validate-$(date +%s)@test.local"
PASSWORD="testpass12345"

green() { printf "\033[32m✓ %s\033[0m\n" "$1"; }
red()   { printf "\033[31m✗ %s\033[0m\n" "$1"; }

check() {
  local desc="$1" actual="$2" expected="$3"
  if echo "$actual" | grep -q "$expected"; then
    green "$desc"
    PASS=$((PASS + 1))
  else
    red "$desc (expected '$expected', got: $actual)"
    FAIL=$((FAIL + 1))
  fi
}

check_status() {
  local desc="$1" url="$2" expected="${3:-200}"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  check "$desc" "$code" "$expected"
}

echo "=== API Snap Validation ($BASE) ==="
echo ""

# --- Auth Flow ---
echo "--- Auth ---"

RES=$(curl -s -c "$COOKIES" -X POST "$BASE/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
check "Signup" "$RES" '"ok":true'

RES=$(curl -s -c "$COOKIES" -X POST "$BASE/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
check "Duplicate signup blocked" "$RES" "already registered"

RES=$(curl -s -c "$COOKIES" -X POST "$BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
check "Login" "$RES" '"ok":true'

RES=$(curl -s -b "$COOKIES" "$BASE/api/usage")
check "Usage endpoint (authenticated)" "$RES" '"plan":"free"'

# --- API Key ---
echo ""
echo "--- API Keys ---"

RES=$(curl -s -b "$COOKIES" -X POST "$BASE/api/keys" \
  -H "Content-Type: application/json" \
  -d '{"name":"validate-key"}')
check "Create API key" "$RES" '"key":"snp_'

API_KEY=$(echo "$RES" | grep -o '"key":"[^"]*"' | cut -d'"' -f4)

RES=$(curl -s -b "$COOKIES" "$BASE/api/keys")
check "List API keys" "$RES" "validate-key"

# --- Endpoints ---
echo ""
echo "--- API Endpoints ---"

# 1. QR
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/qr?data=test" -H "Authorization: Bearer $API_KEY")
check "QR code generation" "$CODE" "200"

# 2. Hash
RES=$(curl -s "$BASE/api/hash?text=hello&algorithm=sha256" -H "Authorization: Bearer $API_KEY")
check "Hash (SHA-256)" "$RES" "2cf24dba5fb0a30e"

# 3. UUID
RES=$(curl -s "$BASE/api/uuid?format=nanoid&count=2&prefix=test_" -H "Authorization: Bearer $API_KEY")
check "UUID generation" "$RES" "test_"

# 4. Base64
RES=$(curl -s -X POST "$BASE/api/base64" -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" -d '{"input":"hello","action":"encode"}')
check "Base64 encode" "$RES" "aGVsbG8="

# 5. JWT Decode
RES=$(curl -s -X POST "$BASE/api/jwt-decode" -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U"}')
check "JWT decode" "$RES" '"sub":"1234567890"'

# 6. Color
RES=$(curl -s "$BASE/api/color?color=%23ff0000" -H "Authorization: Bearer $API_KEY")
check "Color conversion" "$RES" '"hex":"#ff0000"'

# 7. Lorem
RES=$(curl -s "$BASE/api/lorem?paragraphs=1&sentences=1" -H "Authorization: Bearer $API_KEY")
check "Lorem ipsum" "$RES" '"text":'

# 8. Placeholder
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/placeholder?w=100&h=100" -H "Authorization: Bearer $API_KEY")
check "Placeholder image" "$CODE" "200"

# 9. Meta
RES=$(curl -s "$BASE/api/meta?url=https://example.com" -H "Authorization: Bearer $API_KEY")
check "URL metadata" "$RES" '"title":'

# 10. Resize
CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/resize" \
  -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" \
  -d '{"url":"https://picsum.photos/100","width":50,"format":"webp"}')
check "Image resize" "$CODE" "200"

# 11. Markdown
RES=$(curl -s -X POST "$BASE/api/markdown" -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" -d '{"markdown":"# Test"}')
check "Markdown to HTML" "$RES" "<h1>"

# 12. Screenshot
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/screenshot?url=https://example.com" -H "Authorization: Bearer $API_KEY")
check "Screenshot" "$CODE" "200"

# 13. PDF
CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/pdf" \
  -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" \
  -d '{"html":"<h1>Test</h1>"}')
check "HTML to PDF" "$CODE" "200"

# --- Error Handling ---
echo ""
echo "--- Error Handling ---"

RES=$(curl -s "$BASE/api/hash?text=hello" )
check "No auth → 401" "$RES" "API key required"

RES=$(curl -s "$BASE/api/hash?text=hello" -H "Authorization: Bearer snp_invalid")
check "Bad key → 401" "$RES" "Invalid API key"

RES=$(curl -s "$BASE/api/qr" -H "Authorization: Bearer $API_KEY")
check "Missing param → 400" "$RES" "Missing"

# --- Pages ---
echo ""
echo "--- Pages ---"

check_status "Landing page" "$BASE/"
check_status "Docs page" "$BASE/docs"
check_status "Pricing page" "$BASE/pricing"
check_status "Playground page" "$BASE/playground"
check_status "Signup page" "$BASE/signup"
check_status "Login page" "$BASE/login"
check_status "Dashboard page" "$BASE/dashboard"
check_status "SEO: QR Code" "$BASE/tools/qr-code-api"
check_status "SEO: Hash" "$BASE/tools/hash-api"

# --- Playground Proxy ---
echo ""
echo "--- Playground ---"

RES=$(curl -s -X POST "$BASE/api/playground" \
  -H "Content-Type: application/json" \
  -d '{"endpoint":"hash","params":{"text":"hello","algorithm":"sha256"}}')
check "Playground proxy" "$RES" "2cf24dba5fb0a30e"

# --- Cleanup ---
curl -s -b "$COOKIES" -X POST "$BASE/api/auth/logout" > /dev/null
rm -f "$COOKIES"

# --- Summary ---
echo ""
echo "================================"
TOTAL=$((PASS + FAIL))
echo "Results: $PASS/$TOTAL passed"
if [ "$FAIL" -gt 0 ]; then
  red "$FAIL test(s) failed"
  exit 1
else
  green "All tests passed!"
fi
