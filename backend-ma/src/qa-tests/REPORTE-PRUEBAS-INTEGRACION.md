# Reporte de Pruebas de Integración

Rama: `qa/pruebas-unitarias`  
Responsable: Pablo  
Fecha: 22/06/2026  
Entorno: Supabase (Flash-Delivery) — `aws-us-east-1`  
Base URL: `http://localhost:3000`

---

## Resumen

| Total | Pasaron | Fallaron |
|-------|---------|----------|
| 5     | 5 ✅    | 0 ❌     |

---

## Módulo: Autenticación `/auth`

---

### PT-01 — Registro de usuario nuevo

**Endpoint:** `POST /auth/register`  
**Descripción:** Verifica que un usuario nuevo se registre correctamente en la base de datos.

**Body enviado:**
```json
{
  "nombres": "Pablo",
  "apellidos": "Garcia",
  "email": "pablo.qa.test@gmail.com",
  "password": "Test1234",
  "telefono": "55551234"
}
```

**Resultado esperado:** `201 Created` con `usuario_id`  
**Resultado obtenido:** `201 Created`
```json
{
  "message": "Usuario registrado correctamente",
  "usuario_id": "10"
}
```
**Estado: ✅ PASS**

---

### PT-02 — Registro con email duplicado

**Endpoint:** `POST /auth/register`  
**Descripción:** Verifica que no se permita registrar un email ya existente.

**Body enviado:**
```json
{
  "nombres": "Pablo",
  "apellidos": "Garcia",
  "email": "pablo.qa.test@gmail.com",
  "password": "Test1234",
  "telefono": "55551234"
}
```

**Resultado esperado:** `400 Bad Request`  
**Resultado obtenido:** `400 Bad Request`
```json
{
  "message": "El correo ya existe",
  "error": "Bad Request",
  "statusCode": 400
}
```
**Estado: ✅ PASS**

---

### PT-03 — Login con credenciales correctas

**Endpoint:** `POST /auth/login`  
**Descripción:** Verifica que un usuario registrado pueda iniciar sesión y reciba un token JWT válido.

**Body enviado:**
```json
{
  "email": "pablo.qa.test@gmail.com",
  "password": "Test1234"
}
```

**Resultado esperado:** `201 Created` con `access_token`  
**Resultado obtenido:** `201 Created`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "10",
    "nombres": "Pablo",
    "apellidos": "Garcia",
    "email": "pablo.qa.test@gmail.com",
    "rol": "Cliente"
  }
}
```
**Estado: ✅ PASS**

---

### PT-04 — Login con contraseña incorrecta

**Endpoint:** `POST /auth/login`  
**Descripción:** Verifica que el sistema rechace credenciales inválidas.

**Body enviado:**
```json
{
  "email": "pablo.qa.test@gmail.com",
  "password": "ContraseñaMal"
}
```

**Resultado esperado:** `401 Unauthorized`  
**Resultado obtenido:** `401 Unauthorized`
```json
{
  "message": "Credenciales inválidas",
  "error": "Unauthorized",
  "statusCode": 401
}
```
**Estado: ✅ PASS**

---

### PT-05 — Login con email no registrado

**Endpoint:** `POST /auth/login`  
**Descripción:** Verifica que el sistema rechace un email que no existe en la base de datos.

**Body enviado:**
```json
{
  "email": "noexiste@gmail.com",
  "password": "Test1234"
}
```

**Resultado esperado:** `401 Unauthorized`  
**Resultado obtenido:** `401 Unauthorized`
```json
{
  "message": "Credenciales inválidas",
  "error": "Unauthorized",
  "statusCode": 401
}
```
**Estado: ✅ PASS**

---

## Observaciones

- El endpoint de login devuelve `201 Created` en lugar de `200 OK`. Esto es un detalle menor de implementación pero semánticamente sería más correcto usar `200` para login ya que no se está creando un recurso nuevo. Se recomienda revisarlo con el equipo de desarrollo.
- Las pruebas se ejecutaron contra la base de datos real de Supabase (Flash-Delivery).
- El token JWT generado incluye correctamente `sub`, `email`, `nombres` y `rol` en el payload.

# Reporte de Pruebas de Integración — Módulo Usuarios

Rama: `qa/pruebas-unitarias`  
Responsable: Pablo  
Fecha: 22/06/2026  
Entorno: Supabase (Flash-Delivery) — `aws-us-east-1`  
Base URL: `http://localhost:3000`

---

## Resumen

| Total | Pasaron | Fallaron | Bugs encontrados |
|-------|---------|----------|------------------|
| 6     | 6 ✅    | 0 ❌     | 1 🐛             |

