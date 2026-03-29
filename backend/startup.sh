#!/bin/bash
set -e
cd /home/site/wwwroot
echo "[startup] Installing Python dependencies..."
pip install -r requirements.txt -q
echo "[startup] Starting uvicorn..."
exec python3 -m uvicorn main:app --host 0.0.0.0 --port 8000
