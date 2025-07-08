@echo off
:: =================================================================
::  Script de Configuracion de BCPOS para Windows con PM2
:: =================================================================
::  Este script debe ejecutarse COMO ADMINISTRADOR.
::  Asegurate de ejecutarlo desde la raiz del proyecto BCPOS.
:: =================================================================

:: 1. Verificar si se esta ejecutando como Administrador
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' NEQ '0' (
    echo.
    echo [ERROR] Solicitando privilegios de Administrador...
    goto UACPrompt
) else (
    goto gotAdmin
)

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    set params= %*
    echo UAC.ShellExecute "cmd.exe", "/c ""%~s0"" %params:"=""%", "", "runas", 1 >> "%temp%\getadmin.vbs"
    "%temp%\getadmin.vbs"
    del "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    pushd "%CD%"
    CD /D "%~dp0"

:: =================================================================
::  Inicio del Script de Configuracion
:: =================================================================
echo.
echo ===================================================
echo   Configurador Automatico de BCPOS para Windows
echo ===================================================
echo.
echo Este script instalara y configurara PM2 para que
echo BCPOS se inicie automaticamente con el sistema.
echo.
pause
echo.

:: 2. Instalar PM2 globalmente
echo [PASO 1 de 5] Instalando PM2 globalmente...
call npm install pm2 -g
if %errorlevel% neq 0 (
    echo [ERROR] No se pudo instalar PM2. Verifica que Node.js y npm estan instalados y en el PATH.
    pause
    exit /b
)
echo [OK] PM2 instalado.
echo.

:: 3. Instalar pm2-windows-startup
echo [PASO 2 de 5] Instalando el servicio de inicio de PM2 para Windows...
call npm install pm2-windows-startup -g
if %errorlevel% neq 0 (
    echo [ERROR] No se pudo instalar pm2-windows-startup.
    pause
    exit /b
)
echo [OK] Servicio de inicio instalado.
echo.

:: 4. Configurar el servicio de inicio
echo [PASO 3 de 5] Configurando PM2 para que se inicie con Windows...
call pm2-startup install
if %errorlevel% neq 0 (
    echo [ERROR] No se pudo configurar el servicio de inicio.
    pause
    exit /b
)
echo [OK] PM2 configurado para el inicio automatico.
echo.

:: 5. Iniciar la aplicacion BCPOS con PM2
echo [PASO 4 de 5] Iniciando la aplicacion BCPOS con PM2...
echo (Asegurate de haber ejecutado 'npm install' y 'npm run build' primero)
call npm run pm2:start
if %errorlevel% neq 0 (
    echo [ERROR] No se pudo iniciar la aplicacion BCPOS con PM2.
    echo Asegurate de que los modulos de node esten instalados ('npm install') y la app compilada ('npm run build').
    pause
    exit /b
)
echo [OK] BCPOS iniciado.
echo.

:: 6. Guardar la lista de procesos de PM2
echo [PASO 5 de 5] Guardando la configuracion para que se restaure al reiniciar...
call pm2 save
if %errorlevel% neq 0 (
    echo [ERROR] No se pudo guardar la configuracion de PM2.
    pause
    exit /b
)
echo [OK] Configuracion guardada.
echo.

echo.
echo ===================================================
echo     ¡CONFIGURACION COMPLETADA CON EXITO!
echo ===================================================
echo.
echo BCPOS ahora esta corriendo y se iniciara automaticamente
echo cada vez que la computadora se reinicie.
echo.
echo Puedes acceder al POS en tu navegador en la direccion:
echo   http://localhost:3000
echo.
echo Para ver el estado de la aplicacion, usa el comando:
echo   pm2 list
echo.
pause
exit /b
