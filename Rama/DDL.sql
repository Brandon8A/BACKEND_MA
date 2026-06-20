
-- -----------------------------------------------------------------------------
-- 1. CATALOGOS GEOGRÁFICOS
-- -----------------------------------------------------------------------------

CREATE TABLE departamentos (
    departamento_id     SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre               VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE municipios (
    municipio_id         SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre                VARCHAR(80) NOT NULL,
    departamento_id       SMALLINT NOT NULL REFERENCES departamentos(departamento_id),
    CONSTRAINT uq_municipio_departamento UNIQUE (nombre, departamento_id)
);

CREATE TABLE zonas (
    zona_id               SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre                 VARCHAR(30) NOT NULL,          -- Ej: 'Zona 1', 'Zona 10'
    municipio_id           SMALLINT NOT NULL REFERENCES municipios(municipio_id),
    CONSTRAINT uq_zona_municipio UNIQUE (nombre, municipio_id)
);

-- -----------------------------------------------------------------------------
-- 2. CATÁLOGOS DE NEGOCIO
-- -----------------------------------------------------------------------------

CREATE TABLE roles (
    rol_id                SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_rol             VARCHAR(20) NOT NULL UNIQUE     -- Cliente, Repartidor, Administrador
);

CREATE TABLE tipos_vehiculo (
    tipo_vehiculo_id      SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre                  VARCHAR(30) NOT NULL UNIQUE    -- Moto, Bicicleta, Carro, A pie, Camioneta
);

CREATE TABLE estados_envio (
    estado_id              SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre                   VARCHAR(20) NOT NULL UNIQUE,  -- Pendiente, Aceptado, En_Camino, Entregado, Cancelado
    orden_flujo              SMALLINT NOT NULL UNIQUE      -- orden lógico del flujo de negocio
);

CREATE TABLE metodos_pago (
    metodo_pago_id          SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre                    VARCHAR(20) NOT NULL UNIQUE  -- Efectivo, Tarjeta, Transferencia
);

-- -----------------------------------------------------------------------------
-- 3. USUARIOS Y ROLES 
-- -----------------------------------------------------------------------------

CREATE TABLE usuarios (
    usuario_id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombres                  VARCHAR(80) NOT NULL,
    apellidos                VARCHAR(80) NOT NULL,
    email                     VARCHAR(120) NOT NULL UNIQUE,
    password_hash             VARCHAR(255) NOT NULL,
    telefono                   VARCHAR(8) NOT NULL,         
    dpi                         VARCHAR(13) UNIQUE,          
    foto_url                     VARCHAR(255),
    fecha_nacimiento              DATE,
    activo                          BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_registro                  TIMESTAMPTZ NOT NULL DEFAULT now(),
    fecha_actualizacion              TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT ck_usuarios_telefono CHECK (telefono ~ '^[0-9]{8}$'),
    CONSTRAINT ck_usuarios_dpi CHECK (dpi IS NULL OR dpi ~ '^[0-9]{13}$')
);

CREATE TABLE usuario_roles (
    usuario_id              BIGINT NOT NULL REFERENCES usuarios(usuario_id) ON DELETE CASCADE,
    rol_id                    SMALLINT NOT NULL REFERENCES roles(rol_id),
    fecha_asignacion           TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (usuario_id, rol_id)
);

CREATE TABLE perfiles_repartidor (
    usuario_id               BIGINT PRIMARY KEY REFERENCES usuarios(usuario_id) ON DELETE CASCADE,
    tipo_vehiculo_id           SMALLINT NOT NULL REFERENCES tipos_vehiculo(tipo_vehiculo_id),
    placa                        VARCHAR(10),
    marca                         VARCHAR(40),
    modelo                          VARCHAR(40),
    color                             VARCHAR(20),
    calificacion_promedio              NUMERIC(3,2) NOT NULL DEFAULT 0.00, 
    total_calificaciones                 INTEGER NOT NULL DEFAULT 0,        
    disponible                             BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT ck_calificacion_promedio CHECK (calificacion_promedio BETWEEN 0 AND 5)
);

-- -----------------------------------------------------------------------------
-- 4. DIRECCIONES  (Origen / Destino del envío)
-- -----------------------------------------------------------------------------

CREATE TABLE direcciones (
    direccion_id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    municipio_id                SMALLINT NOT NULL REFERENCES municipios(municipio_id),
    zona_id                       SMALLINT REFERENCES zonas(zona_id),  
    direccion_linea                 VARCHAR(200) NOT NULL,              
    referencia                        VARCHAR(200),                     
    latitud                             NUMERIC(10,7),
    longitud                              NUMERIC(10,7)
);

-- -----------------------------------------------------------------------------
-- 5. ENVIOS
-- -----------------------------------------------------------------------------

CREATE TABLE envios (
    envio_id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cliente_id                  BIGINT NOT NULL REFERENCES usuarios(usuario_id),
    repartidor_id                 BIGINT REFERENCES usuarios(usuario_id),  -- NULL hasta el "match"
    direccion_origen_id             BIGINT NOT NULL REFERENCES direcciones(direccion_id),
    direccion_destino_id              BIGINT NOT NULL REFERENCES direcciones(direccion_id),
    descripcion_paquete                 VARCHAR(300) NOT NULL,
    precio_sugerido                       NUMERIC(10,2) NOT NULL CHECK (precio_sugerido >= 0),
    distancia_km                            NUMERIC(6,2) NOT NULL CHECK (distancia_km >= 0),
    tarifa_calculada                          NUMERIC(10,2) GENERATED ALWAYS AS (distancia_km * 5.00) STORED,
    metodo_pago_id                              SMALLINT REFERENCES metodos_pago(metodo_pago_id),
    estado_id                                     SMALLINT NOT NULL REFERENCES estados_envio(estado_id),
    fecha_creacion                                  TIMESTAMPTZ NOT NULL DEFAULT now(),
    fecha_aceptacion                                  TIMESTAMPTZ,
    fecha_entrega                                       TIMESTAMPTZ,
    fecha_actualizacion                                   TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT ck_envio_no_auto_entrega CHECK (repartidor_id IS NULL OR repartidor_id <> cliente_id),
    CONSTRAINT ck_envio_origen_destino CHECK (direccion_origen_id <> direccion_destino_id)
);

-- Historial de cambios de estado
CREATE TABLE envio_historial_estados (
    historial_id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    envio_id                      BIGINT NOT NULL REFERENCES envios(envio_id) ON DELETE CASCADE,
    estado_id                       SMALLINT NOT NULL REFERENCES estados_envio(estado_id),
    usuario_id                        BIGINT REFERENCES usuarios(usuario_id), -- quién originó el cambio
    fecha_cambio                        TIMESTAMPTZ NOT NULL DEFAULT now(),
    comentario                            VARCHAR(200)
);

-- -----------------------------------------------------------------------------
-- 6. CALIFICACIONES
-- -----------------------------------------------------------------------------

CREATE TABLE calificaciones (
    calificacion_id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    envio_id                       BIGINT NOT NULL UNIQUE REFERENCES envios(envio_id) ON DELETE CASCADE,
    cliente_id                       BIGINT NOT NULL REFERENCES usuarios(usuario_id),
    repartidor_id                      BIGINT NOT NULL REFERENCES usuarios(usuario_id),
    puntuacion                           SMALLINT NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
    comentario                             VARCHAR(300),
    fecha_calificacion                       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 7. INDICES
-- =============================================================================

CREATE INDEX idx_usuarios_email             ON usuarios(email);
CREATE INDEX idx_municipios_departamento     ON municipios(departamento_id);
CREATE INDEX idx_zonas_municipio             ON zonas(municipio_id);
CREATE INDEX idx_direcciones_municipio       ON direcciones(municipio_id);
CREATE INDEX idx_direcciones_zona            ON direcciones(zona_id);
CREATE INDEX idx_envios_cliente              ON envios(cliente_id);
CREATE INDEX idx_envios_repartidor           ON envios(repartidor_id);
CREATE INDEX idx_envios_estado               ON envios(estado_id);
CREATE INDEX idx_envios_fecha_creacion       ON envios(fecha_creacion);
CREATE INDEX idx_historial_envio             ON envio_historial_estados(envio_id);
CREATE INDEX idx_calificaciones_repartidor   ON calificaciones(repartidor_id);

-- =============================================================================
-- 8. FUNCIONES Y TRIGGERS
-- =============================================================================

CREATE OR REPLACE FUNCTION fn_actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_usuarios_actualizar
BEFORE UPDATE ON usuarios
FOR EACH ROW EXECUTE FUNCTION fn_actualizar_timestamp();

CREATE TRIGGER trg_envios_actualizar
BEFORE UPDATE ON envios
FOR EACH ROW EXECUTE FUNCTION fn_actualizar_timestamp();

CREATE OR REPLACE FUNCTION fn_validar_roles_envio()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM usuario_roles ur JOIN roles r ON r.rol_id = ur.rol_id
        WHERE ur.usuario_id = NEW.cliente_id AND r.nombre_rol = 'Cliente'
    ) THEN
        RAISE EXCEPTION 'El usuario % no tiene el rol de Cliente', NEW.cliente_id;
    END IF;

    IF NEW.repartidor_id IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM usuario_roles ur JOIN roles r ON r.rol_id = ur.rol_id
        WHERE ur.usuario_id = NEW.repartidor_id AND r.nombre_rol = 'Repartidor'
    ) THEN
        RAISE EXCEPTION 'El usuario % no tiene el rol de Repartidor', NEW.repartidor_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_envios_validar_roles
