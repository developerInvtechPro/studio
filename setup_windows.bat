
@echo off
chcp 65001 > nul
setlocal

:: Function to check if a command exists
:command_exists
where %1 >nul 2>nul
if %errorlevel% equ 0 (
    exit /b 0
) else (
    exit /b 1
)

:: Check for Node.js
call :command_exists node
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no esta instalado o no se encuentra en el PATH.
    echo Por favor, instale Node.js (https://nodejs.org/) y vuelva a intentarlo.
    pause
    exit /b 1
)

echo --- [PASO 1 de 4] Instalando dependencias del proyecto (npm install)...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Fallo la instalacion de dependencias. Verifique su conexion a internet.
    pause
    exit /b 1
)
echo --- Dependencias instaladas. ---

echo.
echo --- [PASO 2 de 4] Compilando la aplicacion para produccion (npm run build)...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Fallo la compilacion de la aplicacion.
    pause
    exit /b 1
)
echo --- Aplicacion compilada. ---

echo.
echo --- [PASO 3 de 4] Configurando PM2 para inicio automatico...
echo Instalando/Actualizando pm2 y pm2-windows-startup globalmente...
call npm install pm2 -g
call npm install pm2-windows-startup -g
echo.
echo Actualizando PM2 a la version mas reciente...
call pm2 update
echo.

echo Configurando el servicio de inicio automatico de PM2...
call pm2-startup install
if %errorlevel% neq 0 (
    echo [WARNING] No se pudo configurar el servicio de inicio automatico.
    echo Por favor, asegurese de ejecutar este script como Administrador.
)
echo --- PM2 configurado. ---

echo.
echo --- [PASO 4 de 4] Iniciando BCPOS y guardando la configuracion...
echo Eliminando cualquier instancia anterior de 'bcpos' para asegurar un inicio limpio...
call pm2 delete bcpos >nul 2>nul
echo Iniciando la aplicacion 'bcpos' usando la configuracion de ecosistema...
call npm run pm2:start

:: Give it a moment to stabilize before saving
timeout /t 3 /nobreak > nul

echo.
echo Guardando la lista de procesos para el reinicio automatico...
call pm2 save
if %errorlevel% neq 0 (
    echo [ERROR] No se pudo guardar la lista de procesos de PM2.
    pause
    exit /b 1
)
echo --- Proceso guardado. ---

echo.
echo =========================================
echo PROCESO DE INSTALACION FINALIZADO
echo =========================================
echo.
echo BCPOS deberia estar corriendo. Verificando el estado final:
call pm2 list
echo.
echo Si el estado de 'bcpos' es 'online', la instalacion fue exitosa.
echo Puedes acceder al POS en tu navegador en: http://localhost:3000
echo.
echo Presione una tecla para continuar...
pause > nul
exit
