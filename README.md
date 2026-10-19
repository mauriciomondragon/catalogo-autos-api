# Catálogo de autos API

Microservicio web REST desarrollado con **Node.js** y **Express** que recupera un catálogo básico de autos con los atributos: **marca, modelo, año, precio y color**.

## Ejecución local

```bash
npm install
npm start        # http://localhost:3000
npm test         # pruebas de las rutas
```

## Despliegue en Render

- Runtime: Node
- Build command: `npm install`
- Start command: `node server.js`
- Plan: Free

## Rutas

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Información del servicio y rutas disponibles |
| GET | `/api/health` | Estado del servicio |
| GET | `/api/autos` | Catálogo completo |
| GET | `/api/autos?marca=&modelo=&anio=&color=&precioMin=&precioMax=` | Catálogo filtrado (parámetros opcionales) |
| GET | `/api/autos/:id` | Detalle de un auto por id |
| GET | `/api/marcas` | Marcas disponibles |

### Ejemplo de respuesta `GET /api/autos/3`

```json
{ "id": 3, "marca": "Toyota", "modelo": "Corolla", "anio": 2024, "precio": 459900, "color": "Plata" }
```

Códigos de estado: `200` éxito, `400` parámetro inválido, `404` recurso no encontrado.

Autor: Mauricio Israel Mondragón Chávez
