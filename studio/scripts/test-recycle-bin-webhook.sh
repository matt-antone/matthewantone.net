#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Check if we're in the right directory
if [ ! -f "sanity.config.ts" ]; then
    print_message "$RED" "Error: Must run this script from the studio directory"
    exit 1
fi

# Generate a unique test ID
TEST_ID="test_page_$(date +%s)"
print_message "$YELLOW" "Test ID: $TEST_ID"

# Step 1: Create a test page
print_message "$YELLOW" "\nStep 1: Creating test page..."
echo '{"_id":"'$TEST_ID'","_type":"page","title":"Test Page","content":"Test content"}' > test_page.ndjson
sanity dataset import test_page.ndjson production --replace
rm test_page.ndjson

# Step 2: Verify the page was created
print_message "$YELLOW" "\nStep 2: Verifying page creation..."
sanity documents query "*[_id == '$TEST_ID']"

# Step 3: Delete the page
print_message "$YELLOW" "\nStep 3: Deleting test page..."
sanity documents delete "$TEST_ID" --dataset production --yes

# Log the webhook payload for inspection
print_message "$YELLOW" "\nLogging webhook payload for inspection..."
echo '{"mutations":[{"patch":{"insert":{"before":"deletedDocIds[0]","items":["'$TEST_ID'"]},"query":"*[_type == '\''deletedDocs.bin'\'' \u0026\u0026 _id == '\''deletedDocs.bin'\'']","setIfMissing":{"deletedDocIds":[]}}},{"patch":{"insert":{"before":"deletedDocLogs[0]","items":[{"_key":"0ZIbI4mrGqwe0SjhxKgR4h","deletedAt":"'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'","deletedBy":"pdHTa4f1z","docId":"'$TEST_ID'","documentTitle":"Test Page","type":"page"}]},"query":"*[_type == '\''deletedDocs.bin'\'' \u0026\u0026 _id == '\''deletedDocs.bin'\'']","setIfMissing":{"deletedDocLogs":[]}}}]}' > webhook_payload.json
print_message "$GREEN" "Webhook payload logged to webhook_payload.json"

# Step 4: Check the recycle bin
print_message "$YELLOW" "\nStep 4: Checking recycle bin..."
sanity documents query '*[_type == "deletedDocs.bin" && _id == "deletedDocs.bin"]'

# Step 5: Check webhook delivery attempts log
echo "Step 5: Check webhook delivery attempts log"
sanity hook logs recycling_bin

print_message "$GREEN" "\nTest completed!" 