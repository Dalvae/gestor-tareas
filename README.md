# Sistema de Gestión de Tareas

Este es un sistema de gestión de tareas completo, construido a partir de [full-stack-fastapi-template](https://github.com/fastapi/full-stack-fastapi-template), diseñado para ayudarte a organizar y administrar tus tareas de manera eficiente.

## Stack Tecnológico

-   **Backend:**
    -   **FastAPI (Python):** Para la API RESTful.
    -   **SQLModel:** ORM para la interacción con la base de datos.
    -   **Pydantic:** Validación de datos y gestión de configuraciones.
    -   **PostgreSQL:** Base de datos relacional.
-   **Frontend:**
    -   **React:** Para la interfaz de usuario, utilizando TypeScript, hooks y Vite.
    -   **Chakra UI:** Componentes de UI para un diseño moderno y responsivo.
    -   **Playwright:** Para pruebas End-to-End.
    -   Soporte para modo oscuro.
-   **Contenedores:**
    -   **Docker Compose:** Para el desarrollo y despliegue de la aplicación.
-   **Autenticación:**
    -   Hashing seguro de contraseñas.
    -   Autenticación JWT (JSON Web Token).
    -   Recuperación de contraseña basada en correo electrónico.
-   **Pruebas:**
    -   **Pytest:** Para pruebas unitarias y de integración en el backend.

## Cómo Usarlo

Para facilitar la puesta en marcha, los archivos `.env` necesarios ya están incluidos en el repositorio.

### Credenciales por Defecto

-   **Usuario:** `jesus@example.com`
-   **Contraseña:** `changethis`

### Ejecutar la Aplicación

Para levantar la aplicación, simplemente ejecuta el siguiente comando en la raíz del proyecto:

```bash
docker-compose watch
```

Esto iniciará todos los servicios necesarios (backend, frontend, base de datos) y los mantendrá actualizados con los cambios en el código.

### Acceso a la Aplicación

Una vez que los servicios estén en funcionamiento:

-   **Frontend:** Accede a la aplicación en tu navegador a través de `http://localhost:5173`
-   **Backend API:** La API del backend está disponible en `http://localhost:8000`
-   **Documentación de la API (Swagger UI):** Puedes explorar los endpoints de la API en `http://localhost:8000/docs`

## Documentación Adicional

-   [Despliegue](./deployment.md)
-   [Desarrollo](./development.md)
-   [Notas de Lanzamiento](./release-notes.md)
-   [Seguridad](./SECURITY.md)
