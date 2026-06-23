# Reporte de Pruebas de Integración — Módulos Envíos y Direcciones

Rama: `qa/pruebas-unitarias`  
Responsable: Pablo  
Fecha: 22/06/2026  
Entorno: Supabase (Flash-Delivery)  
Base URL: `http://localhost:3000`

---

## Resumen

| Total | Pasaron | Fallaron | Bugs encontrados |
|-------|---------|----------|------------------|
| 9     | 7 ✅    | 2 ❌     | 2 🐛             |

---

## Módulo: Direcciones `/direcciones`

### PDir-01 — Crear dirección

**Endpoint:** `POST /direcciones`  
**Auth:** Bearer Token (Cliente)  
**Body enviado:**
```json
{
  "municipio_id": 1,
  "zona_id": 1,
  "direccion_linea": "5a Avenida 10-50 Zona 1",
  "referencia": "Frente al parque"
}
```
**Esperado:** `200 OK`  
**Obtenido:** `200 OK`
```json
{
  "mensaje": "Dirección creada correctamente",
  "direccion": { "direccion_id": 11, "municipio_id": 1, "zona_id": 1, "direccion_linea": "5a Avenida 10-50 Zona 1" }
}
```
**Estado: ✅ PASS**

---

### PDir-02 — Listar todas las direcciones

**Endpoint:** `GET /direcciones`  
**Auth:** Bearer Token (Cliente)  
**Esperado:** `200 OK` con lista de direcciones  
**Obtenido:** `200 OK` — retornó 11 direcciones  
**Estado: ✅ PASS**

---

### PDir-03 — Obtener dirección por ID

**Endpoint:** `GET /direcciones/11`  
**Auth:** Bearer Token (Cliente)  
**Esperado:** `200 OK` con datos de la dirección  
**Obtenido:** `200 OK`  
**Estado: ✅ PASS**

---

### PDir-04 — Actualizar dirección

**Endpoint:** `PUT /direcciones/11`  
**Auth:** Bearer Token (Cliente)  
**Body enviado:**
```json
{
  "municipio_id": 1,
  "zona_id": 1,
  "direccion_linea": "5a Avenida 10-50 Zona 1 Actualizada",
  "referencia": "Actualizada por QA"
}
```
**Esperado:** `200 OK`  
**Obtenido:** `200 OK`  
**Estado: ✅ PASS**

---

### PDir-05 — Eliminar dirección

**Endpoint:** `DELETE /direcciones/11`  
**Auth:** Bearer Token (Cliente)  
**Esperado:** `200 OK`  
**Obtenido:** `200 OK`
```json
{ "mensaje": "Dirección eliminada" }
```
**Estado: ✅ PASS**

---

### PDir-06 — Obtener dirección inexistente

**Endpoint:** `GET /direcciones/99999`  
**Auth:** Bearer Token (Cliente)  
**Esperado:** `400 Bad Request`  
**Obtenido:** `400 Bad Request`
```json
{ "message": "Dirección no encontrada", "error": "Bad Request", "statusCode": 400 }
```
**Estado: ✅ PASS**  
**Nota:** A diferencia de departamento/municipio/zona, este módulo sí maneja correctamente el error de ID inexistente.

---

## Módulo: Envíos `/envios`

### PEnv-01 — Crear envío

**Endpoint:** `POST /envios`  
**Auth:** Bearer Token (Cliente)  
**Body enviado:**
```json
{
  "direccion_origen_id": 1,
  "direccion_destino_id": 2,
  "descripcion_paquete": "Paquete QA Test",
  "precio_sugerido": 50,
  "distancia_km": 5,
  "metodo_pago_id": 1
}
```
**Esperado:** `201 Created`  
**Obtenido:** `500 Internal Server Error`  
**Estado: ❌ FAIL — Ver BUG-07**

---

### PEnv-02 — Listar envíos disponibles

**Endpoint:** `GET /envios/disponibles`  
**Auth:** Bearer Token (Cliente)  
**Esperado:** `200 OK` con lista de envíos pendientes  
**Obtenido:** `200 OK` — retornó 3 envíos disponibles con detalle completo  
**Estado: ✅ PASS**

---

### PEnv-03 — Ver detalle de envío

**Endpoint:** `GET /envios/1`  
**Auth:** Bearer Token (Cliente)  
**Esperado:** `200 OK` con detalle del envío  
**Obtenido:** `200 OK`
```json
{
  "envio_id": 1,
  "descripcion_paquete": "Documentos legales en sobre manila",
  "estado": "Pendiente",
  "cliente": "María Fernanda López Castillo",
  "direccion_origen": "5ta Avenida 12-45",
  "direccion_destino": "12 Calle 3-45"
}
```
**Estado: ✅ PASS**

---

### PEnv-04 — Ver historial de envío

**Endpoint:** `GET /envios/1/historial`  
**Auth:** Bearer Token (Cliente)  
**Esperado:** `200 OK` con historial de estados  
**Obtenido:** `200 OK`
```json
{
  "historial_id": 1,
  "envio_id": 1,
  "estado_id": 1,
  "fecha_cambio": "2026-06-22T21:53:22.889Z",
  "comentario": "Registro automático de cambio de estado"
}
```
**Estado: ✅ PASS**

---

### PEnv-05 — Aceptar envío sin rol Repartidor

**Endpoint:** `PATCH /envios/1/aceptar`  
**Auth:** Bearer Token (Cliente)  
**Esperado:** `403 Forbidden` (endpoint restringido a Repartidor)  
**Obtenido:** `403 Forbidden`  
**Estado: ✅ PASS — Guard de roles funciona correctamente**

---

## 🐛 Bugs encontrados

### BUG-07 — Crear envío devuelve 500 por datos de prueba corruptos

**Severidad:** Alta 🟠  
**Endpoint:** `POST /envios`  
**Descripción:** Al intentar crear un envío el servidor devuelve `500 Internal Server Error`. El error proviene de la función PLpgSQL `fn_validar_roles_envio()` que indica que el usuario 10 no tiene el rol de `Cliente`. Esto ocurrió porque el script de pruebas de catálogos modificó el nombre del rol 1 de `"Cliente"` a `"Admin Actualizado"`, corrompiendo los datos de referencia.  
**Error en servidor:**
```
error: El usuario 10 no tiene el rol de Cliente
where: PL/pgSQL function fn_validar_roles_envio() line 7 at RAISE
```
**Recomendación:** Restaurar el nombre del rol 1 a `"Cliente"` en la base de datos. Usar datos de prueba aislados en futuras ejecuciones.

### BUG-08 — Error de PLpgSQL no manejado correctamente

**Severidad:** Media 🟡  
**Endpoint:** `POST /envios`  
**Descripción:** Cuando la función PLpgSQL lanza un `RAISE`, el backend no lo captura y lo convierte en un error controlado, sino que propaga directamente un `500 Internal Server Error` sin mensaje descriptivo para el cliente.  
**Recomendación:** Agregar manejo de excepciones en `EnviosService.crearEnvio()` para capturar errores de la BD y retornar respuestas HTTP apropiadas con mensajes claros.