BEFORE INSERT OR UPDATE ON envios
FOR EACH ROW EXECUTE FUNCTION fn_validar_roles_envio();

CREATE OR REPLACE FUNCTION fn_validar_rol_repartidor()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM usuario_roles ur JOIN roles r ON r.rol_id = ur.rol_id
        WHERE ur.usuario_id = NEW.usuario_id AND r.nombre_rol = 'Repartidor'
    ) THEN
        RAISE EXCEPTION 'El usuario % debe tener el rol Repartidor antes de crear su perfil', NEW.usuario_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_perfil_repartidor_validar_rol
BEFORE INSERT ON perfiles_repartidor
FOR EACH ROW EXECUTE FUNCTION fn_validar_rol_repartidor();

CREATE OR REPLACE FUNCTION fn_registrar_historial_estado()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO envio_historial_estados (envio_id, estado_id, usuario_id, comentario)
    VALUES (NEW.envio_id, NEW.estado_id, COALESCE(NEW.repartidor_id, NEW.cliente_id),
            'Registro automático de cambio de estado');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_envios_historial_insert
AFTER INSERT ON envios
FOR EACH ROW EXECUTE FUNCTION fn_registrar_historial_estado();

CREATE TRIGGER trg_envios_historial_update
AFTER UPDATE OF estado_id ON envios
FOR EACH ROW
WHEN (NEW.estado_id IS DISTINCT FROM OLD.estado_id)
EXECUTE FUNCTION fn_registrar_historial_estado();

