# alligatorbrain-ops
Daily app

## Setup

This repository includes a setup script to help you create the GitHub repository (if it doesn't exist) and push your local commits.

### Prerequisites

- [GitHub CLI (gh)](https://cli.github.com/) must be installed
- You must be authenticated with GitHub CLI (`gh auth login`)
- Git must be configured on your system

### Usage

Run the setup script from your local repository:

```bash
./setup-repo.sh
```

The script will:
1. ✅ Check if the GitHub repository exists
2. 🔨 Create the repository if it doesn't exist
3. 🔍 Verify/update the remote URL
4. 📤 Push your local commits to GitHub

### Manual Setup

If you prefer to set up manually:

```bash
# Create the repository (if needed)
gh repo create AlligatorBrain/alligatorbrain-ops --public --description "Daily app"

# Add remote (if needed)
git remote add origin https://github.com/AlligatorBrain/alligatorbrain-ops.git

# Push to main branch
git push -u origin main
```
