const http = require('node:http');
const fs = require('node:fs');

const desiredPort = process.env.PORT ?? 1234;

const procesRequest = (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  if (req.url === '/') {
    res.statusCode = 200;
    res.end('Welcome to my home page v1.0');
  } else if (req.url === '/about') {
    res.statusCode = 200;
    res.end('Welcome to my about page -- About us');
  } else if (req.url === '/ToyotaSupra01.jpg') {
    res.statusCode = 200;

    fs.readFile('./ToyotaSupra01.jpg', (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end('File not found');
      } else {
        res.setHeader('Content-Type', 'image/jpeg');
        res.end(data);
      }
    });
  } else {
    res.statusCode = 404;
    res.end('Page not found');
  }
};

const server = http.createServer(procesRequest);

server.listen(desiredPort, () => {
  console.log(`Server listening on port http://localhost:${desiredPort}`);
});
