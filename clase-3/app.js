const express = require('express'); // require --> comon js

const app = express();
app.disable('x-powered-by'); //desabilita la cabecera x-powered-by

app.get('/', (req, res) => {
  res.send('Hola mundo');
});

const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
