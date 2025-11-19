Aquí tienes el **README** EXACTAMENTE con el mismo formato del ejemplo, pero adaptado completamente a tu proyecto **Caprisoft**.
Incluye el título centrado, créditos en línea, overview, instalación y ejecución del backend y frontend y las tecnologías utilizadas.

---

````md
<p align="center">
  <h1 align="center">Caprisoft – Sistema de Gestión de Pedidos Caprinos</h1>
  <p align="center">
  <p align="center">
    <a href="https://github.com/TU_USUARIO" rel="external nofollow noopener" target="_blank"><strong>Brayan Sneider Sánchez</strong></a>
    ·
    <a href="https://github.com/marcosjose03" rel="external nofollow noopener" target="_blank"><strong>Marcos Jose Orjuela</strong></a>
    ·
    <a href="https://github.com/leider777" rel="external nofollow noopener" target="_blank"><strong>Leider Esteban</strong></a>
  </p>
<p align="center">
    Proyecto de Ingeniería de Software II– UIS 2025-2
</p>

## Overview

Caprisoft es un sistema de gestión de pedidos diseñado para optimizar el control de ventas, inventario y estados de pedidos en la producción caprina.  
Su objetivo es reemplazar los métodos manuales utilizados por los productores (papel, notas informales, mensajes) por un sistema centralizado, seguro y fácil de usar.

El sistema ofrece:

- Registro, actualización y cancelación de pedidos.  
- Control del inventario de productos caprinos.  
- Gestión de estados del pedido (pendiente, confirmado, entregado, cancelado).  
- Reportes estadísticos y tablas consolidadas.  
- Módulo de integración con otros sistemas mediante API REST.  
- Autenticación por roles (cliente / administrador).  

Caprisoft está construido con **Spring Boot + Java** en el backend, **React.js** en el frontend y **MySQL** como base de datos.

---

## Tecnologías Utilizadas

### **Frontend**
- React.js  
- JavaScript ES6  
- Context API (Auth / Cart)  
- CSS personalizado  
- Lucide React Icons  

### **Backend**
- Java 17  
- Spring Boot 3  
- Spring Security + JWT  
- JPA / Hibernate  
- Maven  

### **Base de Datos**
- MySQL 8

### **Otros**
- API REST  
- JSON Server para pruebas de integración externa  
- Fetch API  

---

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/TU_REPO/caprisoft
cd caprisoft
````

---

## Backend – Spring Boot

### 1. Configurar base de datos

Crear base de datos:

```sql
CREATE DATABASE caprisoft;
```

Editar `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/caprisoft
spring.datasource.username=TU_USUARIO
spring.datasource.password=TU_PASSWORD

jwt.secret=TU_SECRETO
jwt.expiration=86400000
```

### 2. Ejecutar el backend

```bash
cd backend
./mvnw spring-boot:run      # Linux/Mac
mvnw.cmd spring-boot:run    # Windows
```

El backend arrancará en:

```
http://localhost:8080
```

---

## Frontend – React

### 1. Instalar dependencias

```bash
cd frontend
npm install
```

### 2. Ejecutar frontend

```bash
npm start
```

El frontend abrirá en:

```
http://localhost:3000
```

---

## Integración Externa (Mock Server)

Para probar la integración con otro sistema:

```bash
npm install -g json-server
cd mock
json-server --watch mock.json --port 5000
```

El sistema cargará productos externos desde:

```
http://localhost:5000/products
```

---

## Licencia

Este proyecto es de uso académico para el curso de Ingeniería de Software – UIS 2025-2.
Puedes modificarlo y adaptarlo libremente.

