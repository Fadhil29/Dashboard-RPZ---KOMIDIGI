import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { HapusPenggunaPage } from '../../../pages/Manajemen-Profile/HapusPenggunaPage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('hapus_pengguna');

// Session dari globalSetup tidak dipakai, login dilakukan di beforeEach
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.isiEmail(process.env.ADMIN_USERNAME);
  await loginPage.isiPassword(process.env.ADMIN_PASSWORD);
  await loginPage.klikMasuk();
});

test('admin bisa menghapus pengguna', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai admin (beforeEach)
    2. Validasi sudah berada di halaman Dashboard
    3. Klik menu Manajemen Pengguna
    4. Validasi halaman Manajemen Pengguna terbuka
    5. Validasi pengguna yang akan dihapus tampil di tabel
    6. Klik button Hapus pada baris pengguna tersebut
    7. Validasi dialog konfirmasi Hapus Pengguna? tampil
    8. Klik button Hapus di dialog
    9. Validasi notifikasi Berhasil tampil
    10. Klik button Mengerti
  */
  const hapusPage = new HapusPenggunaPage(page);

  await expect(hapusPage.judul(data.dashboardTitle)).toBeVisible({ timeout: 15_000 });
  await hapusPage.bukaMenuManajemenPengguna();
  await expect(hapusPage.judul(data.menuTitle)).toBeVisible();
  await expect(hapusPage.barisTabel(data.nama)).toBeVisible();
  await hapusPage.klikHapus(data.nama);
  await expect(hapusPage.judul(data.konfirmasiTitle)).toBeVisible();
  await hapusPage.konfirmasiHapus();
  await expect(hapusPage.judul(data.suksesTitle)).toBeVisible();
  await hapusPage.klikMengerti();
});
