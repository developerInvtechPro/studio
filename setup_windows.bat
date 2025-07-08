echo.
echo ======================================================
echo ==      INSTALADOR Y CONFIGURADOR DE BCPOS          ==
echo ======================================================
echo.

powershell -Command "Start-Process cmd -Verb RunAs -ArgumentList '/c %~dpnx0 run-as-admin'"
IF "%1" NEQ "run-as-admin" (
    GOTO :EOF
)

cd /D "%~dp0"

echo.
echo --- Verificando Node.js y NPM ---
node -v
npm -v

echo.
echo --- 1. Instalando dependencias del proyecto ---
call npm install

echo.
echo --- 2. Compilando la aplicacion para produccion ---
call npm run build

echo.
echo --- 3. Instalando PM2 y el servicio de inicio de Windows ---
call npm install pm2 -g
call npm install pm2-windows-startup -g
call pm2-startup install

echo.
echo --- Limpiando procesos antiguos de PM2 (si existen) ---
call pm2 delete bcpos >nul 2>&1

echo.
echo --- 4. Iniciando BCPOS con PM2 ---
call pm2 start ecosystem.config.js

echo.
echo --- Esperando 5 segundos para que el servidor estabilice... ---
timeout /t 5 >nul

echo.
echo --- 5. Guardando configuracion de PM2 para el reinicio automatico ---
call pm2 save

echo.
echo --- 6. Verificando estado final de BCPOS ---
call pm2 list

echo.
echo ======================================================
echo ==         INSTALACION FINALIZADA                   ==
echo ======================================================
echo.
echo Si el estado de 'bcpos' es 'online', la aplicacion
echo esta corriendo correctamente en http://localhost:3000
echo y se reiniciara automaticamente.
echo.

pause
