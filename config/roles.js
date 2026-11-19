// JANGAN DIUBAH. Daftar role dibaca dari ROLES di file .env
import path from 'path';
import './env.js'; // pastikan .env sudah dimuat sebelum ROLES dibaca

export const ROLES = (process.env.ROLES || '')
  .split(',')
  .map((r) => r.trim())
  .filter(Boolean);

// Lokasi file session hasil login tiap role
export const authFile = (role) => path.resolve(__dirname, '..', '.auth', `${role}.json`);
