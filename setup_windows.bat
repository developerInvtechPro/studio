
@echo off
:: Solicita privilegios de administrador
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Solicitando permisos de administrador...
    powershell -Command "Start-Process '%0' -Verb RunAs"
    exit /b
)

echo.
echo ==========================================================
echo      INSTALADOR Y CONFIGURADOR DE BCPOS PARA WINDOWS
echo ==========================================================
echo.
echo Este script realizara los siguientes pasos:
echo 1. Instalara las dependencias del proyecto (npm install).
echo 2. Compilara la aplicacion para produccion (npm run build).
echo 3. Instalara PM2 y PM2-Windows-Startup globalmente.
echo 4. Configurara PM2 para que inicie con Windows.
echo 5. Iniciara BCPOS con PM2.
echo 6. Guardara la configuracion de PM2 para los reinicios.
echo.
pause

:: Paso 1: Instalar dependencias
echo.
echo --- [PASO 1 de 4] Instalando dependencias del proyecto... ---
call npm install
if %errorLevel% neq 0 (
    echo.
    echo [ERROR] Hubo un problema al instalar las dependencias con 'npm install'.
    pause
    exit /b
)
echo.
echo --- Dependencias instaladas correctamente. ---

:: Paso 2: Compilar la aplicacion
echo.
echo --- [PASO 2 de 4] Compilando la aplicacion para produccion... ---
call npm run build
if %errorLevel% neq 0 (
    echo.
    echo [ERROR] Hubo un problema al compilar la aplicacion con 'npm run build'.
    pause
    exit /b
)
echo.
echo --- Aplicacion compilada correctamente. ---

:: Paso 3: Instalar PM2 y configurar el inicio automatico
echo.
echo --- [PASO 3 de 4] Instalando y configurando PM2... ---
echo Instalando PM2...
call npm install pm2 -g
echo Instalando el servicio de arranque de PM2 para Windows...
call npm install pm2-windows-startup -g
echo Configurando el servicio de arranque...
call pm2-startup install
if %errorLevel% neq 0 (
    echo.
    echo [ERROR] Hubo un problema al configurar el servicio de arranque de PM2.
    pause
    exit /b
)
echo.
echo --- PM2 configurado correctamente. ---

:: Paso 4: Iniciar y guardar la aplicacion con PM2
echo.
echo --- [PASO 4 de 4] Iniciando BCPOS y guardando la configuracion... ---
echo Eliminando cualquier instancia anterior de 'bcpos' para asegurar un inicio limpio...
call pm2 delete bcpos >nul 2>&1

echo Iniciando la aplicacion 'bcpos'...
call npm run pm2:start
if %errorLevel% neq 0 (
    echo.
    echo [ERROR] Hubo un problema al iniciar la aplicacion con PM2.
    pause
    exit /b
)

echo Esperando 5 segundos para que el servidor se estabilice...
timeout /t 5 /nobreak >nul

echo Guardando la lista de procesos para el reinicio automatico...
call pm2 save
if %errorLevel% neq 0 (
    echo.
    echo [ERROR] Hubo un problema al guardar la configuracion de PM2.
    pause
    exit /b
)
echo.
echo --- Proceso guardado. ---
echo.

:: Mostrar estado final
echo.
echo ==========================================================
echo          PROCESO DE INSTALACION FINALIZADO
echo ==========================================================
echo.
echo BCPOS deberia estar corriendo. Verificando el estado:
echo.
call pm2 list
echo.
echo Si el estado de 'bcpos' es 'online', la instalacion fue exitosa.
echo Puedes acceder al POS en tu navegador en: http://localhost:3000
echo.
pause
