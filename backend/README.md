# GeoWater - Backend API RESTful

**Proyecto Final - Ingeniería en Sistemas Computacionales**

### Equipo de Desarrollo
* **Luis Gerardo Martínez Mancilla** - No. Control: 22224011
* **Jaime Salvador Rodriguez Hernandez** - No. Control: 22224021

---

## Descripción del Proyecto
GeoWater es el sistema central (Backend) diseñado para la gestión, control y monitoreo de incidencias y reportes de fugas de agua. La API fue construida bajo el patrón de arquitectura **MVC (Modelo-Vista-Controlador)** garantizando escalabilidad, modularidad y alta cohesión.

Se implementó una base de datos relacional alojada en la nube mediante **Aiven (MySQL)**, asegurando disponibilidad e integridad de los datos. La seguridad de los endpoints privados está blindada mediante autenticación por tokens **JWT (JSON Web Tokens)**.

## Tecnologías Utilizadas
* **Entorno de Ejecución:** Node.js
* **Framework:** Express.js
* **Base de Datos:** MySQL 8.x (Cloud Aiven)
* **Seguridad y Encriptación:** JWT (JsonWebToken) y Bcrypt.js
* **Arquitectura:** Patrón MVC

## Módulos Implementados (CRUDs Completos)
1. **Autenticación:** Registro de usuarios (contraseñas hasheadas) y Login con generación de JWT.
2. **Reportes (Fugas):** Gestión de reportes geolocalizados (latitud/longitud) y filtro por gravedad.
3. **Zonas:** Control de zonas de cobertura y monitor de estados operativos.
4. **Técnicos:** Asignación de personal operativo y disponibilidad.
5. **Estadísticas:** Métricas de rendimiento, fugas reparadas y tiempos promedios.

## 🛠️ Instrucciones de Instalación
1. Clonar el repositorio.
2. Ejecutar el comando `npm install` para descargar las dependencias.
3. Configurar el archivo `.env` con las credenciales de Aiven y el JWT Secret.
4. (Opcional) Ejecutar `node crearTablas.js` para inicializar la estructura de la base de datos.
5. Iniciar el servidor con el comando `node server.js`. El sistema correrá en el puerto 3000.