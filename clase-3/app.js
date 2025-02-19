const express = require('express'); // require --> comon js
const movies = require('./movies.json');
const crypto = require('node:crypto');

const { title } = require('node:process');
const { validateMovie, validatePartialMovie } = require('./Schema/movies');

const app = express();
app.use(express.json()); //middleware
app.disable('x-powered-by'); //desabilita la cabecera x-powered-by

app.get('/', (req, res) => {
  res.send('Hola mundo');
});

// Todos los recursoos que esten presentes en la ruta /movies
app.get('/movies', (req, res) => {
  const { genre } = req.query;
  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
    return res.json(filteredMovies);
  } else {
    res.json(movies);
  }
});

app.get('/movies/:id', (req, res) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id === id);
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).json({ error: 'Movie not found' });
  }
}); //parametro de la URL

app.get('/movies?genre=terror', (req, res) => {});

//POST
app.post('/movies', (req, res) => {
  const result = validateMovie(req.body);
  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data,
  };
  movies.push(newMovie);
  res.status(201).json(newMovie);
});

//PATCH
app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body);

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);
  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' });
  }
  const updatedMovie = { ...movies[movieIndex], ...result.data };

  movies[movieIndex] = updatedMovie;
  return res.json(updatedMovie);
});

const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
