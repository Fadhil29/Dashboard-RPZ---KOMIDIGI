// Ambil data tes sesuai ENV di .env (data/dev/ atau data/qa/)
// Contoh: const order = getData('order');  -> membaca data/<ENV>/order.json
import fs from 'fs';
import path from 'path';
import './env.js';

export function getData(name) {
  const env = process.env.ENV || 'dev';
  const file = path.resolve(__dirname, '..', 'data', env, `${name}.json`);
  if (!fs.existsSync(file)) throw new Error(`File data tidak ada: data/${env}/${name}.json`);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
