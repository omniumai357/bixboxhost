# 🔐 BIZBOX.HOST REPLIT PROTOCOL

## 🔴 PRIME PROTOCOL (MANDATORY)
- NEVER assume — ALWAYS verify with `curl`, `cat`, `grep`
- NEVER recreate — ALWAYS restore from GitHub or Supabase
- ALWAYS check Supabase connection before deploying
- BEFORE ANY CHANGE: `git status` and `supabase status`
- AFTER ANY CHANGE: `git commit` and `git push`
- IF SUPABASE FAILS: Restore from `schema.sql`
- IF GITHUB FAILS: Reconnect remote
- IF BACKUP FAILS: Check `backup.sh` and cron
- GOAL: Make money, not "fix" things

## 🧱 PROJECT STRUCTURE
```
workspace/
├── app/
│   ├── models.py          # User, Purchase, Lead models
│   ├── routes/
│   │   ├── auth.py        # /api/signup, /api/login, /api/guest-preview
│   │   └── home.py        # Main routes
│   └── integrated_app.py  # Flask app factory
├── templates/
│   └── award_winning_home.html
├── static/
│   └── css/
├── backup.sh             # Auto-backup script
├── schema.sql            # Supabase schema export
└── .env                  # Environment variables
```

## 🚀 DEPLOYMENT COMMANDS
```bash
# Start development server
python app.py

# Test Supabase connection
curl -s http://localhost:5000/api/test-db

# Manual backup
./backup.sh

# Check backup status
crontab -l
```

## 🛡️ VERIFICATION CHECKLIST
- [ ] Supabase tables: users, leads, purchases, previews
- [ ] GitHub remote connected
- [ ] Backup script executable
- [ ] Cron job scheduled
- [ ] Environment variables set

## 🔧 TROUBLESHOOTING
- **Supabase connection failed**: Check SUPABASE_URL and SUPABASE_ANON_KEY in .env
- **GitHub push failed**: Run `git remote -v` and reconnect if needed
- **Backup not running**: Check `crontab -l` and `chmod +x backup.sh`
- **Template not found**: Verify `template_folder='templates'` in integrated_app.py