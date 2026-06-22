
BEGIN;

-- -----------------------------------------------------------------------------
-- 1. CATÁLOGOS GEOGRAFICOS
-- -----------------------------------------------------------------------------

INSERT INTO departamentos (nombre) VALUES
('Guatemala'),
('Sacatepéquez'),
('Quetzaltenango'),
('Escuintla'),
('Chimaltenango');

INSERT INTO municipios (nombre, departamento_id) VALUES
('Guatemala',           (SELECT departamento_id FROM departamentos WHERE nombre = 'Guatemala')),
('Mixco',               (SELECT departamento_id FROM departamentos WHERE nombre = 'Guatemala')),
('Villa Nueva',         (SELECT departamento_id FROM departamentos WHERE nombre = 'Guatemala')),
('Santa Catarina Pinula',(SELECT departamento_id FROM departamentos WHERE nombre = 'Guatemala')),
('Antigua Guatemala',   (SELECT departamento_id FROM departamentos WHERE nombre = 'Sacatepéquez')),
('Quetzaltenango',      (SELECT departamento_id FROM departamentos WHERE nombre = 'Quetzaltenango')),
('Escuintla',           (SELECT departamento_id FROM departamentos WHERE nombre = 'Escuintla')),
('Chimaltenango',       (SELECT departamento_id FROM departamentos WHERE nombre = 'Chimaltenango'));

INSERT INTO zonas (nombre, municipio_id) VALUES
('Zona 1',  (SELECT municipio_id FROM municipios WHERE nombre = 'Guatemala')),
('Zona 4',  (SELECT municipio_id FROM municipios WHERE nombre = 'Guatemala')),
('Zona 7',  (SELECT municipio_id FROM municipios WHERE nombre = 'Guatemala')),
('Zona 9',  (SELECT municipio_id FROM municipios WHERE nombre = 'Guatemala')),
('Zona 10', (SELECT municipio_id FROM municipios WHERE nombre = 'Guatemala')),
('Zona 11', (SELECT municipio_id FROM municipios WHERE nombre = 'Guatemala')),
('Zona 13', (SELECT municipio_id FROM municipios WHERE nombre = 'Guatemala')),
('Zona 15', (SELECT municipio_id FROM municipios WHERE nombre = 'Guatemala')),
('Zona 16', (SELECT municipio_id FROM municipios WHERE nombre = 'Guatemala')),
('Zona 18', (SELECT municipio_id FROM municipios WHERE nombre = 'Guatemala')),
('Zona 1',  (SELECT municipio_id FROM municipios WHERE nombre = 'Mixco')),
('Zona 4',  (SELECT municipio_id FROM municipios WHERE nombre = 'Mixco'));

-- -----------------------------------------------------------------------------
-- 2. CATALOGOS DE NEGOCIO
-- -----------------------------------------------------------------------------

INSERT INTO roles (nombre_rol) VALUES
('Cliente'),
('Repartidor');

INSERT INTO tipos_vehiculo (nombre) VALUES
('Moto'),
('Bicicleta'),
('Carro'),
('A pie'),
('Camioneta');

INSERT INTO estados_envio (nombre, orden_flujo) VALUES
('Pendiente',  1),
('Aceptado',   2),
('En_Camino',  3),
('Entregado',  4),
('Cancelado',  5);

INSERT INTO metodos_pago (nombre) VALUES
('Efectivo'),
('Tarjeta'),
('Transferencia');

-- -----------------------------------------------------------------------------
-- 3. USUARIOS
--    password_hash bcrypt
--    Contraseña de prueba para todos: "1234"
-- -----------------------------------------------------------------------------

