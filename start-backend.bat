@echo off
echo ========================================================
echo   Starting MinutDel Spring Boot Backend (Port 8080)...
echo ========================================================
cd /d "%~dp0backend"
java -jar target\minutdel-backend-0.0.1-SNAPSHOT.jar
pause
