
@echo on
title BCPOS Setup

echo ===========================================
echo BCPOS Windows Setup
echo ===========================================
echo.

REM Request administrator privileges
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' NEQ '0' (
    echo Requesting administrator privileges...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs"
    "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    if exist "%temp%\getadmin.vbs" ( del "%temp%\getadmin.vbs" )
    pushd "%CD%"
    CD /D "%~dp0"


echo [1/7] Installing/Updating PM2 globally...
npm install pm2@latest -g

echo [2/7] Installing PM2 Windows Startup service...
npm install pm2-windows-startup -g
pm2-windows-startup install --unattended

echo [3/7] Installing project dependencies...
npm install

echo [4/7] Building the application for production...
npm run build

echo [5/7] Deleting any old 'bcpos' process to ensure a clean start...
pm2 delete bcpos

echo [6/7] Starting BCPOS with PM2 from the configuration file...
pm2 start ecosystem.config.js

echo [7/7] Saving the process list for startup...
pm2 save

echo.
echo ===========================================
echo Setup Complete!
echo ===========================================
echo BCPOS should now be running. Let's check:
pm2 list
echo.
echo If 'bcpos' status is 'online', everything is working!
echo You can access the POS at http://localhost:3000
echo.
pause
