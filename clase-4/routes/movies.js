import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { validateMovie, validatePartialMovie } from './schemas/movies.js';
export const moviesRouter = Router();

//como leer json en ESmodules recomendacion
import { createRequire } from 'node:module';
import { MovieModel } from '../models/movie.js';
const require = createRequire(import.meta.url);
const movies = require('./movies.json');

moviesRouter.get('/', async (req, res) => {
  const { genre } = req.query;
  const movies = await MovieModel.getAll({ genre });
  res.json(movies);
});

moviesRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const movie = await MovieModel.getById(id);

  if (movie) return res.json(movie);
  res.status(404).json({ message: 'Movie not found' });
});

moviesRouter.post('/', async (req, res) => {
  const result = validateMovie(req.body);

  if (!result.success) {
    // 422 Unprocessable Entity
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }
  const newMovie = await MovieModel.create({ input: result.data });

  res.status(201).json(newMovie);
});

moviesRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await MovieModel.delete({ id });
  if (result === false) {
    return res.status(404).json({ message: 'Movie not found' });
  }
  return res.json({ message: 'Movie deleted' });
});

moviesRouter.patch('/:id', async (req, res) => {
  const result = validatePartialMovie(req.body);

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const { id } = req.params;
  const updateMovie = await MovieModel.patch({ id, input: result.data });

  return res.json(updateMovie);
});
