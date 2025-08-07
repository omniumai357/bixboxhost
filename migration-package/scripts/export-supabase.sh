#!/usr/bin/env bash
set -euo pipefail

# Export public schema and data from the current Supabase project
# Usage:
#  SUPABASE_DB_URL="postgres://postgres:[password]@db.[ref].supabase.co:5432/postgres" \
#  ./migration-package/scripts/export-supabase.sh
#
# Optional (preferred if installed): SUPABASE_PROJECT_REF=krirjygnsufvlipqhltt
# Requires either: (A) Supabase CLI, or (B) pg_dump

OUT_DIR="migration-package/exports"
mkdir -p "$OUT_DIR"
SCHEMA_FILE="$OUT_DIR/schema-latest.sql"
DATA_FILE="$OUT_DIR/data-latest.sql"

command -v supabase >/dev/null 2>&1 && HAS_SUPA=1 || HAS_SUPA=0
command -v pg_dump >/dev/null 2>&1 && HAS_PG_DUMP=1 || HAS_PG_DUMP=0

if [[ ${HAS_SUPA} -eq 1 && -n "${SUPABASE_PROJECT_REF:-}" ]]; then
  echo "➡ Using Supabase CLI to dump schema..."
  supabase db dump --project-ref "$SUPABASE_PROJECT_REF" --schema public --file "$SCHEMA_FILE"
  echo "➡ Using Supabase CLI to dump data..."
  supabase db dump --project-ref "$SUPABASE_PROJECT_REF" --schema public --data-only --file "$DATA_FILE"
elif [[ ${HAS_PG_DUMP} -eq 1 && -n "${SUPABASE_DB_URL:-}" ]]; then
  echo "➡ Using pg_dump to dump schema..."
  pg_dump --no-owner --no-privileges --schema=public --format=plain "$SUPABASE_DB_URL" > "$SCHEMA_FILE"
  echo "➡ Using pg_dump to dump data..."
  pg_dump --data-only --inserts --column-inserts --disable-triggers --schema=public "$SUPABASE_DB_URL" > "$DATA_FILE"
else
  echo "❌ Neither Supabase CLI (with SUPABASE_PROJECT_REF) nor pg_dump (with SUPABASE_DB_URL) available." >&2
  exit 1
fi

echo "✅ Export complete: $SCHEMA_FILE, $DATA_FILE"