INSERT INTO usuarios (nombres, apellidos, email, password_hash, telefono, dpi, foto_url, fecha_nacimiento) VALUES
('María Fernanda',  'López Castillo',   'maria.lopez@gmail.com',     '$2a$12$Io3gNY2wTTJ5X0U.FZQXbuGNaABZcQNv1I.w8pomO8gYRfn4bW/DK', '55123456', '2589631470101', 'https://i.pravatar.cc/150?img=1', '1995-03-12'),
('Carlos Eduardo',  'Méndez Ramírez',   'carlos.mendez@gmail.com',   '$2a$12$Io3gNY2wTTJ5X0U.FZQXbuGNaABZcQNv1I.w8pomO8gYRfn4bW/DK', '41234567', '2589631470102', 'https://i.pravatar.cc/150?img=2', '1990-07-25'),
('Ana Lucía',       'Pérez Gómez',      'ana.perez@gmail.com',       '$2a$12$Io3gNY2wTTJ5X0U.FZQXbuGNaABZcQNv1I.w8pomO8gYRfn4bW/DK', '32145678', '2589631470103', 'https://i.pravatar.cc/150?img=3', '1998-11-02'),
('Brenda Lissette',  'Morales Aguilar', 'brenda.morales@gmail.com',  '$2a$12$Io3gNY2wTTJ5X0U.FZQXbuGNaABZcQNv1I.w8pomO8gYRfn4bW/DK', '40123456', '2589631470104', 'https://i.pravatar.cc/150?img=4', '1993-05-18'),
('Sofía Alejandra',  'Barrios Ixchop',  'sofia.barrios@gmail.com',   '$2a$12$Io3gNY2wTTJ5X0U.FZQXbuGNaABZcQNv1I.w8pomO8gYRfn4bW/DK', '31122334', '2589631470105', 'https://i.pravatar.cc/150?img=5', '1999-01-30'),
('José Manuel',      'García Solís',    'jose.garcia@flashdelivery.gt','$2a$12$Io3gNY2wTTJ5X0U.FZQXbuGNaABZcQNv1I.w8pomO8gYRfn4bW/DK', '55667788', '2589631470106', 'https://i.pravatar.cc/150?img=6', '1992-09-09'),
('Luis Fernando',    'Hernández Cux',   'luis.hernandez@flashdelivery.gt','$2a$12$Io3gNY2wTTJ5X0U.FZQXbuGNaABZcQNv1I.w8pomO8gYRfn4bW/DK', '41789012', '2589631470107', 'https://i.pravatar.cc/150?img=7', '1996-04-21'),
('Pedro Antonio',    'Xicará Tzul',     'pedro.xicara@flashdelivery.gt','$2a$12$Io3gNY2wTTJ5X0U.FZQXbuGNaABZcQNv1I.w8pomO8gYRfn4bW/DK', '32567890', '2589631470108', 'https://i.pravatar.cc/150?img=8', '1991-12-14'),
('Diego Alejandro',  'Recinos Paz',     'diego.recinos@flashdelivery.gt','$2a$12$Io3gNY2wTTJ5X0U.FZQXbuGNaABZcQNv1I.w8pomO8gYRfn4bW/DK', '40998877', '2589631470109', 'https://i.pravatar.cc/150?img=9', '1997-06-08');

-- -----------------------------------------------------------------------------
-- 4. ASIGNACIÓN DE ROLES
-- -----------------------------------------------------------------------------

INSERT INTO usuario_roles (usuario_id, rol_id)
SELECT u.usuario_id, r.rol_id
FROM usuarios u, roles r
WHERE (u.email, r.nombre_rol) IN (
    ('maria.lopez@gmail.com',            'Cliente'),
    ('carlos.mendez@gmail.com',          'Cliente'),
    ('ana.perez@gmail.com',              'Cliente'),
    ('brenda.morales@gmail.com',         'Cliente'),
    ('sofia.barrios@gmail.com',          'Cliente'),
    ('jose.garcia@flashdelivery.gt',     'Repartidor'),
    ('luis.hernandez@flashdelivery.gt',  'Repartidor'),
    ('pedro.xicara@flashdelivery.gt',    'Repartidor'),
    ('diego.recinos@flashdelivery.gt',   'Repartidor')
);

