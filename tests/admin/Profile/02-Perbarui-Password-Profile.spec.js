import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { UbahPasswordProfilPage } from '../../../pages/Profile/UbahPasswordProfilPage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Perbarui-Password-Profile');

// Session dari globalSetup tidak dipakai, login dilakukan di beforeEach
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.isiEmail(process.env.ADMIN_USERNAME);
  await loginPage.isiPassword(process.env.ADMIN_PASSWORD);
  await loginPage.klikMasuk();
});

test('admin bisa memperbarui password di halaman profil', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai admin (beforeEach)
    2. Validasi sudah berada di halaman Dashboard
    3. Klik link Profil
    4. Validasi halaman Profil Pengguna dan bagian Ubah Password tampil
    5. Isi password saat ini, password baru, dan konfirmasi password
    6. Klik button Perbarui Password
    7. Validasi notifikasi Password Diperbarui tampil
    8. Klik button Masuk Kembali
    9. Login ulang dengan password baru
    10. Validasi sudah berada di halaman Dashboard
  */
  const passwordPage = new UbahPasswordProfilPage(page);
  const loginPage = new LoginPage(page);

  await expect(passwordPage.judul(data.dashboardTitle)).toBeVisible({ timeout: 15_000 });
  await passwordPage.bukaProfil();
  await expect(passwordPage.judul(data.profilTitle)).toBeVisible();
  await passwordPage.isiPasswordSaatIni(data.currentPassword);
  await passwordPage.isiPasswordBaru(data.newPassword);
  await passwordPage.isiKonfirmasiPassword(data.confirmPassword);
  await passwordPage.klikPerbaruiPassword();
  await expect(passwordPage.judul(data.suksesTitle)).toBeVisible();
  await passwordPage.klikMasukKembali();

  await loginPage.isiEmail(process.env.ADMIN_USERNAME);
  await loginPage.isiPassword(data.newPassword);
  await loginPage.klikMasuk();
  await expect(passwordPage.judul(data.dashboardTitle)).toBeVisible({ timeout: 15_000 });
});