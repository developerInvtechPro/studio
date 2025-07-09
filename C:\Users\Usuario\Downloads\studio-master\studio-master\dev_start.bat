@echo off
echo =======================================================
echo.
echo      Iniciando servidor de desarrollo de BCPOS
echo.
echo      URL: http://localhost:9002
echo.
echo =======================================================

REM Inicia el servidor de Next.js en una nueva ventana de comandos titulada
start "BCPOS Dev Server" npm run dev

echo.
echo Esperando 5 segundos para que el servidor se inicie...
timeout /t 5 /nobreak > nul

echo Abriendo el navegador...
REM Abre el navegador por defecto en la URL del proyecto
start http://localhost:9002

echo.
echo El script ha finalizado. La ventana del servidor permanecera abierta.