-- -----------------------------------------------------------------------------
-- 5. PERFILES DE REPARTIDOR (vehículo)
-- -----------------------------------------------------------------------------

INSERT INTO perfiles_repartidor (usuario_id, tipo_vehiculo_id, placa, marca, modelo, color, disponible)
SELECT u.usuario_id, tv.tipo_vehiculo_id, datos.placa, datos.marca, datos.modelo, datos.color, TRUE
FROM (VALUES
    ('jose.garcia@flashdelivery.gt',    'Moto',      'P-145BCD', 'Yamaha',   'FZ 150',  'Rojo'),
    ('luis.hernandez@flashdelivery.gt', 'Moto',      'P-203XYZ', 'Honda',    'CB 125',  'Negro'),
    ('pedro.xicara@flashdelivery.gt',   'Bicicleta', NULL,        'Trek',     'FX 2',    'Azul'),
    ('diego.recinos@flashdelivery.gt',  'Carro',     'C-456EFG', 'Toyota',   'Yaris',   'Blanco')
) AS datos(email, vehiculo, placa, marca, modelo, color)
JOIN usuarios u ON u.email = datos.email
JOIN tipos_vehiculo tv ON tv.nombre = datos.vehiculo;

-- -----------------------------------------------------------------------------
-- 6. DIRECCIONES
-- -----------------------------------------------------------------------------

INSERT INTO direcciones (municipio_id, zona_id, direccion_linea, referencia, latitud, longitud) VALUES
((SELECT municipio_id FROM municipios WHERE nombre='Guatemala'), (SELECT zona_id FROM zonas WHERE nombre='Zona 10' AND municipio_id=(SELECT municipio_id FROM municipios WHERE nombre='Guatemala')), '5ta Avenida 12-45',          'Frente a Tikal Futura',              14.5970, -90.5050),
((SELECT municipio_id FROM municipios WHERE nombre='Guatemala'), (SELECT zona_id FROM zonas WHERE nombre='Zona 7'  AND municipio_id=(SELECT municipio_id FROM municipios WHERE nombre='Guatemala')), 'Calzada Roosevelt 22-15',    'Cerca de Plaza Roosevelt',           14.6210, -90.5500),
((SELECT municipio_id FROM municipios WHERE nombre='Guatemala'), (SELECT zona_id FROM zonas WHERE nombre='Zona 1'  AND municipio_id=(SELECT municipio_id FROM municipios WHERE nombre='Guatemala')), '12 Calle 3-45',              'Centro Histórico, cerca del Parque Central', 14.6420, -90.5130),
((SELECT municipio_id FROM municipios WHERE nombre='Guatemala'), (SELECT zona_id FROM zonas WHERE nombre='Zona 10' AND municipio_id=(SELECT municipio_id FROM municipios WHERE nombre='Guatemala')), 'Boulevard Los Próceres 18-31','Frente a Oakland Mall',              14.6010, -90.4990),
((SELECT municipio_id FROM municipios WHERE nombre='Guatemala'), (SELECT zona_id FROM zonas WHERE nombre='Zona 9'  AND municipio_id=(SELECT municipio_id FROM municipios WHERE nombre='Guatemala')), 'Diagonal 6, 10-25',          'Cerca del Obelisco',                 14.5930, -90.5110),
((SELECT municipio_id FROM municipios WHERE nombre='Mixco'),    (SELECT zona_id FROM zonas WHERE nombre='Zona 4'  AND municipio_id=(SELECT municipio_id FROM municipios WHERE nombre='Mixco')),    '3ra Calle 5-20',            'Frente a Plaza Express',             14.6330, -90.6060),
((SELECT municipio_id FROM municipios WHERE nombre='Villa Nueva'), NULL,                                                                                                       'Colonia El Frutal, 4-12',   'A dos cuadras del mercado',          14.5260, -90.5870),
((SELECT municipio_id FROM municipios WHERE nombre='Antigua Guatemala'), NULL,                                                                                                 '3ra Avenida Norte 6-50',    'Cerca del Arco de Santa Catalina',   14.5570, -90.7340),
((SELECT municipio_id FROM municipios WHERE nombre='Guatemala'), (SELECT zona_id FROM zonas WHERE nombre='Zona 13' AND municipio_id=(SELECT municipio_id FROM municipios WHERE nombre='Guatemala')), 'Avenida Hincapié 22-50',   'Cerca del Aeropuerto La Aurora',     14.5830, -90.5270),
((SELECT municipio_id FROM municipios WHERE nombre='Santa Catarina Pinula'), NULL,                                                                                              'Km 14.5 Carretera a El Salvador', 'Frente a Pradera Concepción',  14.5650, -90.4750);