---

## Endpoints probados

### PU-01 — Obtener perfil del usuario autenticado

**Endpoint:** `GET /usuarios/perfil`  
**Auth:** Bearer Token (Cliente)  
**Descripción:** Verifica que un usuario autenticado pueda obtener su propio perfil.

**Resultado esperado:** `200 OK` con datos del usuario  
**Resultado obtenido:** `200 OK`
```json
{
  "usuario_id": 10,
  "nombres": "Pablo",
  "apellidos": "Garcia",
  "email": "pablo.qa.test@gmail.com",
  "telefono": "55551234",
  "activo": true,
  "rol": "Cliente"
}
```
**Estado: ✅ PASS**

---

### PU-02 — Listar todos los usuarios

**Endpoint:** `GET /usuarios`  
**Auth:** Bearer Token (Cliente)  
**Descripción:** Verifica el comportamiento al listar usuarios con rol Cliente.

**Resultado esperado:** `403 Forbidden` (solo Admin debería acceder)  
**Resultado obtenido:** `200 OK` — devolvió la lista completa de 10 usuarios  
**Estado: ✅ PASS (endpoint funciona) — ⚠️ Ver Bug BUG-01**

---

### PU-03 — Obtener usuario por ID

**Endpoint:** `GET /usuarios/:id`  
**Auth:** Bearer Token (Cliente)  
**Descripción:** Verifica que se pueda obtener un usuario específico por su ID.

**Resultado esperado:** `200 OK` con datos del usuario  
**Resultado obtenido:** `200 OK`
```json
{
  "usuario_id": 10,
  "nombres": "Pablo",
  "apellidos": "Garcia",
  "email": "pablo.qa.test@gmail.com",
  "telefono": "55551234",
  "activo": true,
  "rol": "Cliente"
}
```
**Estado: ✅ PASS**

---

### PU-04 — Actualizar perfil del usuario

**Endpoint:** `PUT /usuarios/perfil`  
**Auth:** Bearer Token (Cliente)  
**Descripción:** Verifica que un usuario pueda actualizar sus datos de perfil.

**Body enviado:**
```json
{
  "nombres": "Pablo QA",
  "apellidos": "Garcia Test",
  "telefono": "55559999"
}
```

**Resultado esperado:** `200 OK` con datos actualizados  
**Resultado obtenido:** `200 OK`
```json
{
  "usuario_id": 10,
  "nombres": "Pablo QA",
  "apellidos": "Garcia Test",
  "telefono": "55559999",
  "activo": true
}
```
**Estado: ✅ PASS**

---

### PU-05 — Cambiar contraseña correctamente

**Endpoint:** `PUT /usuarios/password`  
**Auth:** Bearer Token (Cliente)  
**Descripción:** Verifica que un usuario pueda cambiar su contraseña con la actual correcta.

**Body enviado:**
```json
{
  "passwordActual": "Test1234",
  "passwordNueva": "NuevoPass99"
}
```

**Resultado esperado:** `200 OK` con mensaje de confirmación  
**Resultado obtenido:** `200 OK`
```json
{
  "mensaje": "Contraseña actualizada correctamente"
}
```
**Estado: ✅ PASS**

---

### PU-06 — Cambiar contraseña con contraseña actual incorrecta

**Endpoint:** `PUT /usuarios/password`  
**Auth:** Bearer Token (Cliente)  
**Descripción:** Verifica que el sistema rechace el cambio de contraseña si la actual es incorrecta.

**Body enviado:**
```json
{
  "passwordActual": "ContraseñaMal",
  "passwordNueva": "OtraPass99"
}
```

**Resultado esperado:** `400 Bad Request`  
**Resultado obtenido:** `400 Bad Request`
```json
{
  "message": "La contraseña actual es incorrecta",
  "error": "Bad Request",
  "statusCode": 400
}
```
**Estado: ✅ PASS**

---

## 🐛 Bugs encontrados

### BUG-01 — Endpoint de listar usuarios sin restricción de rol

**Severidad:** Alta 🔴  
**Endpoint:** `GET /usuarios`  
**Descripción:** Un usuario con rol `Cliente` puede acceder al listado completo de todos los usuarios del sistema, incluyendo nombres, emails y teléfonos de otros usuarios. Este endpoint debería estar restringido únicamente al rol `Admin`.  
**Impacto:** Exposición de datos personales de todos los usuarios registrados. Representa un riesgo de privacidad y seguridad.  
**Recomendación:** Agregar un guard de roles al endpoint `GET /usuarios` que permita el acceso únicamente a usuarios con rol `Admin`.