
@echo off
ECHO ==========================================
ECHO  Configurador Automatico de BCPOS para PM2
ECHO ==========================================
ECHO.
ECHO Este script instalara y configurara PM2 para que BCPOS
ECHO se inicie automaticamente con Windows.
ECHO.

:: 1. Solicitar privilegios de administrador
:check_permissions
    net session >nul 2>&1
    if %errorlevel% == 0 (
        ECHO [OK] Permisos de administrador concedidos.
        goto :main_script
    ) else (
        ECHO [ERROR] Se requieren permisos de administrador.
        ECHO Por favor, haga clic derecho en este archivo y seleccione "Ejecutar como administrador".
        ECHO.
        pause
        exit
    )

:main_script
ECHO.
ECHO --- PASO 1: Instalando dependencias del proyecto ---
call npm install
if %errorlevel% neq 0 (
    ECHO [ERROR] Fallo la instalacion de dependencias. Abortando.
    pause
    exit /b %errorlevel%
)
ECHO [OK] Dependencias instaladas.

ECHO.
ECHO --- PASO 2: Compilando la aplicacion para produccion ---
call npm run build
if %errorlevel% neq 0 (
    ECHO [ERROR] Fallo la compilacion de la aplicacion. Abortando.
    pause
    exit /b %errorlevel%
)
ECHO [OK] Aplicacion compilada.

ECHO.
ECHO --- PASO 3: Instalando y configurando PM2 ---
ECHO Instalando PM2 globalmente...
call npm install pm2 -g
ECHO Instalando el servicio de inicio de PM2 para Windows...
call npm install pm2-windows-startup -g
call pm2-startup install
if %errorlevel% neq 0 (
    ECHO [ADVERTENCIA] El comando pm2-startup podria haber fallado. Se continua de todas formas.
)
ECHO [OK] Servicios de PM2 instalados.

ECHO.
ECHO --- PASO 4: Iniciando BCPOS con PM2 ---
ECHO Deteniendo cualquier version anterior de BCPOS...
call pm2 delete bcpos >nul 2>&1
ECHO Iniciando BCPOS...
call pm2 start ecosystem.config.js
if %errorlevel% neq 0 (
    ECHO [ERROR] Fallo al iniciar BCPOS con PM2. Abortando.
    pause
    exit /b %errorlevel%
)
ECHO [OK] Aplicacion iniciada.

ECHO.
ECHO --- PASO 5: Guardando la configuracion de PM2 ---
call pm2 save
if %errorlevel% neq 0 (
    ECHO [ERROR] Fallo al guardar la lista de procesos de PM2.
    pause
    exit /b %errorlevel%
)
ECHO [OK] Configuracion guardada.

ECHO.
ECHO =======================================================
ECHO  PROCESO DE CONFIGURACION FINALIZADO
ECHO =======================================================
ECHO.
ECHO Verificando estado final de BCPOS:
call pm2 list
ECHO.
ECHO Si el estado de 'bcpos' es 'online', la configuracion fue exitosa.
ECHO Puede acceder a la aplicacion en http://localhost:3000
ECHO.
pause