-- -----------------------------------------------------------------------------
-- 7. ENVÍOS
--    Se insertan inicialmente en 'Pendiente' y luego se actualizan para
--    simular el flujo real (esto hace que los triggers generen el
--    historial de estados automáticamente, igual que en el Kanban).
-- -----------------------------------------------------------------------------

-- Envío 1: Pendiente, sin repartidor aún
INSERT INTO envios (cliente_id, direccion_origen_id, direccion_destino_id, descripcion_paquete, precio_sugerido, distancia_km, metodo_pago_id, estado_id)
VALUES (
    (SELECT usuario_id FROM usuarios WHERE email='maria.lopez@gmail.com'),
    (SELECT direccion_id FROM direcciones WHERE direccion_linea='5ta Avenida 12-45'),
    (SELECT direccion_id FROM direcciones WHERE direccion_linea='12 Calle 3-45'),
    'Documentos legales en sobre manila',
    25.00, 4.50,
    (SELECT metodo_pago_id FROM metodos_pago WHERE nombre='Efectivo'),
    (SELECT estado_id FROM estados_envio WHERE nombre='Pendiente')
);

-- Envío 2: Pendiente
INSERT INTO envios (cliente_id, direccion_origen_id, direccion_destino_id, descripcion_paquete, precio_sugerido, distancia_km, metodo_pago_id, estado_id)
VALUES (
    (SELECT usuario_id FROM usuarios WHERE email='carlos.mendez@gmail.com'),
    (SELECT direccion_id FROM direcciones WHERE direccion_linea='Calzada Roosevelt 22-15'),
    (SELECT direccion_id FROM direcciones WHERE direccion_linea='3ra Calle 5-20'),
    'Caja pequeña con repuestos de celular',
    40.00, 7.20,
    (SELECT metodo_pago_id FROM metodos_pago WHERE nombre='Tarjeta'),
    (SELECT estado_id FROM estados_envio WHERE nombre='Pendiente')
);

-- Envío 3: comienza Pendiente y se actualiza a Aceptado (simula el "match")
INSERT INTO envios (cliente_id, direccion_origen_id, direccion_destino_id, descripcion_paquete, precio_sugerido, distancia_km, metodo_pago_id, estado_id)
VALUES (
    (SELECT usuario_id FROM usuarios WHERE email='ana.perez@gmail.com'),
    (SELECT direccion_id FROM direcciones WHERE direccion_linea='Boulevard Los Próceres 18-31'),
    (SELECT direccion_id FROM direcciones WHERE direccion_linea='Diagonal 6, 10-25'),
    'Pastel de cumpleaños (frágil)',
    20.00, 3.10,
    (SELECT metodo_pago_id FROM metodos_pago WHERE nombre='Efectivo'),
    (SELECT estado_id FROM estados_envio WHERE nombre='Pendiente')
);

UPDATE envios
SET repartidor_id = (SELECT usuario_id FROM usuarios WHERE email='jose.garcia@flashdelivery.gt'),
    estado_id = (SELECT estado_id FROM estados_envio WHERE nombre='Aceptado'),
    fecha_aceptacion = now()
