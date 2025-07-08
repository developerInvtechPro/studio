@echo on
ECHO [PASO 1/5] Solicitando permisos de administrador...

:: BatchGotAdmin
:-------------------------------------
REM  --> Check for permissions
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"

REM --> If error flag set, we do not have admin.
if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs"
    "%temp%\getadmin.vbs"
    del "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    pushd "%CD%"
    CD /D "%~dp0"
:--------------------------------------

ECHO [PASO 2/5] Instalando PM2 globalmente...
npm install pm2 -g

ECHO [PASO 3/5] Instalando el gestor de inicio de PM2 para Windows...
npm install pm2-windows-startup -g
pm2-startup install

ECHO [PASO 4/5] Preparando y arrancando BCPOS con PM2...
ECHO.
ECHO    (Puede que vea un error si 'bcpos' no existe, es normal)
pm2 delete bcpos
ECHO.
ECHO    Iniciando la aplicacion...
pm2 start ecosystem.config.js
ECHO.
ECHO    Esperando 5 segundos para que la aplicacion se estabilice...
timeout /t 5 /nobreak

ECHO [PASO 5/5] Guardando la configuracion y mostrando estado final...
pm2 save
ECHO.
ECHO    Estado actual de la aplicacion:
pm2 list
ECHO.

ECHO ==========================================================
ECHO.
ECHO  INSTALACION COMPLETADA!
ECHO.
ECHO  BCPOS deberia estar en estado 'online'.
ECHO  Si el estado es 'stopped' o 'errored', revise los logs con: pm2 logs bcpos
ECHO.
ECHO  Puedes acceder a la aplicacion en: http://localhost:3000
ECHO.
ECHO ==========================================================
ECHO.

pause
