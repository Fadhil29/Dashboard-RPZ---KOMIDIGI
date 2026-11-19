// JANGAN DIUBAH. Memuat .env, lalu .env.<ENV> kalau ENV diisi (contoh ENV=qa -> .env.qa)
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

if (process.env.ENV) {
  dotenv.config({
    path: path.resolve(__dirname, '..', `.env.${process.env.ENV}`),
    override: true,
  });
}