WHERE descripcion_paquete = 'Pastel de cumpleaños (frágil)';

-- Envío 4: progresa Pendiente -> Aceptado -> En_Camino (flujo completo simulado)
INSERT INTO envios (cliente_id, direccion_origen_id, direccion_destino_id, descripcion_paquete, precio_sugerido, distancia_km, metodo_pago_id, estado_id)
VALUES (
    (SELECT usuario_id FROM usuarios WHERE email='brenda.morales@gmail.com'),
    (SELECT direccion_id FROM direcciones WHERE direccion_linea='Avenida Hincapié 22-50'),
    (SELECT direccion_id FROM direcciones WHERE direccion_linea='Km 14.5 Carretera a El Salvador'),
    'Laptop usada embalada',
    55.00, 9.80,
    (SELECT metodo_pago_id FROM metodos_pago WHERE nombre='Transferencia'),
    (SELECT estado_id FROM estados_envio WHERE nombre='Pendiente')
);

UPDATE envios
SET repartidor_id = (SELECT usuario_id FROM usuarios WHERE email='luis.hernandez@flashdelivery.gt'),
    estado_id = (SELECT estado_id FROM estados_envio WHERE nombre='Aceptado'),
    fecha_aceptacion = now()
WHERE descripcion_paquete = 'Laptop usada embalada';

UPDATE envios
SET estado_id = (SELECT estado_id FROM estados_envio WHERE nombre='En_Camino')
WHERE descripcion_paquete = 'Laptop usada embalada';

-- Envío 5: flujo completo hasta Entregado (para poder calificarlo)
INSERT INTO envios (cliente_id, direccion_origen_id, direccion_destino_id, descripcion_paquete, precio_sugerido, distancia_km, metodo_pago_id, estado_id)
VALUES (
    (SELECT usuario_id FROM usuarios WHERE email='sofia.barrios@gmail.com'),
    (SELECT direccion_id FROM direcciones WHERE direccion_linea='3ra Avenida Norte 6-50'),
    (SELECT direccion_id FROM direcciones WHERE direccion_linea='Colonia El Frutal, 4-12'),
    'Regalo de cumpleaños - caja mediana',
    35.00, 6.40,
    (SELECT metodo_pago_id FROM metodos_pago WHERE nombre='Efectivo'),
    (SELECT estado_id FROM estados_envio WHERE nombre='Pendiente')
);

UPDATE envios
SET repartidor_id = (SELECT usuario_id FROM usuarios WHERE email='pedro.xicara@flashdelivery.gt'),
    estado_id = (SELECT estado_id FROM estados_envio WHERE nombre='Aceptado'),
    fecha_aceptacion = now() - interval '2 hours'
WHERE descripcion_paquete = 'Regalo de cumpleaños - caja mediana';

UPDATE envios
SET estado_id = (SELECT estado_id FROM estados_envio WHERE nombre='En_Camino')
WHERE descripcion_paquete = 'Regalo de cumpleaños - caja mediana';

UPDATE envios
SET estado_id = (SELECT estado_id FROM estados_envio WHERE nombre='Entregado'),
    fecha_entrega = now() - interval '30 minutes'
WHERE descripcion_paquete = 'Regalo de cumpleaños - caja mediana';

-- Envío 6: flujo completo hasta Entregado (segundo caso para calificar)
INSERT INTO envios (cliente_id, direccion_origen_id, direccion_destino_id, descripcion_paquete, precio_sugerido, distancia_km, metodo_pago_id, estado_id)
VALUES (
    (SELECT usuario_id FROM usuarios WHERE email='maria.lopez@gmail.com'),
    (SELECT direccion_id FROM direcciones WHERE direccion_linea='12 Calle 3-45'),
    (SELECT direccion_id FROM direcciones WHERE direccion_linea='3ra Calle 5-20'),
    'Comida para evento (contenedores térmicos)',
    65.00, 12.00,
    (SELECT metodo_pago_id FROM metodos_pago WHERE nombre='Tarjeta'),
    (SELECT estado_id FROM estados_envio WHERE nombre='Pendiente')
);

