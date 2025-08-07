#!/usr/bin/env bash
set -euo pipefail

# Import schema and data into a target Supabase/Postgres
# Usage:
#  TARGET_DB_URL="postgres://postgres:[password]@db.[ref].supabase.co:5432/postgres" \
#  ./migration-package/scripts/import-supabase.sh

OUT_DIR="migration-package/exports"
SCHEMA_FILE="$OUT_DIR/schema-latest.sql"
DATA_FILE="$OUT_DIR/data-latest.sql"

if ! command -v psql >/dev/null 2>&1; then
  echo "❌ psql not found. Please install PostgreSQL client." >&2
  exit 1
fi

if [[ ! -f "$SCHEMA_FILE" ]]; then
  echo "❌ Missing $SCHEMA_FILE. Run export first." >&2
  exit 1
fi

if [[ -z "${TARGET_DB_URL:-}" ]]; then
  echo "❌ TARGET_DB_URL env var is required." >&2
  exit 1
fi

# Apply schema first
echo "➡ Applying schema..."
psql "$TARGET_DB_URL" -v ON_ERROR_STOP=1 -f "$SCHEMA_FILE"

# Then data
if [[ -f "$DATA_FILE" ]]; then
  echo "➡ Importing data..."
  psql "$TARGET_DB_URL" -v ON_ERROR_STOP=1 -f "$DATA_FILE"
else
  echo "ℹ No data file found. Skipping data import."
fi

echo "✅ Import complete"
