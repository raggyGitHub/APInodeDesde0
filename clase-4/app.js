import express, { json } from 'express'; // require -> commonJS

import cors from 'cors';

import { moviesRouter } from './routes/movies';
import { corsMiddleware } from './middlewares/cors';

const app = express();
app.use(json());
app.use(corsMiddleware(acceptedOrigins()));
app.disable('x-powered-by'); // deshabilitar el header X-Powered-By: Express

// métodos normales: GET/HEAD/POST
// métodos complejos: PUT/PATCH/DELETE

// CORS PRE-Flight
// OPTIONS

app.use('/movies', moviesRouter);

const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
