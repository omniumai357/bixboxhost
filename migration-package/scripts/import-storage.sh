#!/usr/bin/env bash
set -euo pipefail

# Import files into Supabase Storage buckets via REST API
# Requirements:
#  - SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
#  - Files under migration-package/exports/storage/<bucket>/...

if [[ -z "${SUPABASE_URL:-}" || -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ]]; then
  echo "❌ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required." >&2
  exit 1
fi

IN_DIR="migration-package/exports/storage"
if [[ ! -d "$IN_DIR" ]]; then
  echo "❌ Missing $IN_DIR. Run export-storage first." >&2
  exit 1
fi

# Create bucket if not exists
create_bucket_if_needed() {
  local bucket="$1"
  curl -s -X POST \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Content-Type: application/json" \
    "$SUPABASE_URL/storage/v1/bucket" \
    --data "{\"name\":\"$bucket\",\"public\":true}" >/dev/null || true
}

upload_object() {
  local bucket="$1"; shift
  local filepath="$1"; shift
  local rel="${filepath#*$bucket/}"
  curl -s -X POST \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Content-Type: application/octet-stream" \
    --data-binary @"$filepath" \
    "$SUPABASE_URL/storage/v1/object/$bucket/$rel" >/dev/null
}

for bucket in $(find "$IN_DIR" -maxdepth 1 -mindepth 1 -type d -printf '%f\n'); do
  echo "➡ Importing bucket: $bucket"
  create_bucket_if_needed "$bucket"
  while IFS= read -r file; do
    echo "  ⤷ $(basename "$file")"
    upload_object "$bucket" "$file"
  done < <(find "$IN_DIR/$bucket" -type f)
  echo "✅ Done $bucket"
done

echo "✅ Storage import complete"
