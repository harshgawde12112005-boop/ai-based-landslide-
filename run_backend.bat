@echo off
title LandGuard AI - Backend Server
cd /d "%~dp0"
echo ========================================================
echo   Starting LandGuard AI FastAPI Backend Server
echo ========================================================
echo API URL:  http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.

IF EXIST ".venv\Scripts\python.exe" (
    echo [OK] Using Virtual Environment (.venv)...
    ".venv\Scripts\python.exe" main.py
) ELSE (
    echo [OK] Using System Python...
    python main.py
)

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Backend exited with code %ERRORLEVEL%. Attempting fallback launch...
    python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
)
pause
