import mysql from 'mysql2/promise';

const config = {
  host: 'localhost',
  user: 'root',
  password: '',
  port: 3306,
  database: 'moviesdb',
};

const connection = await mysql.createConnection(config);

export class MovieModel {
  static async getAll({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase();
      const [genres] = await connection.query(
        'SELECT id,name FROM genre WHERE LOWER(name)=? ',
        [lowerCaseGenre]
      );

      if (genres.length === 0) return [];
      const [{ id }] = genres;
      return [];
    }

    const [movies] = await connection.query(
      'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie;'
    );
    return movies;
  }

  static async getById({ id }) {
    const [movies] = await connection.query(
      'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie WHERE id=UUID_TO_BIN(?)',
      [id]
    );

    if (movies.length === 0) return null;
    return movies[0];
  }

  static async create({ input }) {
    const {
      genre: genreInput,
      title,
      year,
      duration,
      director,
      rate,
      poster,
    } = input;

    const [uuidResult] = await connection.query('SELECT UUID() as uuid');
    const [{ uuid }] = uuidResult;
    try {
      await connection.query(
        `INSERT INTO movie (id,title, year, duration, director, rate, poster) VALUES (UUID_TO_BIN("${uuid}"),?, ?, ?, ?, ?, ?)`,
        [title, year, duration, director, rate, poster]
      );
    } catch (e) {
      throw new Error('Error al insertar la pelicula');
    }
    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie WHERE id=UUID_TO_BIN(?);`,
      [uuid]
    );

    return movies[0];
  }

  static async delete({ id }) {
    try {
      await connection.query('DELETE FROM movie WHERE id=UUID_TO_BIN(?)', [id]);
      return true;
    } catch (e) {
      return false;
    }
  }

  static async update({ id, input }) {
    const {
      genre: genreInput,
      title,
      year,
      duration,
      director,
      rate,
      poster,
    } = input;

    try {
      await connection.query(
        'UPDATE movie SET title=?, year=?, duration=?, director=?, rate=?, poster=? WHERE id=UUID_TO_BIN(?)',
        [title, year, duration, director, rate, poster, id]
      );
    } catch (e) {
      throw new Error('Error al actualizar la pelicula');
    }

    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie WHERE id=UUID_TO_BIN(?);`,
      [id]
    );

    return movies[0];
  }
}
