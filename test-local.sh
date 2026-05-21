#!/bin/bash

# Local Testing Script for OMS Call Center Customization Assistant
# This script tests the updated API server with feedback and visitor tracking

echo "🧪 Testing OMS Call Center Customization Assistant Locally"
echo "=========================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if npm install completed
echo "📦 Step 1: Checking dependencies..."
cd /Users/satendrapatel/Documents/Projects/callcenter-customization-assistance/api-server

if [ ! -d "node_modules/better-sqlite3" ]; then
    echo -e "${YELLOW}⚠️  better-sqlite3 not found. Installing dependencies...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ npm install failed${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Start API server in background
echo "🚀 Step 2: Starting API server on port 5000..."
node server.js &
API_PID=$!
echo "API Server PID: $API_PID"
sleep 3

# Test if server started
if ! ps -p $API_PID > /dev/null; then
    echo -e "${RED}❌ API server failed to start${NC}"
    exit 1
fi
echo -e "${GREEN}✅ API server started${NC}"
echo ""

# Test endpoints
echo "🔍 Step 3: Testing API endpoints..."
echo ""

# Test 1: Health check
echo "Test 1: Health Check"
HEALTH=$(curl -s http://localhost:5000/health)
if echo "$HEALTH" | grep -q "ok"; then
    echo -e "${GREEN}✅ Health check passed${NC}"
else
    echo -e "${RED}❌ Health check failed${NC}"
    kill $API_PID
    exit 1
fi
echo ""

# Test 2: Get guides
echo "Test 2: Get Guides"
GUIDES=$(curl -s http://localhost:5000/api/guides)
if echo "$GUIDES" | grep -q "success"; then
    echo -e "${GREEN}✅ Get guides passed${NC}"
else
    echo -e "${RED}❌ Get guides failed${NC}"
    kill $API_PID
    exit 1
fi
echo ""

# Test 3: Get specific guide
echo "Test 3: Get Specific Guide (setup-dev-environment)"
GUIDE=$(curl -s http://localhost:5000/api/guides/setup-dev-environment/html)
if echo "$GUIDE" | grep -q "success"; then
    echo -e "${GREEN}✅ Get specific guide passed${NC}"
else
    echo -e "${RED}❌ Get specific guide failed${NC}"
    kill $API_PID
    exit 1
fi
echo ""

# Test 4: Track visitor
echo "Test 4: Track Visitor"
TRACK=$(curl -s -X POST http://localhost:5000/api/track)
if echo "$TRACK" | grep -q "ok"; then
    echo -e "${GREEN}✅ Track visitor passed${NC}"
else
    echo -e "${RED}❌ Track visitor failed${NC}"
    kill $API_PID
    exit 1
fi
echo ""

# Test 5: Get visitors
echo "Test 5: Get Visitors"
VISITORS=$(curl -s http://localhost:5000/api/visitors)
if echo "$VISITORS" | grep -q "ip"; then
    echo -e "${GREEN}✅ Get visitors passed${NC}"
    echo "   Found $(echo "$VISITORS" | grep -o '"ip"' | wc -l) visitor(s)"
else
    echo -e "${RED}❌ Get visitors failed${NC}"
    kill $API_PID
    exit 1
fi
echo ""

# Test 6: Save feedback
echo "Test 6: Save Feedback"
FEEDBACK=$(curl -s -X POST http://localhost:5000/api/feedback \
    -H "Content-Type: application/json" \
    -d '{"msgId":"test_123","reaction":"like","timeSaved":"5","comments":"Great guide!","timestamp":"2026-05-21T06:00:00.000Z"}')
if echo "$FEEDBACK" | grep -q "saved"; then
    echo -e "${GREEN}✅ Save feedback passed${NC}"
else
    echo -e "${RED}❌ Save feedback failed${NC}"
    kill $API_PID
    exit 1
fi
echo ""

# Test 7: Get feedback
echo "Test 7: Get Feedback"
FEEDBACK_LIST=$(curl -s http://localhost:5000/api/feedback)
if echo "$FEEDBACK_LIST" | grep -q "msgId"; then
    echo -e "${GREEN}✅ Get feedback passed${NC}"
    echo "   Found $(echo "$FEEDBACK_LIST" | grep -o '"msgId"' | wc -l) feedback(s)"
else
    echo -e "${RED}❌ Get feedback failed${NC}"
    kill $API_PID
    exit 1
fi
echo ""

# Test 8: Check database file
echo "Test 8: Check Database File"
if [ -f "oms-chatbot.db" ]; then
    echo -e "${GREEN}✅ Database file created${NC}"
    echo "   Size: $(du -h oms-chatbot.db | cut -f1)"
else
    echo -e "${RED}❌ Database file not found${NC}"
    kill $API_PID
    exit 1
fi
echo ""

# Summary
echo "=========================================================="
echo -e "${GREEN}✅ All tests passed!${NC}"
echo ""
echo "📊 Summary:"
echo "   - API server running on http://localhost:5000"
echo "   - Database: oms-chatbot.db"
echo "   - All endpoints working correctly"
echo ""
echo "🌐 Next Steps:"
echo "   1. Open browser: http://localhost:8080 (start web server first)"
echo "   2. Test chatbot interface"
echo "   3. Test feedback buttons"
echo "   4. Test admin panel (type 'admin', password: 2026)"
echo ""
echo "🛑 To stop API server:"
echo "   kill $API_PID"
echo ""
echo "📝 To view database:"
echo "   sqlite3 api-server/oms-chatbot.db"
echo "   sqlite> SELECT * FROM visitors;"
echo "   sqlite> SELECT * FROM feedback;"
echo ""

# Keep server running
echo "⏳ API server is running. Press Ctrl+C to stop..."
wait $API_PID

# Made with Bob
