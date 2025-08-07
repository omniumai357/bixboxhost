# GitHub Handover Guide

This project supports two-way GitHub sync.

Option A: Use Lovable’s built-in sync (recommended)
- Project → GitHub → Connect to GitHub → Create new repository
- All future changes in Lovable push to GitHub; external pushes sync back

Option B: Manual repository
- Create an empty repo on GitHub
- Clone locally and copy this codebase
- Commit and push

Branching Strategy
- One repo per build keeps histories clean
- Tag the pre-migration state (e.g., v-pre-migrate) and post-migration (e.g., v-migrated)

Secrets
- Do not commit secrets. Set them in your hosting and in Supabase Function Secrets

Post-Handover Checks
- CI/CD (optional), environment config, domain and redirects, storage permissions
