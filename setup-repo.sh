#!/bin/bash

# Script to create GitHub repo if missing, then push local commits
# Usage: ./setup-repo.sh

set -e

REPO_NAME="alligatorbrain-ops"
REPO_OWNER="AlligatorBrain"
REMOTE_URL="https://github.com/${REPO_OWNER}/${REPO_NAME}"
BRANCH="main"

echo "🔍 Checking GitHub repository: ${REPO_OWNER}/${REPO_NAME}"

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ Error: GitHub CLI (gh) is not installed."
    echo "Please install it from: https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Error: Not authenticated with GitHub CLI."
    echo "Please run: gh auth login"
    exit 1
fi

# Check if repository exists on GitHub
echo "Checking if repository exists..."
if gh repo view "${REPO_OWNER}/${REPO_NAME}" &> /dev/null; then
    echo "✅ Repository ${REPO_OWNER}/${REPO_NAME} already exists"
    
    # Confirm remote URL
    echo ""
    echo "📋 Checking remote URL..."
    CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null || echo "")
    
    if [ -z "$CURRENT_REMOTE" ]; then
        echo "⚠️  No remote 'origin' configured. Adding it now..."
        git remote add origin "${REMOTE_URL}.git"
        echo "✅ Remote 'origin' added: ${REMOTE_URL}.git"
    elif [ "$CURRENT_REMOTE" != "${REMOTE_URL}.git" ] && [ "$CURRENT_REMOTE" != "${REMOTE_URL}" ]; then
        echo "⚠️  Current remote URL: $CURRENT_REMOTE"
        echo "⚠️  Expected remote URL: ${REMOTE_URL}.git"
        echo "Updating remote URL..."
        git remote set-url origin "${REMOTE_URL}.git"
        echo "✅ Remote URL updated"
    else
        echo "✅ Remote URL is correct: $CURRENT_REMOTE"
    fi
else
    echo "⚠️  Repository ${REPO_OWNER}/${REPO_NAME} does not exist"
    echo "Creating repository..."
    
    # Create the repository (set -e will exit on failure)
    gh repo create "${REPO_OWNER}/${REPO_NAME}" --public --description "Daily app"
    
    echo "✅ Repository created successfully"
    
    # Add remote if not already added
    if ! git remote get-url origin &> /dev/null; then
        git remote add origin "${REMOTE_URL}.git"
        echo "✅ Remote 'origin' added"
    fi
fi

# Push to main branch
echo ""
echo "📤 Pushing commits to ${BRANCH} branch..."

# Check if we have any commits
if ! git rev-parse HEAD &> /dev/null; then
    echo "❌ No commits found. Please make an initial commit first."
    exit 1
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"

# If we're not on main, offer to push current branch
if [ "$CURRENT_BRANCH" != "$BRANCH" ]; then
    echo "⚠️  You're on branch '$CURRENT_BRANCH', not '$BRANCH'"
    echo "Pushing current branch to remote..."
    git push -u origin "$CURRENT_BRANCH"
    echo "✅ Pushed branch '$CURRENT_BRANCH'"
    echo ""
    echo "💡 To push to main branch, run:"
    echo "   git checkout main (or: git checkout -b main)"
    echo "   git push -u origin main"
else
    # Push to main
    git push -u origin "$BRANCH"
    echo "✅ Successfully pushed to ${BRANCH}"
fi

echo ""
echo "🎉 Done! Repository URL: ${REMOTE_URL}"
