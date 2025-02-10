
@echo off
cd /d %~dp0
echo Starting Next.js server...
set PORT=4000
"C:\Program Files\nodejs\node.exe" .next\standalone\server.js
pause