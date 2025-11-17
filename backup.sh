#!/bin/bash

# Script untuk backup database toko
# Usage: ./backup.sh

DB_NAME="toko"
DB_USER="macbookpro"
BACKUP_DIR="."
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/toko_backup_${TIMESTAMP}.dump"

echo "🔄 Starting database backup..."
echo "Database: ${DB_NAME}"
echo "User: ${DB_USER}"

# Create backup
pg_dump -U ${DB_USER} -d ${DB_NAME} -F c -f ${BACKUP_FILE}

if [ $? -eq 0 ]; then
    echo "✅ Backup created successfully: ${BACKUP_FILE}"
    
    # Get file size
    FILE_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
    echo "📦 Backup size: ${FILE_SIZE}"
    
    # List recent backups
    echo ""
    echo "📋 Recent backups:"
    ls -lh ${BACKUP_DIR}/toko_backup_*.dump 2>/dev/null | tail -5
else
    echo "❌ Backup failed!"
    exit 1
fi

