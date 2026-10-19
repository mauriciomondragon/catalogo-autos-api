// Pruebas básicas de las rutas usando fetch nativo (Node 18+)
const assert = require('assert');
const app = require('./server');

const server = app.listen(0, async () => {
  const base = `http://localhost:${server.address().port}`;
  const get = async (p) => { const r = await fetch(base + p); return { status: r.status, body: await r.json() }; };
  try {
    let r = await get('/');
    assert.strictEqual(r.status, 200);
    r = await get('/api/autos');
    assert.strictEqual(r.body.total, 10);
    for (const k of ['marca', 'modelo', 'anio', 'precio', 'color']) assert.ok(k in r.body.datos[0]);
    r = await get('/api/autos?marca=nissan');
    assert.strictEqual(r.body.total, 2);
    r = await get('/api/autos?color=rojo&precioMax=300000');
    assert.strictEqual(r.body.total, 1);
    r = await get('/api/autos/3');
    assert.strictEqual(r.body.modelo, 'Corolla');
    r = await get('/api/autos/99');
    assert.strictEqual(r.status, 404);
    r = await get('/api/autos?anio=abc');
    assert.strictEqual(r.status, 400);
    r = await get('/api/marcas');
    assert.strictEqual(r.body.total, 9);
    console.log('Todas las pruebas pasaron ✔');
  } catch (e) { console.error(e); process.exitCode = 1; }
  server.close();
});
