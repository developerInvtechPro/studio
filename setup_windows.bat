@echo off
TITLE Instalador de BCPOS

echo ===========================================
echo  Instalador de Dependencias y Build de BCPOS
echo ===========================================
echo.

echo [1/2] Instalando dependencias del proyecto (npm install)...
call npm install
echo.
echo    >> Dependencias instaladas.
echo.

echo [2/2] Compilando la aplicacion para produccion (npm run build)...
call npm run build
echo.
echo    >> Aplicacion compilada.
echo.

echo =================================================================
echo  INSTALACION COMPLETADA
echo =================================================================
echo.
echo La aplicacion esta lista para ser iniciada.
echo.
echo AHORA, POR FAVOR, SIGA LA GUIA EN EL ARCHIVO DESPLIEGUE.MD
echo PARA CONFIGURAR EL ARRANQUE AUTOMATICO CON EL PROGRAMADOR DE TAREAS.
echo.

pause
