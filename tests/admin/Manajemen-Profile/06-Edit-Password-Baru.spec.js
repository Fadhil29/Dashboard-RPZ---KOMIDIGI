import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { EditPasswordBaruPage } from '../../../pages/Manajemen-Profile/EditPasswordBaruPage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Edit-Password-Baru');

// Session dari globalSetup tidak dipakai, login dilakukan di beforeEach
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.isiEmail(process.env.ADMIN_USERNAME);
  await loginPage.isiPassword(process.env.ADMIN_PASSWORD);
  await loginPage.klikMasuk();
});

test('admin bisa mengubah password pengguna dan pengguna bisa login dengan password baru', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai admin (beforeEach)
    2. Validasi sudah berada di halaman Dashboard
    3. Klik menu Manajemen Pengguna
    4. Validasi halaman Manajemen Pengguna terbuka
    5. Klik button Edit pada baris pengguna yang akan diubah
    6. Validasi form Edit Pengguna tampil
    7. Isi Password Baru dan Konfirmasi Password Baru
    8. Validasi kedua kolom password terisi
    9. Klik button Simpan
    10. Validasi dialog konfirmasi Simpan Perubahan? tampil
    11. Klik button Simpan di dialog
    12. Validasi notifikasi Berhasil tampil
    13. Klik button Mengerti
    14. Klik button Keluar
    15. Validasi dialog Konfirmasi Keluar tampil
    16. Klik button Keluar di dialog
    17. Login dengan email pengguna dan password baru
    18. Validasi sudah berada di halaman Dashboard
  */
  const loginPage = new LoginPage(page);
  const editPage = new EditPasswordBaruPage(page);

  await expect(editPage.judul(data.dashboardTitle)).toBeVisible({ timeout: 15_000 });
  await editPage.bukaMenuManajemenPengguna();
  await expect(editPage.judul(data.menuTitle)).toBeVisible();
  await editPage.klikEdit(data.nama);
  await expect(editPage.judul(data.editTitle)).toBeVisible();
  await editPage.isiPasswordBaru(data.passwordBaru);
  await expect(editPage.kolomPasswordBaru()).toHaveValue(data.passwordBaru);
  await expect(editPage.kolomKonfirmasiPassword()).toHaveValue(data.passwordBaru);
  await editPage.klikSimpan();
  await expect(editPage.judul(data.konfirmasiTitle)).toBeVisible();
  await editPage.konfirmasiSimpan();
  await expect(editPage.judul(data.suksesTitle)).toBeVisible();
  await editPage.klikMengerti();

  await editPage.klikKeluar();
  await expect(editPage.judul(data.keluarTitle)).toBeVisible();
  await editPage.konfirmasiKeluar();

  await loginPage.isiEmail(data.email);
  await loginPage.isiPassword(data.passwordBaru);
  await loginPage.klikMasuk();
  await expect(editPage.judul(data.dashboardTitle)).toBeVisible({ timeout: 15_000 });
});