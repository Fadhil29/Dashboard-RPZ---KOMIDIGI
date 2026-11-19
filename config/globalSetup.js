import fs from 'fs';
import { chromium, expect } from '@playwright/test';
import { ROLES, authFile } from './roles.js';

// Login sekali per role sebelum semua test jalan, session disimpan di folder .auth/
// Kredensial dibaca dari .env: NAMAROLE_USERNAME dan NAMAROLE_PASSWORD
// Pilih role lewat variabel ROLE, misalnya: $env:ROLE="admin"
const dipilih = (process.env.ROLE || '')
  .split(',')
  .map((r) => r.trim())
  .filter(Boolean);

const targetRoles = dipilih.length ? ROLES.filter((r) => dipilih.includes(r)) : ROLES;

export default async function globalSetup() {
  if (ROLES.length === 0) return; // aplikasi tanpa role, tidak perlu login

  if (dipilih.length && targetRoles.length === 0) {
    throw new Error(`ROLE="${process.env.ROLE}" tidak ada di ROLES (${ROLES.join(', ')})`);
  }

  const browser = await chromium.launch();
  try {
    for (const role of targetRoles) {
      const key = role.toUpperCase();
      const username = process.env[`${key}_USERNAME`];
      const password = process.env[`${key}_PASSWORD`];
      if (!username || !password) {
        throw new Error(`Isi ${key}_USERNAME dan ${key}_PASSWORD di file .env`);
      }

      const context = await browser.newContext();
      const page = await context.newPage();
      try {
        // Staging kadang lambat atau halaman login tampil kosong, jadi login dicoba sampai 3 kali
        let galat;
        let berhasil = false;
        for (let percobaan = 1; percobaan <= 3 && !berhasil; percobaan++) {
          try {
            await page.goto(process.env.WEB_URL, { waitUntil: 'domcontentloaded', timeout: 45_000 });

            await page.getByRole('textbox', { name: 'nama@komdigi.go.id' }).fill(username, { timeout: 30_000 });
            await page.locator('input[type="password"]').fill(password);
            await page.getByRole('checkbox', { name: 'Ingat saya' }).check();
            await page.getByRole('button', { name: 'Masuk' }).click();

            // Tunggu redirect selesai ke halaman dashboard, baru simpan session
            await page.waitForURL(/\/dashboard/, { timeout: 30_000 });
            await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible({
              timeout: 30_000,
            });
            await page.waitForLoadState('networkidle');
            berhasil = true;
          } catch (error) {
            // kredensial salah tidak perlu dicoba ulang (bisa mengunci akun)
            if (await page.getByText('Email atau password salah').isVisible().catch(() => false)) {
              throw new Error(
                `Email atau password salah untuk role "${role}". Cek ${key}_USERNAME dan ${key}_PASSWORD di .env, atau akunnya sudah diubah/dihapus di staging.`
              );
            }
            galat = error;
            // jeda bertahap sebelum mencoba lagi agar tidak kena rate limit
            await new Promise((selesai) => setTimeout(selesai, 5_000 * percobaan));
          }
        }
        if (!berhasil) throw galat;

        // Cookie + localStorage + IndexedDB (sesi Firebase disimpan di IndexedDB)
        const state = await context.storageState({ path: authFile(role), indexedDB: true });

        // sessionStorage tidak ikut storageState, simpan terpisah: .auth/<role>.session.json
        const session = await page.evaluate(() => ({
          host: location.hostname,
          items: Object.fromEntries(Object.entries(sessionStorage)),
        }));
        fs.writeFileSync(authFile(role).replace(/\.json$/, '.session.json'), JSON.stringify(session));

        // Log diagnostik (hanya nama key, tanpa nilai)
        console.log(
          `[${role}] cookies=${state.cookies.length}`,
          `localStorage=${state.origins.flatMap((o) => o.localStorage.map((i) => i.name))}`,
          `indexedDB=${state.origins.flatMap((o) => (o.indexedDB ?? []).map((d) => d.name))}`,
          `sessionStorage=${Object.keys(session.items)}`
        );
      } catch (error) {
        await page.screenshot({ path: `test-results/login-gagal-${role}.png` });
        throw new Error(`Login role "${role}" gagal: ${error.message}`);
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
}