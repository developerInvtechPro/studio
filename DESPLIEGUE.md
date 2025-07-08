
# Guía de Despliegue de BCPOS

Este documento explica cómo desplegar el sistema BCPOS en otros equipos. Existen dos modelos principales, dependiendo de si necesitas que las terminales compartan la información o funcionen de manera independiente.

---

## Modelo 1: Despliegue Aislado (On-Premise, Datos No Compartidos)

En este modelo, cada computadora ejecuta su propia copia completa de la aplicación, incluyendo su propia base de datos local (el archivo `.db`). Es ideal para un escenario con una única terminal o para terminales que **no necesitan sincronizarse** entre sí.

**Este es el modelo que mejor se adapta a un escenario on-premise descentralizado.**

**Ventaja:** Proceso de configuración simple.
**Desventaja:** Las ventas, productos, usuarios y demás datos **no se comparten** entre las terminales. Cada una es una isla.

### Requisitos por Máquina

*   Node.js (versión 18 o superior)
*   NPM (normalmente se instala con Node.js)

### Pasos de Instalación por Máquina

1.  **Copiar el Proyecto:** Copia toda la carpeta del proyecto BCPOS a la nueva computadora.
2.  **Abrir una Terminal:** Navega hasta la carpeta del proyecto en la línea de comandos o terminal.
3.  **Instalar Dependencias:** Ejecuta el siguiente comando para instalar todas las librerías necesarias.
    ```bash
    npm install
    ```
4.  **Compilar la Aplicación:** Ejecuta este comando para optimizar el código para producción.
    ```bash
    npm run build
    ```
5.  **Iniciar el Servidor:** Una vez compilado, inicia el servidor de producción.
    ```bash
    npm run start
    ```
6.  **Acceder al POS:** Abre un navegador web (como Google Chrome) y ve a la dirección: `http://localhost:3000`.

Repite estos pasos en cada computadora donde quieras instalar el POS. Cada instalación tendrá su propio archivo de base de datos (`.db`) y funcionará de forma independiente.

### Paso Adicional: Hacer que la Aplicación se Inicie Automáticamente (Recomendado)

Para evitar tener que iniciar el servidor manualmente cada vez que se reinicia la computadora, se recomienda usar un gestor de procesos como **PM2**.

**¿Qué es PM2?** Es una herramienta que mantiene tu aplicación funcionando en segundo plano, la reinicia si falla y, lo más importante, puede hacer que se inicie automáticamente con el sistema.

**Pasos de Configuración (se hace una sola vez por equipo):**

1.  **Instalar PM2 Globalmente:** Abre una terminal y ejecuta este comando. En Windows, es recomendable abrir la terminal **como Administrador**.
    ```bash
    npm install pm2 -g
    ```

2.  **Iniciar la Aplicación con PM2:** Desde la carpeta del proyecto, en lugar de `npm run start`, usa este nuevo comando que hemos añadido:
    ```bash
    npm run pm2:start
    ```
    Esto iniciará la aplicación con el nombre `bcpos` (definido en el archivo `ecosystem.config.js`) y la mantendrá corriendo en segundo plano. El uso de `ecosystem.config.js` es el método más estable y recomendado para ejecutar aplicaciones de Next.js, especialmente en Windows.

3.  **Configurar el Inicio Automático (Elige tu Sistema Operativo):**

    #### **Opción A: Para Linux y macOS**
    El comando `pm2 startup` generará y te pedirá que ejecutes un comando para registrar PM2 como un servicio de inicio del sistema.
    ```bash
    pm2 startup
    ```
    Después de ejecutarlo, copia el comando que te aparece en la terminal y ejecútalo también.

    #### **Opción B: Para Windows (¡Esta es la tuya!)**
    El comando `pm2 startup` no funciona directamente en Windows, por eso podrías haber recibido el error `Init system not found`. Para solucionarlo, usaremos un paquete diseñado específicamente para esto.

    1.  Abre una terminal (PowerShell o Símbolo del sistema) **como Administrador**.
    2.  Instala el siguiente paquete globalmente:
        ```bash
        npm install pm2-windows-startup -g
        ```
    3.  Una vez instalado, ejecuta este comando para crear y configurar el servicio de Windows que gestionará PM2:
        ```bash
        pm2-startup install
        ```
    Esto registrará un servicio que se asegurará de que PM2 se inicie cuando arranque el sistema.

