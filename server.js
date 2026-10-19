/**
 * Microservicio web: Catálogo básico de autos
 * Autor: Mauricio Israel Mondragón Chávez
 * Tecnologías: Node.js + Express
 *
 * Expone una API REST de solo lectura que devuelve autos con los atributos:
 * marca, modelo, año (anio), precio y color.
 */
const express = require('express');
const cors = require('cors');
const autos = require('./data/autos.json');

const app = express();
const PORT = process.env.PORT || 3000; // Render asigna el puerto con la variable PORT

app.use(cors());          // Permite el consumo desde apps web y móviles de otros dominios
app.use(express.json());

// Normaliza texto para comparar sin importar mayúsculas ni acentos
const normalizar = (txt) =>
  String(txt).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

// GET / -> información general y lista de rutas disponibles
app.get('/', (req, res) => {
  res.json({
    servicio: 'Catálogo de autos API',
    version: '1.0.0',
    descripcion: 'Microservicio que recupera un catálogo básico de autos.',
    rutas: {
      'GET /': 'Información del servicio y rutas disponibles',
      'GET /api/health': 'Estado del servicio',
      'GET /api/autos': 'Lista completa del catálogo (filtros opcionales: marca, modelo, anio, color, precioMin, precioMax)',
      'GET /api/autos/:id': 'Detalle de un auto por su identificador',
      'GET /api/marcas': 'Lista de marcas disponibles en el catálogo'
    }
  });
});

// GET /api/health -> verificación de que el servicio está activo
app.get('/api/health', (req, res) => {
  res.json({ estado: 'ok', timestamp: new Date().toISOString() });
});

// GET /api/autos -> catálogo completo con filtros opcionales por query string
app.get('/api/autos', (req, res) => {
  const { marca, modelo, anio, color, precioMin, precioMax } = req.query;

  for (const [nombre, valor] of Object.entries({ anio, precioMin, precioMax })) {
    if (valor !== undefined && Number.isNaN(Number(valor))) {
      return res.status(400).json({ error: `El parámetro '${nombre}' debe ser numérico.` });
    }
  }

  let resultado = autos;
  if (marca) resultado = resultado.filter((a) => normalizar(a.marca) === normalizar(marca));
  if (modelo) resultado = resultado.filter((a) => normalizar(a.modelo).includes(normalizar(modelo)));
  if (anio) resultado = resultado.filter((a) => a.anio === Number(anio));
  if (color) resultado = resultado.filter((a) => normalizar(a.color) === normalizar(color));
  if (precioMin) resultado = resultado.filter((a) => a.precio >= Number(precioMin));
  if (precioMax) resultado = resultado.filter((a) => a.precio <= Number(precioMax));

  res.json({ total: resultado.length, datos: resultado });
});

// GET /api/autos/:id -> un auto específico
app.get('/api/autos/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'El id debe ser un número entero.' });
  }
  const auto = autos.find((a) => a.id === id);
  if (!auto) {
    return res.status(404).json({ error: `No existe un auto con id ${id}.` });
  }
  res.json(auto);
});

// GET /api/marcas -> marcas únicas del catálogo
app.get('/api/marcas', (req, res) => {
  const marcas = [...new Set(autos.map((a) => a.marca))].sort();
  res.json({ total: marcas.length, datos: marcas });
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada. Consulta GET / para ver las rutas disponibles.' });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Catálogo de autos API escuchando en el puerto ${PORT}`));
}

module.exports = app;
