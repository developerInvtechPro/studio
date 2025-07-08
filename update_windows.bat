@echo on
title Actualizador de BCPOS

echo =======================================================
echo.
echo      ACTUALIZADOR AUTOMATICO PARA BCPOS (WINDOWS)
echo.
echo =======================================================
echo Este script descargara los ultimos cambios del codigo,
echo instalara las dependencias, compilara la aplicacion y
echo reiniciara el servidor del POS.
echo.
echo Asegurese de tener una conexion a internet.
echo.
pause

echo.
echo --- PASO 1: Descargando ultimos cambios desde GitHub...
git pull
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] No se pudieron descargar los cambios. Verifique su conexion o si hay conflictos en git.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo --- PASO 2: Instalando/actualizando dependencias (NPM)...
npm install
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Fallo la instalacion de dependencias con npm.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo --- PASO 3: Compilando la aplicacion para produccion...
npm run build
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Fallo la compilacion de la aplicacion (build).
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo --- PASO 4: Reiniciando el servidor BCPOS con PM2...
pm2 restart bcpos
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] No se pudo reiniciar la aplicacion con PM2. Asegurese de que PM2 este instalado y configurado.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo --- PASO 5: Verificando el estado de la aplicacion...
timeout /t 3 >nul
pm2 list

echo.
echo =======================================================
echo.
echo      ¡ACTUALIZACION COMPLETADA!
echo.
echo El POS ha sido actualizado y reiniciado.
echo =======================================================
echo.
pause