4.  **Guardar la Configuración de PM2:** Este paso es crucial y es el mismo para todos los sistemas operativos. Le dice a PM2 qué aplicaciones debe reiniciar al arrancar. Asegúrate de haber iniciado tu aplicación con `npm run pm2:start` **antes** de ejecutar este comando.
    ```bash
    pm2 save
    ```
    Cada vez que hagas un cambio en las aplicaciones que PM2 está corriendo (por ejemplo, añadir una nueva), debes ejecutar `pm2 save` de nuevo.

¡Listo! A partir de ahora, cada vez que la computadora se reinicie, el servidor de BCPOS se iniciará solo. El usuario solo necesitará abrir el navegador en `http://localhost:3000`.

**Comandos Útiles de PM2:**

*   `pm2 list`: Muestra el estado de la aplicación `bcpos`.
*   `npm run pm2:stop`: Detiene la aplicación.
*   `pm2 restart bcpos`: Reinicia la aplicación si haces cambios.
*   `pm2 logs bcpos`: Muestra los registros (logs) por si ocurre algún error.
*   `pm2-startup uninstall` (Solo Windows): Desinstala el servicio de inicio automático.

---

## Modelo 2: Despliegue Centralizado (Datos Compartidos)

Este es el modelo profesional y estándar para un entorno donde múltiples terminales (cajas) deben compartir la misma información en tiempo real (ver las mismas órdenes abiertas, compartir inventario, etc.).

**Arquitectura:**
*   **1 Servidor:** Una única computadora aloja la aplicación y la base de datos.
*   **1 Base de Datos de Red:** La base de datos SQLite se reemplaza por una base de datos de red (ej. PostgreSQL, MySQL) que permite múltiples conexiones simultáneas.
*   **Múltiples Clientes (Terminales):** Las otras terminales no necesitan el código del proyecto. Solo necesitan un navegador web para acceder a la aplicación a través de la red.

### Opción A: Despliegue en Servidor Local (On-Premise Centralizado)

1.  **Preparar el Servidor:**
    *   Elige una computadora potente en tu red local para que actúe como servidor.
    *   Instala Node.js y una base de datos de red (como PostgreSQL) en esta máquina.
2.  **Migrar la Base de Datos (El paso más crítico):**
    *   La base de datos actual (SQLite) es un archivo local y no está diseñada para el acceso concurrente desde múltiples equipos.
    *   Deberás modificar el código de la aplicación, principalmente en `src/lib/db.ts` y `src/app/actions.ts`, para que en lugar de conectarse al archivo SQLite, se conecte a tu base de datos de red.
3.  **Desplegar la Aplicación en el Servidor:**
    *   Copia el código en la máquina servidor.
    *   Configura las variables de entorno para la conexión a la base de datos.
    *   Ejecuta `npm install`, `npm run build` y `npm run start` (o configúralo con PM2 como se describió anteriormente).
    *   Asegúrate de que el firewall del servidor permita conexiones en el puerto 3000.
4.  **Configurar las Terminales (Clientes):**
    *   En cada computadora que funcionará como caja, simplemente abre un navegador web.
    *   Navega a la dirección IP local del servidor, por ejemplo: `http://192.168.1.100:3000`.
    *   ¡Listo! Todas las terminales operarán contra el mismo sistema central.

### Opción B: Despliegue en la Nube (Hosting)

Este proceso es similar al anterior, pero en lugar de usar un servidor local, se utiliza una plataforma de hosting como **Vercel** (recomendado para Next.js), **Firebase App Hosting**, AWS, etc.

1.  **Base de Datos en la Nube:** Configura una base de datos de red en un servicio como Neon, Supabase (para PostgreSQL) o PlanetScale (para MySQL).
2.  **Desplegar la Aplicación Next.js:**
    *   Sube el código de tu proyecto a la plataforma de hosting.
    *   Configura las variables de entorno en esa plataforma para que la aplicación pueda conectarse a tu base de datos.
    *   La plataforma te dará una URL pública (ej. `https://mipos.vercel.app`).
3.  **Configurar las Terminales:**
    *   En cada terminal, abre un navegador y ve a la URL pública. Todos se conectarán al mismo sistema.

Este modelo es más complejo de configurar al principio, pero es la arquitectura correcta, escalable y robusta para un sistema de punto de venta real.
