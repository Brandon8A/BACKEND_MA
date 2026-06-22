# BACKEND_MA
Desarrollo del backend 

## Instrucciones para ejecutar el proyecto
1. Ubicarse en la ruta `BACKEND_MA/backend_ma/` e instalar las dependencias con el siguiente comando:
```bash
npm install
```

2. Ejecutar el proyecto con el siguiente comando:
```bash
npm run start:dev
```

## Ojito aquí
Al trabajar la base de datos de manera local, realizar modificaciones al archivo `.env` sustituyendo la siguiente información:
```
DB_HOST=localhost  
DB_PORT=5432
DB_NAME="nombre de la base de datos como fue registrada en la base de datos local"
DB_USER="Usuario para iniciar sesion en postgres de forma local, por lo normal siemre es 'postgres'"
DB_PASSWORD="Contraseña para iniciar sesion en postgres de forma local"
JWT_SECRET=FlashDelivery2026
```
Los datos van sin comillas dobles, checar el archivo .env original