CREATE OR REPLACE FUNCTION fn_validar_calificacion_envio_entregado()
RETURNS TRIGGER AS $$
DECLARE
    v_estado VARCHAR(20);
BEGIN
    SELECT e.nombre INTO v_estado
    FROM envios en JOIN estados_envio e ON e.estado_id = en.estado_id
    WHERE en.envio_id = NEW.envio_id;

    IF v_estado IS DISTINCT FROM 'Entregado' THEN
        RAISE EXCEPTION 'Solo se pueden calificar envíos en estado Entregado (estado actual: %)', v_estado;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calificaciones_validar_estado
BEFORE INSERT ON calificaciones
FOR EACH ROW EXECUTE FUNCTION fn_validar_calificacion_envio_entregado();

CREATE OR REPLACE FUNCTION fn_actualizar_calificacion_repartidor()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE perfiles_repartidor
    SET total_calificaciones = total_calificaciones + 1,
        calificacion_promedio = ROUND(
            ((calificacion_promedio * total_calificaciones) + NEW.puntuacion)
            / (total_calificaciones + 1), 2)
    WHERE usuario_id = NEW.repartidor_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calificaciones_actualizar_promedio
AFTER INSERT ON calificaciones
FOR EACH ROW EXECUTE FUNCTION fn_actualizar_calificacion_repartidor();

