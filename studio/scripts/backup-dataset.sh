#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print messages
print_message() {
    echo -e "${1}${2}${NC}"
}

# Check if running from the correct directory
if [ ! -f "sanity.config.ts" ]; then
    print_message "$RED" "Error: Must run this script from the studio directory"
    exit 1
fi

# Check for required environment variables
if [ -z "$DROPBOX_ACCESS_TOKEN" ]; then
    print_message "$RED" "Error: DROPBOX_ACCESS_TOKEN environment variable is not set"
    print_message "$YELLOW" "Please set your Dropbox access token:"
    print_message "$YELLOW" "export DROPBOX_ACCESS_TOKEN='your_access_token'"
    exit 1
fi

# Create temporary directory for backup
TEMP_DIR=$(mktemp -d)
BACKUP_FILE="$TEMP_DIR/sanity_backup_$(date +"%Y%m%d_%H%M%S").tar.gz"

print_message "$YELLOW" "Starting Sanity dataset backup..."

# Export the dataset
print_message "$YELLOW" "Exporting dataset to temporary file..."
sanity dataset export production "$BACKUP_FILE"

if [ $? -ne 0 ]; then
    print_message "$RED" "✗ Backup failed!"
    rm -rf "$TEMP_DIR"
    exit 1
fi

# Upload to Dropbox
print_message "$YELLOW" "Uploading backup to Dropbox..."
DROPBOX_PATH="/sanity_backups/$(basename "$BACKUP_FILE")"

# Upload using curl
UPLOAD_RESPONSE=$(curl -s -X POST https://content.dropboxapi.com/2/files/upload \
    --header "Authorization: Bearer $DROPBOX_ACCESS_TOKEN" \
    --header "Dropbox-API-Arg: {\"path\":\"$DROPBOX_PATH\",\"mode\":\"add\",\"autorename\":true}" \
    --header "Content-Type: application/octet-stream" \
    --data-binary @"$BACKUP_FILE")

# Check if upload was successful
if [[ $UPLOAD_RESPONSE == *"error"* ]]; then
    print_message "$RED" "✗ Upload to Dropbox failed!"
    print_message "$RED" "Error: $UPLOAD_RESPONSE"
    rm -rf "$TEMP_DIR"
    exit 1
fi

print_message "$GREEN" "✓ Backup completed successfully!"
print_message "$GREEN" "Backup uploaded to Dropbox: $DROPBOX_PATH"

# Clean up temporary directory
rm -rf "$TEMP_DIR"

# List recent backups in Dropbox
print_message "$YELLOW" "\nRecent backups in Dropbox:"
curl -s -X POST https://api.dropboxapi.com/2/files/list_folder \
    --header "Authorization: Bearer $DROPBOX_ACCESS_TOKEN" \
    --header "Content-Type: application/json" \
    --data "{\"path\":\"/sanity_backups\",\"limit\":5}" | jq -r '.entries[] | "\(.name) (\(.size) bytes)"' 