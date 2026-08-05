#!/bin/bash
# TestDNA DB Backup Script
# Usage: ./backup.sh [output_dir]

set -e

BACKUP_DIR="${1:-./backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="${DB_NAME:-dna_analysis_db}"
DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-3306}"
DB_USER="${DB_USER:-root}"

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Starting backup of $DB_NAME..."

mysqldump \
  -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"${DB_PASSWORD:-password123}" \
  "$DB_NAME" \
  --single-transaction \
  --routines \
  --triggers \
  | gzip > "$BACKUP_DIR/dna_analysis_${TIMESTAMP}.sql.gz"

echo "[$(date)] Backup completed: $BACKUP_DIR/dna_analysis_${TIMESTAMP}.sql.gz"

# Keep only last 7 backups
cd "$BACKUP_DIR"
ls -t dna_analysis_*.sql.gz 2>/dev/null | tail -n +8 | xargs -r rm --
echo "[$(date)] Old backups cleaned (keeping last 7)."
