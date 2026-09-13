@echo off
title Landslide Guard AI - Full Stack Launcher
echo ========================================================
echo   Launching Landslide Guard AI Landslide Risk Intelligence Platform
echo ========================================================
echo Starting Backend (FastAPI on http://localhost:8000)...
start "Landslide Guard Backend" cmd /c "run_backend.bat"
timeout /t 2 /nobreak >nul
echo Starting Frontend (Vite on http://localhost:5173)...
start "Landslide Guard Frontend" cmd /c "run_frontend.bat"
echo.
echo Both services are now running!
echo Access Dashboard: http://localhost:5173
echo Access Backend API: http://localhost:8000/docs
echo ========================================================

