@echo off
title LandGuard AI - Backend Server
echo ==============================================
echo   Starting LandGuard AI FastAPI Server
echo ==============================================
echo Running on http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
pause
