setlocal

:: =============================================================================
::  Batch script to set up BCPOS with PM2 for automatic startup on Windows.
::  Must be run as Administrator.
:: =============================================================================

:: Check for administrative privileges
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' NEQ '0' (
    echo.
    echo ========================================================================
    echo  ERROR: Permisos de Administrador requeridos.
    echo ========================================================================
    echo.
    echo  Por favor, haz clic derecho en este archivo y selecciona
    echo  "Ejecutar como administrador".
    echo.
    pause
    exit /b
)

:: Main script execution starts here
echo.
echo ========================================================================
echo  Configurando BCPOS para inicio automatico con PM2 en Windows...
echo ========================================================================
echo.

:: Step 1: Install PM2 globally
echo [PASO 1/5] Instalando PM2 globalmente...
call npm install pm2 -g
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Fallo la instalacion de PM2. Verifica que Node.js y npm esten instalados y en el PATH.
    pause
    exit /b
)
echo.

:: Step 2: Install PM2 Windows Startup utility
echo [PASO 2/5] Instalando la utilidad de inicio de PM2 para Windows...
call npm install pm2-windows-startup -g
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Fallo la instalacion de pm2-windows-startup.
    pause
    exit /b
)
echo.

:: Step 3: Configure the startup service
echo [PASO 3/5] Configurando el servicio de inicio de Windows para PM2...
call pm2-startup install
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Fallo la configuracion del servicio de inicio.
    pause
    exit /b
)
echo.

:: Step 4: Start the application with PM2
echo [PASO 4/5] Iniciando la aplicacion BCPOS con PM2...
call npm run pm2:start
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Fallo al iniciar la aplicacion con PM2. Revisa los logs con 'pm2 logs bcpos'.
    pause
    exit /b
)
echo.

:: Step 5: Save the PM2 process list
echo [PASO 5/5] Guardando la configuracion para que PM2 reinicie la aplicacion al arrancar el sistema...
call pm2 save
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Fallo al guardar la lista de procesos de PM2.
    pause
    exit /b
)
echo.

echo.
echo ========================================================================
echo   INSTALACION COMPLETADA CON EXITO!
echo ========================================================================
echo.
echo BCPOS esta ahora corriendo en segundo plano y se iniciara
echo automaticamente cuando la computadora encienda.
echo.
echo Puedes acceder a la aplicacion en: http://localhost:3000
echo.
echo Comandos utiles:
echo   - pm2 list         (Ver el estado de la aplicacion)
echo   - pm2 logs bcpos   (Ver los logs/errores)
echo   - pm2 stop bcpos   (Detener la aplicacion)
echo.

pause
endlocal
