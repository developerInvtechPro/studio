
# Guía de Despliegue de BCPOS

Este documento explica cómo desplegar el sistema BCPOS en otros equipos. Existen dos modelos principales, dependiendo de si necesitas que las terminales compartan la información o funcionen de manera independiente.

---

## Modelo 1: Despliegue Aislado por Terminal (Datos No Compartidos)

En este modelo, cada computadora ejecuta su propia copia completa de la aplicación, incluyendo su propia base de datos. Es ideal para un escenario con una única terminal o para terminales que no necesitan sincronizarse entre sí.

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

---

## Modelo 2: Despliegue Centralizado (Recomendado para Múltiples Terminales)

Este es el modelo profesional y estándar para un entorno de producción real donde múltiples terminales (cajas) deben compartir la misma información en tiempo real (ver las mismas órdenes abiertas, compartir inventario, etc.).

**Arquitectura:**
*   **1 Servidor Central:** La aplicación Next.js se instala y ejecuta en un único servidor o plataforma de hosting.
*   **1 Base de Datos Centralizada:** La base de datos SQLite se reemplaza por una base de datos de red (ej. PostgreSQL, MySQL) a la que el servidor central se conecta.
*   **Múltiples Clientes (Terminales):** Las terminales no necesitan el código del proyecto. Solo necesitan un navegador web para acceder a la aplicación a través de su URL.

### Pasos a Nivel General

1.  **Migrar la Base de Datos (El paso más crítico):**
    *   La base de datos actual (SQLite) es un archivo local y no está diseñada para el acceso concurrente desde múltiples equipos.
    *   Deberás configurar una base de datos de red como **PostgreSQL** o **MySQL** en un servidor.
    *   Luego, deberás modificar el código de la aplicación, principalmente en `src/lib/db.ts` y `src/app/actions.ts`, para que en lugar de conectarse al archivo SQLite, se conecte a esta nueva base de datos de red. Esto implica cambiar el driver de la base de datos y ajustar las consultas si es necesario.

2.  **Desplegar la Aplicación Next.js:**
    *   Sube el código de tu proyecto a una plataforma de hosting que soporte Node.js, como **Vercel** (recomendado para Next.js), **Firebase App Hosting**, AWS, o un servidor privado.
    *   Configura las variables de entorno en esa plataforma para que la aplicación pueda conectarse a tu base de datos centralizada (ej. `DATABASE_URL`, `DB_USER`, `DB_PASSWORD`).
    *   La plataforma de hosting se encargará de los pasos `npm install`, `npm run build` y `npm run start` por ti. Te proporcionará una URL pública (ej. `https://mipos.vercel.app`).

3.  **Configurar las Terminales:**
    *   En cada computadora que funcionará como caja, simplemente abre un navegador web.
    *   Navega a la URL pública que te dio la plataforma de hosting.
    *   ¡Listo! No se requiere ninguna instalación de código en las terminales. Todos los usuarios iniciarán sesión y operarán contra el mismo sistema central.

Este modelo es más complejo de configurar al principio, pero es la arquitectura correcta, escalable y robusta para un sistema de punto de venta real.
