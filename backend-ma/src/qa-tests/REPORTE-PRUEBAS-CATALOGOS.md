# Reporte de Pruebas de Integracion -- Modulos Catalogo

Rama: qa/pruebas-unitarias
Responsable: Pablo
Fecha: 22/06/2026 18:55
Entorno: Supabase (Flash-Delivery)
Base URL: http://localhost:3000

---

## Resumen

| Total | Pasaron | Fallaron |
|-------|---------|----------|
| 20 | 14 OK | 6 ERROR |

---

## Modulo: DEPARTAMENTO - /departamento

### PD-01 -- Crear departamento nuevo

**Endpoint:** POST 
**Esperado:** 200
**Obtenido:** 2xx
**Estado:** PASS

Respuesta:
{"departamento_id":6,"nombre":"Departamento QA Test"}

---

### PD-02 -- Listar todos los departamentos

**Endpoint:** GET 
**Esperado:** 200
**Obtenido:** 2xx
**Estado:** PASS

Respuesta:
[{"departamento_id":1,"nombre":"Guatemala"},{"departamento_id":2,"nombre":"Sacatepéquez"},{"departamento_id":3,"nombre":"Quetzaltenango"},{"departamento_id":4,"nombre":"Escuintla"},{"departamento_id":5,"nombre":"Chimaltenango"},{"departamento_id":6,"nombre":"Departamento QA Test"}]

---

### PD-03 -- Obtener departamento por ID

**Endpoint:** GET 
**Esperado:** 200
**Obtenido:** 2xx
**Estado:** PASS

Respuesta:
{"departamento_id":1,"nombre":"Guatemala"}

---

### PD-04 -- Actualizar departamento

**Endpoint:** PATCH 
**Esperado:** 200
**Obtenido:** 2xx
**Estado:** PASS

Respuesta:
{"departamento_id":1,"nombre":"Guatemala Actualizado"}

---

### PD-05 -- Obtener departamento inexistente

**Endpoint:** GET 
**Esperado:** 400
**Obtenido:** 0
**Estado:** FAIL

Respuesta:
Error en el servidor remoto: (500) Error interno del servidor.

---

## Modulo: MUNICIPIO - /municipio

### PM-01 -- Crear municipio nuevo

**Endpoint:** POST 
**Esperado:** 200
**Obtenido:** 2xx
**Estado:** PASS

Respuesta:
{"municipio_id":9,"nombre":"Municipio QA Test","departamento_id":1}

---

### PM-02 -- Listar todos los municipios

**Endpoint:** GET 
**Esperado:** 200
**Obtenido:** 2xx
**Estado:** PASS

Respuesta:
[{"municipio_id":1,"nombre":"Guatemala","departamento_id":1,"departamento":"Guatemala Actualizado"},{"municipio_id":2,"nombre":"Mixco","departamento_id":1,"departamento":"Guatemala Actualizado"},{"municipio_id":3,"nombre":"Villa Nueva","departamento_id":1,"departamento":"Guatemala Actualizado"},{"municipio_id":4,"nombre":"Santa Catarina Pinula","departamento_id":1,"departamento":"Guatemala Actualizado"},{"municipio_id":5,"nombre":"Antigua Guatemala","departamento_id":2,"departamento":"Sacatepéquez"},{"municipio_id":6,"nombre":"Quetzaltenango","departamento_id":3,"departamento":"Quetzaltenango"},{"municipio_id":7,"nombre":"Escuintla","departamento_id":4,"departamento":"Escuintla"},{"municipio_id":8,"nombre":"Chimaltenango","departamento_id":5,"departamento":"Chimaltenango"},{"municipio_id":9,"nombre":"Municipio QA Test","departamento_id":1,"departamento":"Guatemala Actualizado"}]

---

### PM-03 -- Obtener municipio por ID

**Endpoint:** GET 
**Esperado:** 200
**Obtenido:** 2xx
**Estado:** PASS

Respuesta:
{"municipio_id":1,"nombre":"Guatemala","departamento_id":1,"departamento":"Guatemala Actualizado"}

---

### PM-04 -- Actualizar municipio

**Endpoint:** PATCH 
**Esperado:** 200
**Obtenido:** 0
**Estado:** FAIL

Respuesta:
Error en el servidor remoto: (500) Error interno del servidor.

---

### PM-05 -- Obtener municipio inexistente

**Endpoint:** GET 
**Esperado:** 400
**Obtenido:** 0
**Estado:** FAIL

Respuesta:
Error en el servidor remoto: (500) Error interno del servidor.

---

## Modulo: ZONA - /zona

### PZ-01 -- Crear zona nueva

**Endpoint:** POST 
**Esperado:** 200
**Obtenido:** 2xx
**Estado:** PASS

