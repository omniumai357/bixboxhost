# Migration Checklist

Use this as the exact, auditable plan across many builds.

1) Code → GitHub
- Connect Lovable to GitHub (new repo per build is recommended)
- Push current code (auto via Lovable’s GitHub sync)
- Tag the repository with a migration tag (e.g., v-migrate-YYYYMMDD)

2) Database Export (source)
- Set SUPABASE_DB_URL or SUPABASE_PROJECT_REF
- bash migration-package/scripts/export-supabase.sh

3) Storage Export (optional)
- Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
- bash migration-package/scripts/export-storage.sh

4) New Supabase Project (target)
- Create project in Supabase
- Get TARGET_DB_URL and Service Role Key

5) Database Import (target)
- TARGET_DB_URL=... bash migration-package/scripts/import-supabase.sh

6) Storage Import (target, optional)
- SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... 
  bash migration-package/scripts/import-storage.sh

7) Secrets & Config
- Recreate function secrets (Stripe, etc.) in target project settings
- Verify supabase/config.toml JWT flags per function

8) Smoke Tests
- Auth login/signup, CRUD on tables with RLS, payments (if configured), asset URLs

Notes
- Scripts are read-only on source; imports only touch target.
- Keep keys out of repo; pass via env vars.
