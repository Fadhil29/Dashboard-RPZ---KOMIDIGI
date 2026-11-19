import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { UpdateNamaProfilPage } from '../../../pages/Profile/UpdateNamaProfilPage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Update-Nama-Profil');

// Session dari globalSetup tidak dipakai, login dilakukan di beforeEach
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.isiEmail(process.env.ADMIN_USERNAME);
  await loginPage.isiPassword(process.env.ADMIN_PASSWORD);
  await loginPage.klikMasuk();
});

test('admin bisa mengubah nama di halaman profil', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai admin (beforeEach)
    2. Validasi sudah berada di halaman Dashboard
    3. Klik link Profil
    4. Validasi halaman Profil Pengguna terbuka
    5. Ganti isi kolom nama dengan nama baru
    6. Validasi kolom nama berisi nama baru
    7. Klik button Simpan
    8. Validasi notifikasi Berhasil tampil
    9. Klik button Mengerti
    10. Buka ulang halaman profil
    11. Validasi kolom nama tetap berisi nama baru
  */
  const profilPage = new UpdateNamaProfilPage(page);

  await expect(profilPage.judul(data.dashboardTitle)).toBeVisible({ timeout: 15_000 });
  await profilPage.bukaProfil();
  await expect(profilPage.judul(data.profilTitle)).toBeVisible();
  await profilPage.ubahNama(data.namaBaru);
  await expect(profilPage.kolomNama()).toHaveValue(data.namaBaru);
  await profilPage.klikSimpan();
  await expect(profilPage.judul(data.suksesTitle)).toBeVisible();
  await profilPage.klikMengerti();

  await profilPage.muatUlangProfil();
  await expect(profilPage.kolomNama()).toHaveValue(data.namaBaru);
});