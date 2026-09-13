@echo off
title Landslide Guard AI - React Dashboard
cd /d "%~dp0frontend"
echo ========================================================
echo   Starting Landslide Guard AI Frontend Dashboard
echo ========================================================
echo Dashboard URL: http://localhost:5173
echo.
call npm run dev
pause
