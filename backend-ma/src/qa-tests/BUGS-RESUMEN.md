# Resumen de Bugs Encontrados

Rama: `qa/pruebas-unitarias`  
Responsable: Pablo  
Fecha: 22/06/2026  
Entorno: Supabase (Flash-Delivery)

---

## Resumen general

| Total bugs | Críticos 🔴 | Altos 🟠 | Medios 🟡 |
|------------|-------------|----------|-----------|
| 8          | 0           | 5        | 3         |

---

## BUG-01 — Endpoint de listar usuarios sin restricción de rol

**Módulo:** Usuarios  
**Severidad:** Alta 🟠  
**Endpoint:** `GET /usuarios`  
**Descripción:** Un usuario con rol `Cliente` puede acceder al listado completo de todos los usuarios del sistema, incluyendo nombres, emails y teléfonos.  
**Resultado obtenido:** `200 OK` con datos de todos los usuarios  
**Resultado esperado:** `403 Forbidden`  
**Recomendación:** Agregar guard de roles que restrinja el acceso solo a `Admin`.

---

## BUG-02 — Login devuelve 201 en lugar de 200

**Módulo:** Auth  
**Severidad:** Media 🟡  
**Endpoint:** `POST /auth/login`  
**Descripción:** El endpoint de login retorna `201 Created` cuando semánticamente debería retornar `200 OK`, ya que no se está creando ningún recurso nuevo.  
**Resultado obtenido:** `201 Created`  
**Resultado esperado:** `200 OK`  
**Recomendación:** Agregar `@HttpCode(200)` al método de login en el controller.

---

## BUG-03 — PATCH municipio devuelve 500

**Módulo:** Municipio  
**Severidad:** Alta 🟠  
**Endpoint:** `PATCH /municipio/:id`  
**Descripción:** Al intentar actualizar un municipio el servidor responde con error interno `500` en lugar de procesar la actualización.  
**Resultado obtenido:** `500 Internal Server Error`  
**Resultado esperado:** `200 OK` con datos actualizados  
**Recomendación:** Revisar el service y el DTO de actualización de municipio.

---

## BUG-04 — PATCH zona devuelve 500

**Módulo:** Zona  
**Severidad:** Alta 🟠  
**Endpoint:** `PATCH /zona/:id`  
**Descripción:** Al intentar actualizar una zona el servidor responde con error interno `500`.  
**Resultado obtenido:** `500 Internal Server Error`  
**Resultado esperado:** `200 OK` con datos actualizados  
**Recomendación:** Revisar el service y el DTO de actualización de zona.

---

## BUG-05 — GET por ID inexistente devuelve 500 en lugar de 400

**Módulo:** Departamento, Municipio, Zona, Rol  
**Severidad:** Alta 🟠  
**Endpoints afectados:**
- `GET /departamento/99999`
- `GET /municipio/99999`
- `GET /zona/99999`
- `GET /rol/99999`

**Descripción:** Cuando se consulta un recurso con un ID que no existe, el servidor devuelve `500 Internal Server Error` en lugar de manejar el error correctamente.  
**Resultado obtenido:** `500 Internal Server Error`  
**Resultado esperado:** `400 Bad Request` o `404 Not Found`  
**Recomendación:** Agregar validación en cada service para verificar si el recurso existe y lanzar `NotFoundException` o `BadRequestException` según corresponda.

---

## BUG-06 — Datos de producción modificados durante pruebas

**Módulo:** Departamento / Rol  
**Severidad:** Media 🟡  
**Endpoint:** `PATCH /departamento/1`, `PATCH /rol/1`  
**Descripción:** Durante las pruebas se actualizó el nombre del departamento con ID 1 de `"Guatemala"` a `"Guatemala Actualizado"` y el rol 1 de `"Cliente"` a `"Admin Actualizado"`. Esto afectó datos reales de Supabase y se propagó a municipios, zonas y la función `fn_validar_roles_envio()`.  
**Recomendación:** Usar un entorno de staging separado del de producción para ejecutar pruebas.

---

## BUG-07 — Crear envío devuelve 500 por datos corruptos

**Módulo:** Envíos  
**Severidad:** Alta 🟠  
**Endpoint:** `POST /envios`  
**Descripción:** Al intentar crear un envío el servidor devuelve `500 Internal Server Error`. El error proviene de la función PLpgSQL `fn_validar_roles_envio()` que no reconoce al usuario como `Cliente` porque el nombre del rol fue modificado durante las pruebas de catálogos.  
**Error en servidor:**
```
error: El usuario 10 no tiene el rol de Cliente
where: PL/pgSQL function fn_validar_roles_envio() line 7 at RAISE
```
**Recomendación:** Restaurar el nombre del rol 1 a `"Cliente"` en la base de datos y usar datos de prueba aislados.

---

## BUG-08 — Error de PLpgSQL no manejado correctamente

**Módulo:** Envíos  
**Severidad:** Media 🟡  
**Endpoint:** `POST /envios`  
**Descripción:** Cuando la función PLpgSQL lanza un `RAISE`, el backend no lo captura ni lo convierte en un error controlado, sino que propaga directamente un `500 Internal Server Error` sin mensaje descriptivo para el cliente.  
**Recomendación:** Agregar manejo de excepciones en `EnviosService.crearEnvio()` para capturar errores de la BD y retornar respuestas HTTP apropiadas.

---

## Estado de corrección

| Bug | Módulo | Severidad | Reportado | Corregido |
|-----|--------|-----------|-----------|-----------|
| BUG-01 | Usuarios | Alta 🟠 | ✅ | ⏳ Pendiente |
| BUG-02 | Auth | Media 🟡 | ✅ | ⏳ Pendiente |
| BUG-03 | Municipio | Alta 🟠 | ✅ | ⏳ Pendiente |
| BUG-04 | Zona | Alta 🟠 | ✅ | ⏳ Pendiente |
| BUG-05 | Departamento, Municipio, Zona, Rol | Alta 🟠 | ✅ | ⏳ Pendiente |
| BUG-06 | Departamento / Rol | Media 🟡 | ✅ | ⏳ Pendiente |
| BUG-07 | Envíos | Alta 🟠 | ✅ | ⏳ Pendiente |
| BUG-08 | Envíos | Media 🟡 | ✅ | ⏳ Pendiente |