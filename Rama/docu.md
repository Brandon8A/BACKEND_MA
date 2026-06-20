# Documentación de Base de Datos - Flash-Delivery MVP

Este documento detalla el modelo de datos para el sistema de entrega de última milla. El motor utilizado es **PostgreSQL 14+**.

## 1. Diseño y Estructura

El esquema está normalizado a **3FN** para garantizar la integridad y evitar anomalías. Se hace uso intensivo de **reglas de negocio embebidas** (triggers y funciones) para reducir la carga de lógica en el backend.

## 2. Descripción de Tablas Principales

## 2. Descripción de Tablas Principales

| **Tabla**                 | **Descripción**                                                |
| ------------------------- | -------------------------------------------------------------- |
| `usuarios`                | Datos base de clientes y repartidores.                         |
| `perfiles_repartidor`     | Atributos específicos del repartidor (vehículo, calificación). |
| `envios`                  | El núcleo transaccional. Registra el origen, destino y estado. |
| `envio_historial_estados` | Trazabilidad del pedido (bitácora de cambios).                 |
| `calificaciones`          | Evaluación post-entrega (1-5 estrellas).                       |

## 3. Lógica de Negocio (Automatizada en BD)

La integridad de los datos está protegida por triggers que el backend debe respetar:

- **Cálculo de Tarifa:** El campo `tarifa_calculada` en `envios` se calcula automáticamente como `distancia_km * 5.00`.

- **Validación de Roles:** Se dispara `trg_envios_validar_roles` para asegurar que solo usuarios con rol de 'Cliente' creen pedidos y usuarios con rol de 'Repartidor' los acepten.

- **Trazabilidad:** Cada cambio de `estado_id` en `envios` genera automáticamente un registro en `envio_historial_estados`.

- **Caché de Calificación:** Al insertar una calificación, se actualiza el promedio del repartidor en `perfiles_repartidor` mediante `trg_calificaciones_actualizar_promedio`.

## 4. Vistas para la API

Para simplificar las consultas desde el backend, utiliza las siguientes vistas:

### `vista_pedidos_disponibles`

- **Uso:** Listar pedidos para el tablero del repartidor.

- **Filtro:** `WHERE estado = 'Pendiente'`.

### `vista_resumen_envio`

- **Uso:** Mostrar detalles completos de un envío en proceso o finalizado.

## 5. Restricciones de Integridad y Check-Constraints

- **Teléfono:** Debe tener exactamente 8 dígitos (`^[0-9]{8}$`).

- **DPI:** Debe tener 13 dígitos.

- **Calificación:** Debe estar en el rango de 1 a 5.

- **Estado:** Solo se pueden calificar pedidos que tengan el estado `Entregado`.

> **Nota para el equipo de desarrollo:** No es necesario calcular la tarifa en el backend, ya que la base de datos la gestiona mediante una columna generada (`GENERATED ALWAYS AS`). Confíen en los errores lanzados por los triggers para manejar las validaciones de negocio.
