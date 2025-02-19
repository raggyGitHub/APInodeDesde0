const z = require('zod');
const movieSchema = z.object({
  title: z
    .string({
      invalid_type_error: 'El titulo debe ser un string',
      required_error: 'El titulo es requerido',
    })
    .nonempty(),

  year: z.number().int().positive().min(1900).max(2022),
  director: z.string().nonempty(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10),
  poster: z.string().url(),
  genre: z.array(z.enum(['terror', 'comedy', 'action', 'drama', 'sci-fi']), {
    required_error: 'El genero es requerido',
    invalid_type_error: 'El genero debe ser un genero valido',
  }),
});

function validateMovie(object) {
  return movieSchema.safeParse(object);
}

module.exports = { validateMovie };
