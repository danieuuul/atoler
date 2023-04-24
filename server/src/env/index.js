import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  FOLDER_LOGIN: z.string(),
  FOLDER_PWD: z.string(),
  ATOLA_SERVER: z.string(),
  DIRECTORY_TO_WATCH: z.string(),
  IMAGE_RAW_FOLDER: z.string(),
  REGISTER_RAW_FOLDER: z.string(),
  ZIP_PATH: z.string(),
  FSUM_PATH: z.string(),
  SISCRIM_URL: z.string(),
  SISCRIM_USER: z.string(),
  SISCRIM_KEY: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid enviroment variables.', _env.error.format())

  throw new Error('Invalid enviroment variables.')
}

export const env = _env.data
