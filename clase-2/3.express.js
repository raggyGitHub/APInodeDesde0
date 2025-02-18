const express = require('express');

const ditto = require('./pokemon/ditto.json');
const PORT = process.env.PORT ?? 1234;

const app = express();
app.disable('x-powered-by');

app.use((req, res, next) => {
  console.log('mi primer middleware');
  if (req.method !== 'POST') return next();
  if (req.headers['content-type'] !== 'application/json') return next();
  //solo llegan request que sean POST y que tengan content-type application/json
  let body = '';
  // escuchar el evento data
  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    const data = JSON.parse(body);
    // llamar a una base de datos para guardar la info
    data.timestamp = Date.now();
    req.body = data;
    next();
  });
});

app.get('/', (req, res) => {
  res.json(ditto);
});

app.post('/pokemon', (req, res) => {
  res.status(201).json(req.body); // req.body deberiamos guardar en una base de datos
});

app.get('/pokemon/ditto', (req, res) => {
  res.json(ditto);
});

app.use((req, res) => {
  res.status(404).send('<h1>Not Found 404</h1>');
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
