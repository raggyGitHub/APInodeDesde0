import { readJSON } from './utils.js';
import { randomUUID } from 'node:crypto';

const movies = readJSON('./movies.json');

export class MovieModel {
  static async getAll({ genre }) {
    if (genre) {
      return movies.filter((movie) =>
        movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
      );
    }
    return movies;
  }

  static async getById({ id }) {
    return movies.find((movie) => movie.id === id);
    return movie;
  }

  static async create({ input }) {
    // en base de datos
    const newMovie = {
      id: randomUUID(), // uuid v4
      ...input,
    };

    movies.push(newMovie);
    return newMovie;
  }

  static async delete({ id }) {
    const movieIndex = movies.findIndex((movie) => movie.id === id);
    if (movieIndex === -1) {
      return null;
    }
    movies.splice(movieIndex, 1);
    return true;
  }

  static async update({ id, input }) {
    const movieIndex = movies.findIndex((movie) => movie.id === id);
    if (movieIndex === -1) {
      return null;
    }
    const updatedMovie = {
      ...movies[movieIndex],
      ...input,
    };
    movies[movieIndex] = updatedMovie;
    return updatedMovie;
  }

  static async patch({ id, input }) {}
}
