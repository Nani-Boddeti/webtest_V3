#!/bin/bash
# Test Runner for Service Booking System
# Runs all test suites and generates reports

set -e

echo "=========================================="
echo "  Service Booking System - Test Suite"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

overall_pass=0

# 1. Booking Logic Unit Tests
echo -e "${YELLOW}[1/3] Booking Logic Unit Tests${NC}"
echo "------------------------------------------"
if node tests/test_booking_logic.mjs; then
    echo -e "${GREEN}✅ Booking logic tests PASSED${NC}"
else
    echo -e "${RED}❌ Booking logic tests FAILED${NC}"
    overall_pass=1
fi
echo ""

# 2. AI Accuracy Tests
echo -e "${YELLOW}[2/3] AI Intent Accuracy Tests${NC}"
echo "------------------------------------------"
if node tests/test_ai_accuracy.mjs; then
    echo -e "${GREEN}✅ AI accuracy tests PASSED${NC}"
else
    echo -e "${RED}❌ AI accuracy tests FAILED${NC}"
    overall_pass=1
fi
echo ""

# 3. E2E Acceptance Tests
echo -e "${YELLOW}[3/3] E2E Acceptance Tests${NC}"
echo "------------------------------------------"
if node tests/test_e2e_acceptance.mjs; then
    echo -e "${GREEN}✅ E2E acceptance tests PASSED${NC}"
else
    echo -e "${RED}❌ E2E acceptance tests FAILED${NC}"
    overall_pass=1
fi
echo ""

# Summary
echo "=========================================="
if [ $overall_pass -eq 0 ]; then
    echo -e "${GREEN}  ALL TESTS PASSED ✅${NC}"
else
    echo -e "${RED}  SOME TESTS FAILED ❌${NC}"
fi
echo "=========================================="

exit $overall_pass
