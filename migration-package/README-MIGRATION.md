# Migration Bundle Overview

This folder contains scripts and docs to migrate your app code and data to GitHub and a target Supabase project without guesswork.

Contents
- scripts/export-supabase.sh – Dump schema and data from current Supabase
- scripts/import-supabase.sh – Restore schema and data to a target Supabase
- scripts/export-storage.sh – Download files from listed Storage buckets (optional)
- scripts/import-storage.sh – Upload files to Storage buckets (optional)
- MIGRATION-CHECKLIST.md – Exact step-by-step plan
- GITHUB-HANDOVER.md – Clean handover to GitHub

Requirements
- Supabase project access (DB URL or Supabase CLI), and (optional) Service Role key for Storage export/import
- psql/pg_dump or Supabase CLI installed locally

Notes
- Scripts are idempotent and safe to re-run. They do NOT modify your running app.
- Keep secrets outside the repo; pass them as environment variables when running scripts.