Respuesta:
{"zona_id":13,"nombre":"Zona QA Test","municipio_id":1}

---

### PZ-02 -- Listar todas las zonas

**Endpoint:** GET 
**Esperado:** 200
**Obtenido:** 2xx
**Estado:** PASS

Respuesta:
[{"zona_id":1,"nombre":"Zona 1","municipio_id":1,"municipio":"Guatemala","departamento_id":1,"departamento":"Guatemala Actualizado"},{"zona_id":2,"nombre":"Zona 4","municipio_id":1,"municipio":"Guatemala","departamento_id":1,"departamento":"Guatemala Actualizado"},{"zona_id":3,"nombre":"Zona 7","municipio_id":1,"municipio":"Guatemala","departamento_id":1,"departamento":"Guatemala Actualizado"},{"zona_id":4,"nombre":"Zona 9","municipio_id":1,"municipio":"Guatemala","departamento_id":1,"departamento":"Guatemala Actualizado"},{"zona_id":5,"nombre":"Zona 10","municipio_id":1,"municipio":"Guatemala","departamento_id":1,"departamento":"Guatemala Actualizado"},{"zona_id":6,"nombre":"Zona 11","municipio_id":1,"municipio":"Guatemala","departamento_id":1,"departamento":"Guatemala Actualizado"},{"zona_id":7,"nombre":"Zona 13","municipio_id":1,"municipio":"Guatemala","departamento_id":1,"departamento":"Guatemala Actualizado"},{"zona_id":8,"nombre":"Zona 15","municipio_id":1,"municipio":"Guatemala","departamento_id":1,"departamento":"Guatemala Actualizado"},{"zona_id":9,"nombre":"Zona 16","municipio_id":1,"municipio":"Guatemala","departamento_id":1,"departamento":"Guatemala Actualizado"},{"zona_id":10,"nombre":"Zona 18","municipio_id":1,"municipio":"Guatemala","departamento_id":1,"departamento":"Guatemala Actualizado"},{"zona_id":11,"nombre":"Zona 1","municipio_id":2,"municipio":"Mixco","departamento_id":1,"departamento":"Guatemala Actualizado"},{"zona_id":12,"nombre":"Zona 4","municipio_id":2,"municipio":"Mixco","departamento_id":1,"departamento":"Guatemala Actualizado"},{"zona_id":13,"nombre":"Zona QA Test","municipio_id":1,"municipio":"Guatemala","departamento_id":1,"departamento":"Guatemala Actualizado"}]

---

### PZ-03 -- Obtener zona por ID

**Endpoint:** GET 
**Esperado:** 200
**Obtenido:** 2xx
**Estado:** PASS

Respuesta:
{"zona_id":1,"nombre":"Zona 1","municipio_id":1,"municipio":"Guatemala","departamento_id":1,"departamento":"Guatemala Actualizado"}

---

### PZ-04 -- Actualizar zona

**Endpoint:** PATCH 
**Esperado:** 200
**Obtenido:** 0
**Estado:** FAIL

Respuesta:
Error en el servidor remoto: (500) Error interno del servidor.

---

### PZ-05 -- Obtener zona inexistente

**Endpoint:** GET 
**Esperado:** 400
**Obtenido:** 0
**Estado:** FAIL

Respuesta:
Error en el servidor remoto: (500) Error interno del servidor.

---

## Modulo: ROL - /rol

### PR-01 -- Crear rol nuevo

**Endpoint:** POST 
**Esperado:** 200
**Obtenido:** 2xx
**Estado:** PASS

Respuesta:
{"rol_id":3,"nombre_rol":"QA Tester"}

---

### PR-02 -- Listar todos los roles

**Endpoint:** GET 
**Esperado:** 200
**Obtenido:** 2xx
**Estado:** PASS

Respuesta:
[{"rol_id":1,"nombre_rol":"Cliente"},{"rol_id":2,"nombre_rol":"Repartidor"},{"rol_id":3,"nombre_rol":"QA Tester"}]

---

### PR-03 -- Obtener rol por ID

**Endpoint:** GET 
**Esperado:** 200
**Obtenido:** 2xx
**Estado:** PASS

Respuesta:
{"rol_id":1,"nombre_rol":"Cliente"}

---

### PR-04 -- Actualizar rol

**Endpoint:** PATCH 
**Esperado:** 200
**Obtenido:** 2xx
**Estado:** PASS

Respuesta:
{"rol_id":1,"nombre_rol":"Admin Actualizado"}

---

### PR-05 -- Obtener rol inexistente

**Endpoint:** GET 
**Esperado:** 400
**Obtenido:** 0
**Estado:** FAIL

Respuesta:
Error en el servidor remoto: (500) Error interno del servidor.

---

