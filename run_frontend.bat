@echo off
title LandGuard AI - React Dashboard
cd /d "%~dp0frontend"
echo ========================================================
echo   Starting LandGuard AI Frontend Dashboard
echo ========================================================
echo Dashboard URL: http://localhost:5173
echo.
call npm run dev
pause
