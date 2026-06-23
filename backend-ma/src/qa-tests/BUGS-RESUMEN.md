# Resumen de Bugs Encontrados

Rama: `qa/pruebas-unitarias`  
Responsable: Pablo  
Fecha: 22/06/2026  
Entorno: Supabase (Flash-Delivery)

---

## Resumen general

| Total bugs | Críticos 🔴 | Altos 🟠 | Medios 🟡 |
|------------|-------------|----------|-----------|
| 6          | 0           | 4        | 2         |

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

**Descripción:** Cuando se consulta un recurso con un ID que no existe, el servidor devuelve `500 Internal Server Error` en lugar de manejar el error correctamente con `400 Bad Request` o `404 Not Found`.  
**Resultado obtenido:** `500 Internal Server Error`  
**Resultado esperado:** `400 Bad Request` o `404 Not Found`  
**Recomendación:** Agregar validación en cada service para verificar si el recurso existe antes de retornarlo, y lanzar `NotFoundException` o `BadRequestException` según corresponda.

---

## BUG-06 — Nombre de departamento modificado por pruebas

**Módulo:** Departamento  
**Severidad:** Media 🟡  
**Endpoint:** `PATCH /departamento/1`  
**Descripción:** Durante las pruebas se actualizó el nombre del departamento con ID 1 de `"Guatemala"` a `"Guatemala Actualizado"`. Esto afectó datos reales de la base de datos de Supabase y se propagó a municipios y zonas relacionadas.  
**Recomendación:** Para futuras pruebas usar un entorno de staging separado del de producción, o revertir los cambios después de cada prueba.

---

## Estado de corrección

| Bug | Módulo | Reportado | Corregido |
|-----|--------|-----------|-----------|
| BUG-01 | Usuarios | ✅ | ⏳ Pendiente |
| BUG-02 | Auth | ✅ | ⏳ Pendiente |
| BUG-03 | Municipio | ✅ | ⏳ Pendiente |
| BUG-04 | Zona | ✅ | ⏳ Pendiente |
| BUG-05 | Departamento, Municipio, Zona, Rol | ✅ | ⏳ Pendiente |
| BUG-06 | Departamento | ✅ | ⏳ Pendiente |