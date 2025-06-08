# GitHub Setup Guide - HVAC Smart Control System

## 🎯 Repository Information

- **Repository URL**: https://github.com/Wastopian/hvac-smart-control
- **Owner**: Wastopian
- **Visibility**: Public
- **Description**: Smart HVAC Control System - React frontend with beautiful UI, Node.js backend, ESP32 IoT integration, real-time monitoring and control

## 🔧 Setup Complete

✅ Git repository initialized  
✅ GitHub repository created  
✅ Remote origin configured  
✅ Initial commit pushed  
✅ Auto-push scripts created  
✅ README updated with GitHub info  
✅ Package.json updated with repository details  

## 📤 How to Push Changes

### Method 1: Auto-Push Script (Recommended)
```bash
./scripts/auto-push.sh "Your descriptive commit message"
```

### Method 2: Quick Push (Timestamped)
```bash
./scripts/quick-push.sh
```

### Method 3: NPM Scripts
```bash
# With custom message (will prompt for message)
npm run push

# Quick push with timestamp
npm run quick-push
```

### Method 4: Manual Git Commands
```bash
git add .
git commit -m "Your commit message"
git push origin master
```

## 🚀 Workflow Examples

### After making code changes:
```bash
# Option A: Descriptive commit
./scripts/auto-push.sh "Fix MQTT connection issues and improve error handling"

# Option B: Quick commit
./scripts/quick-push.sh

# Option C: Using npm
npm run push
```

### For major features:
```bash
./scripts/auto-push.sh "Add new room scheduling feature

- Implemented weekly schedule interface
- Added backend API endpoints for schedule management  
- Updated room detail modal with schedule controls
- Added validation for schedule conflicts"
```

## 📋 Git Configuration

The following git configuration is set up:
- **User Email**: wastopia@gmail.com
- **User Name**: wastopia
- **Default Branch**: master
- **Remote Origin**: https://github.com/Wastopian/hvac-smart-control.git

## 🔒 Authentication

GitHub authentication is configured using GitHub CLI with web browser authentication. The setup is persistent and will remember your credentials.

## 📁 Files Excluded from Git

The `.gitignore` file excludes:
- `node_modules/` directories
- Build outputs (`dist/`, `build/`)
- Environment files (`.env*`)
- Database files (`*.sqlite`, `*.db`)
- IDE files (`.vscode/`, `.idea/`)
- Log files (`*.log`)
- Temporary files
- OS-specific files (`.DS_Store`, `Thumbs.db`)

## 🔄 Automatic Synchronization

Every time you make changes to the project:

1. **Edit your files** (frontend, backend, device code, etc.)
2. **Test your changes** locally
3. **Push to GitHub** using one of the methods above

The auto-push script will:
- Add all changes to git staging
- Create a commit with your message
- Push to the master branch on GitHub
- Show confirmation and latest commit info

## 🌐 Repository Access

You can view your repository online at:
https://github.com/Wastopian/hvac-smart-control

## 🆘 Troubleshooting

### If push fails:
```bash
# Check git status
git status

# Check remote configuration
git remote -v

# Force push if needed (use carefully)
git push origin master --force
```

### If authentication fails:
```bash
# Re-authenticate with GitHub
gh auth login
```

### If you need to change commit message:
```bash
# Amend last commit message
git commit --amend -m "New commit message"
git push origin master --force
```

## 📝 Best Practices

1. **Commit frequently** - Small, focused commits are better
2. **Use descriptive messages** - Explain what and why, not just what
3. **Test before pushing** - Make sure your code works locally
4. **Review changes** - Use `git status` and `git diff` before committing
5. **Keep commits atomic** - One logical change per commit

## 🎉 You're All Set!

Your HVAC Smart Control System is now fully integrated with GitHub. Every change you make can be easily pushed to your repository for backup, collaboration, and deployment. 