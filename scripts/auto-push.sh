#!/bin/bash

# Auto Push Script for HVAC Smart Control System
# Usage: ./scripts/auto-push.sh "Your commit message"

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[AUTO-PUSH]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not in a git repository!"
    exit 1
fi

# Check if we have changes to commit
if git diff-index --quiet HEAD --; then
    print_warning "No changes to commit."
    exit 0
fi

# Get commit message from argument or prompt
if [ -z "$1" ]; then
    read -p "Enter commit message: " COMMIT_MESSAGE
else
    COMMIT_MESSAGE="$1"
fi

# If still no message, use a default
if [ -z "$COMMIT_MESSAGE" ]; then
    COMMIT_MESSAGE="Auto-commit: $(date '+%Y-%m-%d %H:%M:%S')"
fi

print_status "Adding all changes..."
git add .

print_status "Committing changes..."
git commit -m "$COMMIT_MESSAGE"

print_status "Pushing to GitHub..."
git push origin master

print_success "Successfully pushed changes to GitHub!"
print_success "Repository: https://github.com/Wastopian/hvac-smart-control"

# Show the latest commit
echo
print_status "Latest commit:"
git log --oneline -1 