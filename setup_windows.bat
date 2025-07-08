echo [BCPOS] ==========================================================
echo [BCPOS] BCPOS Installation and Auto-Start Setup for Windows
echo [BCPOS] ==========================================================
echo.
echo [BCPOS] IMPORTANT: This script will request Administrator privileges
echo [BCPOS] to install and configure the auto-start service.
echo.
pause

:: -----------------------------------------------------------------
:: Request Administrator privileges
:: -----------------------------------------------------------------
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' NEQ '0' (
    echo [BCPOS] Requesting Administrator privileges...
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
:: -----------------------------------------------------------------

echo [BCPOS] Step 1: Installing project dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [BCPOS] [ERROR] Failed to install dependencies. Please check your internet connection and try again.
    pause
    exit /b 1
)
echo [BCPOS] Dependencies installed successfully.
echo.

echo [BCPOS] Step 2: Building the application for production...
call npm run build
if %errorlevel% neq 0 (
    echo [BCPOS] [ERROR] Failed to build the application.
    pause
    exit /b 1
)
echo [BCPOS] Application built successfully.
echo.

echo [BCPOS] Step 3: Setting up PM2 for auto-start...
echo [BCPOS] -> Installing/Updating PM2 globally...
call npm install pm2 -g
if %errorlevel% neq 0 (
    echo [BCPOS] [ERROR] Failed to install PM2.
    pause
    exit /b 1
)

echo [BCPOS] -> Installing PM2 Windows startup script...
call npm install pm2-windows-startup -g
if %errorlevel% neq 0 (
    echo [BCPOS] [ERROR] Failed to install pm2-windows-startup.
    pause
    exit /b 1
)
echo.

echo [BCPOS] -> Creating the startup service...
call pm2-startup install
if %errorlevel% neq 0 (
    echo [BCPOS] [WARNING] Could not install the startup service automatically. You may need to run 'pm2-startup install' manually from an Administrator terminal.
)
echo.

echo [BCPOS] Step 4: Starting BCPOS with PM2...
echo [BCPOS] -> Removing any old 'bcpos' process to ensure a clean start...
call pm2 delete bcpos > nul 2>&1
echo [BCPOS] -> Starting the application...
call npm run pm2:start
if %errorlevel% neq 0 (
    echo [BCPOS] [ERROR] Failed to start the application with PM2.
    pause
    exit /b 1
)
echo.

echo [BCPOS] Step 5: Saving the process list for auto-restart...
call pm2 save
if %errorlevel% neq 0 (
    echo [BCPOS] [ERROR] Failed to save the PM2 process list.
    pause
    exit /b 1
)
echo.

echo [BCPOS] ==========================================================
echo [BCPOS] Installation complete!
echo [BCPOS] BCPOS is now running and configured to start automatically.
echo [BCPOS] You can access it at http://localhost:3000
echo [BCPOS] ----------------------------------------------------------
echo [BCPOS] Current status:
call pm2 list
echo ==========================================================
echo.
pause
