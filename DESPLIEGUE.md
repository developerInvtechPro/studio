# Guía de Despliegue de BCPOS en Windows

Este documento explica cómo desplegar el sistema BCPOS en una computadora con Windows. Este modelo está diseñado para que cada terminal funcione de manera independiente.

---

## Proceso de Instalación

Sigue estos pasos en cada máquina donde quieras instalar el POS.

### 1. Requisitos Previos

*   Node.js (versión 18 o superior)
*   Git

### 2. Instalación y Compilación

1.  **Clonar el Repositorio:**
    Abre una terminal (CMD o PowerShell) y clona el proyecto desde GitHub.
    ```bash
    git clone <URL_DEL_REPOSITORIO_DE_GITHUB>
    cd <NOMBRE_DE_LA_CARPETA>
    ```

2.  **Ejecutar el Script de Instalación:**
    Hemos preparado un script que instala las dependencias y compila la aplicación por ti. Haz clic derecho en `setup_windows.bat` y selecciona **"Ejecutar como administrador"**.

    Esto ejecutará `npm install` y `npm run build`, dejando la aplicación lista para ser iniciada.

### 3. Configurar el Arranque Automático (Programador de Tareas)

Para que el POS se inicie solo cada vez que enciendes la computadora, usaremos el Programador de Tareas de Windows.

1.  **Abrir el Programador de Tareas:**
    *   Presiona la tecla de Windows, escribe "Programador de Tareas" y ábrelo.

2.  **Crear una Tarea Básica:**
    *   En el panel derecho, haz clic en **"Crear tarea..."** (no "Crear tarea básica").

3.  **Pestaña "General":**
    *   **Nombre:** `Iniciar BCPOS`
    *   Marca la opción **"Ejecutar con los privilegios más altos"**.
    *   Haz clic en **"Cambiar usuario o grupo..."**, escribe `SYSTEM` y dale a "Aceptar". Esto asegura que se ejecute incluso si nadie ha iniciado sesión.
    *   En la parte inferior, selecciona **"Ejecutar tanto si el usuario ha iniciado sesión como si no"**.

4.  **Pestaña "Desencadenadores":**
    *   Haz clic en **"Nuevo..."**.
    *   En "Iniciar la tarea", selecciona **"Al iniciar el equipo"**.
    *   Asegúrate de que esté "Habilitado" y haz clic en "Aceptar".

5.  **Pestaña "Acciones":**
    *   Haz clic en **"Nuevo..."**.
    *   En "Programa o script", haz clic en **"Examinar..."**.
    *   Navega hasta la carpeta donde clonaste el proyecto y selecciona el archivo `start_pos.bat`.
    *   En el campo **"Iniciar en (opcional)"**, debes poner la ruta completa a la carpeta del proyecto. Por ejemplo: `C:\Users\Usuario\Desktop\bcpos`
    *   Haz clic en "Aceptar".

6.  **Pestaña "Condiciones":**
    *   Desmarca la opción **"Iniciar la tarea solo si el equipo está conectado a la corriente alterna"** (esto es importante para laptops).

7.  **Finalizar:**
    *   Haz clic en "Aceptar". Puede que te pida la contraseña de tu usuario para confirmar.

¡Listo! La próxima vez que reinicies la computadora, el servidor del POS se iniciará en segundo plano automáticamente. Puedes acceder a él en tu navegador en `http://localhost:3000`.

---

## Cómo Actualizar la Aplicación

Para actualizar la aplicación a la última versión:

1.  Abre una terminal (CMD o PowerShell) en la carpeta del proyecto.
2.  Ejecuta los siguientes comandos:
    ```bash
    git pull
    npm install
    npm run build
    ```
3.  Reinicia la computadora para que la nueva versión se inicie.
