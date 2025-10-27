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

# Check if backup file is provided
if [ -z "$1" ]; then
    print_message "$RED" "Error: Please provide a backup file path"
    print_message "$YELLOW" "Usage: ./restore-dataset.sh <backup-file>"
    print_message "$YELLOW" "\nAvailable backups:"
    ls -lh backups/sanity_backup_*.tar.gz 2>/dev/null
    exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    print_message "$RED" "Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

print_message "$YELLOW" "Starting Sanity dataset restore..."

# Confirm before proceeding
read -p "This will overwrite your current dataset. Are you sure? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_message "$YELLOW" "Restore cancelled"
    exit 1
fi

# Import the dataset
print_message "$YELLOW" "Restoring dataset from $BACKUP_FILE..."
sanity dataset import "$BACKUP_FILE" production --replace

if [ $? -eq 0 ]; then
    print_message "$GREEN" "✓ Restore completed successfully!"
else
    print_message "$RED" "✗ Restore failed!"
    exit 1
fi 