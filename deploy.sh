#!/bin/bash
set -e

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
COMPOSE="docker compose -f docker-compose.prod.yml --env-file .env.prod"

echo "[deploy] Pulling latest code..."
git pull origin main

echo "[deploy] Building and starting containers..."
$COMPOSE up -d --build

echo "[deploy] Waiting for postgres to be healthy..."
$COMPOSE exec postgres sh -c 'until pg_isready -U postgres -d openenvmap; do sleep 1; done'

echo "[deploy] Running migrations..."
$COMPOSE exec api node dist/db/migrate.js

echo "[deploy] Done. Services:"
$COMPOSE ps
