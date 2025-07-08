
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
*   Git (para poder actualizar la aplicación)

### Pasos de Instalación por Máquina

Existen dos maneras de instalarlo: una automática (recomendada) y una manual.

#### Opción A: Instalación Automática (Recomendada para Windows)

Hemos creado un script que hace todo el trabajo pesado por ti.

1.  **Clonar el Proyecto:** Abre una terminal (CMD o PowerShell) en el lugar donde quieras guardar el proyecto y ejecuta:
    ```bash
    git clone <URL_DEL_REPOSITORIO_DE_GITHUB>
    ```
    Luego, navega dentro de la carpeta que se acaba de crear.

2.  **Ejecutar el Script:** Haz clic derecho en el archivo `setup_windows.bat` y selecciona **"Ejecutar como administrador"**.
3.  **¡Listo!** El script se encargará de instalar las dependencias, compilar la aplicación para producción, configurar PM2 para que se inicie automáticamente con Windows y arrancar el servidor de BCPOS.

Una vez que termine, puedes acceder al POS abriendo un navegador web (como Google Chrome) en `http://localhost:3000`.

#### Opción B: Instalación Manual

Si prefieres hacerlo paso a paso o el script falla por alguna razón.

1.  **Clonar el Proyecto:** Igual que en el paso 1 de la opción automática.
2.  **Instalar Dependencias:** Ejecuta el siguiente comando para instalar todas las librerías necesarias.
    ```bash
    npm install
    ```
3.  **Compilar la Aplicación:** Ejecuta este comando para optimizar el código para producción. **Este paso es obligatorio antes de iniciar el servidor.**
    ```bash
    npm run build
    ```
4.  **Iniciar el Servidor (con PM2 para auto-arranque):** Sigue los pasos de la sección "Hacer que la Aplicación se Inicie Automáticamente" a continuación.

---

### Hacer que la Aplicación se Inicie Automáticamente (PM2)

Para evitar tener que iniciar el servidor manualmente cada vez que se reinicia la computadora, usamos un gestor de procesos como **PM2**.

**¿Qué es PM2?** Es una herramienta que mantiene tu aplicación funcionando en segundo plano, la reinicia si falla y, lo más importante, puede hacer que se inicie automáticamente con el sistema.

**Pasos de Configuración (se hace una sola vez por equipo si lo haces manualmente):**

1.  **Instalar PM2 Globalmente:** Abre una terminal y ejecuta este comando. En Windows, es recomendable abrir la terminal **como Administrador**.
    ```bash
    npm install pm2 -g
    ```

2.  **Iniciar la Aplicación con PM2:** Desde la carpeta del proyecto, en lugar de `npm run start`, usa este nuevo comando que hemos añadido. Esto leerá el archivo `ecosystem.config.js` que es el método más estable.
    ```bash
    npm run pm2:start
    ```

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

**Nota importante:** Si detienes la aplicación manualmente con `npm run pm2:stop`, esta permanecerá detenida durante la sesión. El reinicio automático solo se aplicará la próxima vez que se encienda el equipo.

#### ¿Por qué usar PM2 en lugar de una Tarea Programada de Windows?

Aunque usar una Tarea Programada para ejecutar un script `.bat` al inicio es una solución válida, PM2 ofrece ventajas cruciales para un sistema como un punto de venta:
*   **Robustez (Reinicio Automático):** Si la aplicación se cierra inesperadamente por un error, PM2 la reiniciará automáticamente en segundos. Una tarea programada solo se ejecuta al inicio; si la app falla después, permanecerá caída.
*   **Monitoreo y Gestión:** PM2 te permite ver fácilmente el estado de tu aplicación, su consumo de CPU y memoria con el comando `pm2 list`.
*   **Logs Centralizados:** Con `pm2 logs bcpos` puedes ver todos los registros (y errores) de la aplicación en un solo lugar, facilitando enormemente la solución de problemas.

En resumen, PM2 no solo inicia la aplicación, sino que la **vigila y la gestiona**, asegurando una mayor estabilidad.

---

## Cómo Actualizar la Aplicación

Una vez que el sistema está instalado y funcionando, querrás una forma fácil de aplicar las actualizaciones y nuevas funcionalidades que se desarrollen.

**Requisito Previo:** Para que esto funcione, la instalación inicial del proyecto en la computadora debe haberse realizado usando `git clone` y no simplemente copiando la carpeta. Si solo copiaste la carpeta, no podrás usar `git` para actualizar.

### Opción A: Actualización Automática con Script (Recomendado para Windows)

Para hacer el proceso de actualización lo más simple posible, he creado un script `update_windows.bat` que hace todo el trabajo por ti.

1.  **Ejecutar el Script:** Simplemente haz doble clic en el archivo `update_windows.bat` (no es necesario ejecutarlo como administrador esta vez, a menos que tengas problemas de permisos en la carpeta).
2.  **¡Listo!** El script se encargará de:
    *   Descargar los últimos cambios del código (`git pull`).
    *   Instalar cualquier nueva dependencia (`npm install`).
    *   Recompilar la aplicación con los nuevos cambios (`npm run build`).
    *   Reiniciar la aplicación en `pm2` sin tiempo de inactividad perceptible (`pm2 restart bcpos`).

### Opción B: Actualización Manual (Paso a Paso)

Si prefieres hacerlo manually o necesitas resolver algún problema (como un conflicto en `git`), estos son los pasos que sigue el script:

1.  **Abrir una Terminal:** Navega a la carpeta del proyecto en la línea de comandos (CMD o PowerShell).
2.  **Descargar Cambios:**
    ```bash
    git pull
    ```
3.  **Instalar Dependencias:**
    ```bash
    npm install
    ```
4.  **Compilar la Aplicación:**
    ```bash
    npm run build
    ```
5.  **Reiniciar el Servidor:**
    ```bash
    pm2 restart bcpos
    ```
    
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
    *   La plataforma te dará una URL pública (ej. `mipos.vercel.app`).
3.  **Configurar las Terminales:**
    *   En cada terminal, abre un navegador y ve a la URL pública. Todos se conectarán al mismo sistema.

Este modelo es más complejo de configurar al principio, pero es la arquitectura correcta, escalable y robusta para un sistema de punto de venta real.
