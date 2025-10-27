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

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for required commands
if ! command_exists sanity; then
    print_message "$RED" "Error: Sanity CLI is not installed. Please install it first with:"
    print_message "$RED" "npm install -g @sanity/cli"
    exit 1
fi

# Function to load environment variables
load_env() {
    local env_file="../.env.local"
    if [ ! -f "$env_file" ]; then
        env_file=".env.local"
    fi

    if [ ! -f "$env_file" ]; then
        print_message "$RED" "Error: .env.local file not found in current directory or parent directory"
        exit 1
    fi

    print_message "$YELLOW" "Loading environment variables from $env_file..."
    source "$env_file"
}

# Function to validate environment variables
validate_env() {
    local required_vars=(
        "SANITY_STUDIO_PROJECT_ID"
        "SANITY_STUDIO_DATASET"
        "SANITY_STUDIO_API_TOKEN"
    )

    local missing_vars=()
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done

    if [ ${#missing_vars[@]} -ne 0 ]; then
        print_message "$RED" "Error: The following required environment variables are not set:"
        printf '%s\n' "${missing_vars[@]}"
        exit 1
    fi

    print_message "$GREEN" "✅ All required environment variables are set"
}

# Function to create the webhook
create_webhook() {
    local project_id="$SANITY_STUDIO_PROJECT_ID"
    local dataset="$SANITY_STUDIO_DATASET"
    local token="$SANITY_STUDIO_API_TOKEN"
    local webhook_name="Recycling Bin Webhook"
    local webhook_url="https://${project_id}.api.sanity.io/v2025-05-06/data/mutate/${dataset}"

    print_message "$YELLOW" "Creating webhook..."
    print_message "$YELLOW" "Project ID: ${project_id}"
    print_message "$YELLOW" "Dataset: ${dataset}"
    print_message "$YELLOW" "Webhook URL: ${webhook_url}"

    # Create the webhook using Sanity CLI
    local response=$(sanity hook create \
        --name "$webhook_name" \
        --url "$webhook_url" \
        --description "Webhook for tracking deleted documents in the recycling bin" \
        --http-method POST \
        --header "Authorization: Bearer ${token}" \
        --filter '{"documentTypes": ["*"], "operations": ["delete"], "delta": {"operation": "delete"}}' \
        --projection '{
            "mutations": [
                {
                    "patch": {
                        "query": "*[_type == '\''deletedDocs.bin'\'' && _id == '\''deletedDocs.bin'\'']",
                        "setIfMissing": {"deletedDocIds": []},
                        "insert": {
                            "before": "deletedDocIds[0]",
                            "items": ["_id"]
                        }
                    }
                },
                {
                    "patch": {
                        "query": "*[_type == '\''deletedDocs.bin'\'' && _id == '\''deletedDocs.bin'\'']",
                        "setIfMissing": {"deletedDocLogs": []},
                        "insert": {
                            "before": "deletedDocLogs[0]",
                            "items": [{
                                "docId": "_id",
                                "deletedAt": "now()",
                                "type": "_type",
                                "documentTitle": "coalesce(title, name)",
                                "_key": "_rev",
                                "deletedBy": "identity()"
                            }]
                        }
                    }
                }
            ]
        }')

    if [ $? -eq 0 ]; then
        print_message "$GREEN" "✅ Webhook created successfully!"
        print_message "$GREEN" "Name: ${webhook_name}"
        print_message "$GREEN" "URL: ${webhook_url}"
        print_message "$GREEN" "Response:"
        echo "$response"

        # List all webhooks to verify
        print_message "$YELLOW" "\nListing all webhooks..."
        sanity hook list
    else
        print_message "$RED" "❌ Failed to create webhook"
        print_message "$RED" "Error: $response"
        exit 1
    fi
}

# Main execution
print_message "$YELLOW" "Starting webhook creation process..."

# Load and validate environment variables
load_env
validate_env

# Create the webhook
create_webhook

print_message "$GREEN" "🎉 Webhook setup completed successfully!" 