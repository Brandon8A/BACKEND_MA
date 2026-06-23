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