-- =============================================================================
-- 9. VISTAS DE APOYO PARA LA APLICACIÓN
-- =============================================================================

CREATE OR REPLACE VIEW vista_pedidos_disponibles AS
SELECT en.envio_id,
       en.descripcion_paquete,
       en.precio_sugerido,
       en.tarifa_calculada,
       en.distancia_km,
       z.nombre        AS zona_origen,
       m.nombre        AS municipio_origen,
       u.nombres || ' ' || u.apellidos AS cliente,
       en.fecha_creacion
FROM envios en
JOIN direcciones d   ON d.direccion_id = en.direccion_origen_id
LEFT JOIN zonas z    ON z.zona_id = d.zona_id
JOIN municipios m    ON m.municipio_id = d.municipio_id
JOIN estados_envio es ON es.estado_id = en.estado_id
JOIN usuarios u      ON u.usuario_id = en.cliente_id
WHERE es.nombre = 'Pendiente';

CREATE OR REPLACE VIEW vista_resumen_envio AS
SELECT en.envio_id,
       en.descripcion_paquete,
       en.precio_sugerido,
       en.tarifa_calculada,
       en.distancia_km,
       es.nombre AS estado,
       (uc.nombres || ' ' || uc.apellidos) AS cliente,
       uc.telefono AS telefono_cliente,
       (ur.nombres || ' ' || ur.apellidos) AS repartidor,
       ur.telefono AS telefono_repartidor,
       origen.direccion_linea  AS direccion_origen,
       destino.direccion_linea AS direccion_destino,
       en.fecha_creacion,
       en.fecha_aceptacion,
       en.fecha_entrega
FROM envios en
JOIN estados_envio es        ON es.estado_id = en.estado_id
JOIN usuarios uc              ON uc.usuario_id = en.cliente_id
LEFT JOIN usuarios ur          ON ur.usuario_id = en.repartidor_id
JOIN direcciones origen        ON origen.direccion_id = en.direccion_origen_id
JOIN direcciones destino       ON destino.direccion_id = en.direccion_destino_id;

-- =============================================================================

COMMENT ON TABLE usuarios IS 'Datos comunes a Clientes y Repartidores. Los roles se asignan en usuario_roles.';
COMMENT ON TABLE perfiles_repartidor IS 'Extensión 1:1 de usuarios solo para quienes tienen rol Repartidor (datos de vehículo).';
COMMENT ON TABLE envios IS 'Núcleo del negocio: una solicitud de envío de un Cliente, opcionalmente tomada (match) por un Repartidor.';
COMMENT ON COLUMN envios.tarifa_calculada IS 'Columna generada automáticamente: distancia_km * Q5.00, garantiza consistencia sin lógica en backend.';
COMMENT ON TABLE envio_historial_estados IS 'Bitácora de cambios de estado del envío, poblada automáticamente por trigger (trazabilidad tipo Kanban).';
COMMENT ON TABLE calificaciones IS 'Calificación 1-5 estrellas que el Cliente da al Repartidor al finalizar el envío (Épica D).';
