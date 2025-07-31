#!/bin/bash
# 🔄 BIZBOX.HOST AUTO-BACKUP SCRIPT

echo "🚀 Starting backup: $(date)"

# Navigate to workspace
cd /home/runner/workspace || {
    echo "❌ Failed to navigate to workspace"
    exit 1
}

# Check git status
echo "📋 Checking git status..."
git status

# Add all changes
echo "📦 Adding files..."
git add .

# Commit with timestamp
COMMIT_MSG="Auto-backup: $(date '+%Y-%m-%d %H:%M:%S')"
git commit -m "$COMMIT_MSG" || {
    echo "ℹ️ No changes to commit"
}

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main || {
    echo "❌ Failed to push to GitHub"
    exit 1
}

# Export Supabase schema (if supabase CLI available)
if command -v supabase &> /dev/null; then
    echo "💾 Exporting Supabase schema..."
    supabase db dump --local > schema.sql 2>/dev/null || {
        echo "⚠️ Supabase schema export failed (normal if using remote)"
    }
fi

# Log completion
echo "✅ Backup completed: $(date)"
echo "📊 Files backed up: $(git ls-files | wc -l)"
echo "📈 Total commits: $(git rev-list --count HEAD)"

# Verify backup
echo "🔍 Verifying backup..."
git remote -v | head -1

echo "🎉 Backup process finished successfully!"