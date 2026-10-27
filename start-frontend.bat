@echo off
echo ========================================================
echo   Starting MinutDel React Frontend (Port 5173)...
echo ========================================================
cd /d "%~dp0frontend"
call npm.cmd run dev
pause
