#!/usr/bin/env bash
set -euo pipefail

# Export public storage buckets and objects via REST API
# Requirements:
#  - SUPABASE_URL (e.g., https://krirjygnsufvlipqhltt.supabase.co)
#  - SUPABASE_SERVICE_ROLE_KEY (Admin key from Supabase → Project Settings → API)
# Edit BUCKETS array to include the buckets you want to export.

if [[ -z "${SUPABASE_URL:-}" || -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ]]; then
  echo "❌ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required." >&2
  exit 1
fi

BUCKETS=("assets")
OUT_DIR="migration-package/exports/storage"
mkdir -p "$OUT_DIR"

list_objects() {
  local bucket="$1"
  curl -s -X POST \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Content-Type: application/json" \
    "$SUPABASE_URL/storage/v1/object/list/$bucket" \
    --data '{"limit":1000,"offset":0,"sortBy":{"column":"name","order":"asc"}}'
}

fetch_object() {
  local bucket="$1"; shift
  local path="$1"; shift
  local dest="$OUT_DIR/$bucket/$path"
  mkdir -p "$(dirname "$dest")"
  curl -s -L \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    "$SUPABASE_URL/storage/v1/object/$bucket/$path" -o "$dest"
}

for b in "${BUCKETS[@]}"; do
  echo "➡ Exporting bucket: $b"
  objects=$(list_objects "$b" | jq -r '.[].name')
  if [[ -z "$objects" ]]; then
    echo "ℹ No objects in $b or bucket missing."
    continue
  fi
  while IFS= read -r obj; do
    echo "  ⤷ $obj"
    fetch_object "$b" "$obj"
  done <<< "$objects"
  echo "✅ Done $b"
done

echo "✅ Storage export complete → $OUT_DIR"