UPDATE envios
SET repartidor_id = (SELECT usuario_id FROM usuarios WHERE email='diego.recinos@flashdelivery.gt'),
    estado_id = (SELECT estado_id FROM estados_envio WHERE nombre='Aceptado'),
    fecha_aceptacion = now() - interval '5 hours'
WHERE descripcion_paquete = 'Comida para evento (contenedores térmicos)';

UPDATE envios
SET estado_id = (SELECT estado_id FROM estados_envio WHERE nombre='En_Camino')
WHERE descripcion_paquete = 'Comida para evento (contenedores térmicos)';

UPDATE envios
SET estado_id = (SELECT estado_id FROM estados_envio WHERE nombre='Entregado'),
    fecha_entrega = now() - interval '3 hours'
WHERE descripcion_paquete = 'Comida para evento (contenedores térmicos)';

-- Envío 7: Cancelado
INSERT INTO envios (cliente_id, direccion_origen_id, direccion_destino_id, descripcion_paquete, precio_sugerido, distancia_km, metodo_pago_id, estado_id)
VALUES (
    (SELECT usuario_id FROM usuarios WHERE email='ana.perez@gmail.com'),
    (SELECT direccion_id FROM direcciones WHERE direccion_linea='Diagonal 6, 10-25'),
    (SELECT direccion_id FROM direcciones WHERE direccion_linea='5ta Avenida 12-45'),
    'Paquete de ropa',
    15.00, 2.50,
    (SELECT metodo_pago_id FROM metodos_pago WHERE nombre='Efectivo'),
    (SELECT estado_id FROM estados_envio WHERE nombre='Pendiente')
);

UPDATE envios
SET estado_id = (SELECT estado_id FROM estados_envio WHERE nombre='Cancelado')
WHERE descripcion_paquete = 'Paquete de ropa';

-- Envío 8: Pendiente (otra solicitud abierta)
INSERT INTO envios (cliente_id, direccion_origen_id, direccion_destino_id, descripcion_paquete, precio_sugerido, distancia_km, metodo_pago_id, estado_id)
VALUES (
    (SELECT usuario_id FROM usuarios WHERE email='brenda.morales@gmail.com'),
    (SELECT direccion_id FROM direcciones WHERE direccion_linea='Km 14.5 Carretera a El Salvador'),
    (SELECT direccion_id FROM direcciones WHERE direccion_linea='Avenida Hincapié 22-50'),
    'Medicamentos de farmacia',
    30.00, 5.90,
    (SELECT metodo_pago_id FROM metodos_pago WHERE nombre='Efectivo'),
    (SELECT estado_id FROM estados_envio WHERE nombre='Pendiente')
);

-- -----------------------------------------------------------------------------
-- 8. CALIFICACIONES (solo posibles sobre envíos en estado 'Entregado')
-- -----------------------------------------------------------------------------

INSERT INTO calificaciones (envio_id, cliente_id, repartidor_id, puntuacion, comentario)
SELECT en.envio_id, en.cliente_id, en.repartidor_id, 5,
       'Excelente servicio, llegó antes de lo esperado.'
FROM envios en
WHERE en.descripcion_paquete = 'Regalo de cumpleaños - caja mediana';

INSERT INTO calificaciones (envio_id, cliente_id, repartidor_id, puntuacion, comentario)
SELECT en.envio_id, en.cliente_id, en.repartidor_id, 4,
       'Buen servicio, aunque tardó un poco más de lo previsto.'
FROM envios en
WHERE en.descripcion_paquete = 'Comida para evento (contenedores térmicos)';

COMMIT;

