import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { EditEmailGuestPage } from '../../../pages/Manajemen-Profile/EditEmailGuestPage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Edit-Email-Guest');

// Session dari globalSetup tidak dipakai, login dilakukan di beforeEach
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.isiEmail(process.env.ADMIN_USERNAME);
  await loginPage.isiPassword(process.env.ADMIN_PASSWORD);
  await loginPage.klikMasuk();
});

test('admin bisa mengedit email pengguna guest', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai admin (beforeEach)
    2. Validasi sudah berada di halaman Dashboard
    3. Klik menu Manajemen Pengguna
    4. Validasi halaman Manajemen Pengguna terbuka
    5. Validasi pengguna yang akan diedit tampil di tabel dengan email lama
    6. Klik button Edit pada baris pengguna tersebut
    7. Validasi form Edit Pengguna tampil dan email lama sudah terisi
    8. Klik kolom email, ganti dengan email baru
    9. Validasi kolom email berisi email baru
    10. Klik button Simpan
    11. Validasi dialog konfirmasi Simpan Perubahan? tampil
    12. Klik button Simpan di dialog
    13. Validasi notifikasi Berhasil tampil
    14. Klik button Mengerti
    15. Validasi baris pengguna menampilkan email baru
  */
  const editPage = new EditEmailGuestPage(page);

  await expect(editPage.judul(data.dashboardTitle)).toBeVisible({ timeout: 15_000 });
  await editPage.bukaMenuManajemenPengguna();
  await expect(editPage.judul(data.menuTitle)).toBeVisible();
  await expect(editPage.barisTabel(data.nama)).toContainText(data.emailLama);
  await editPage.klikEdit(data.nama);
  await expect(editPage.judul(data.editTitle)).toBeVisible();
  await expect(editPage.kolomEmail()).toHaveValue(data.emailLama);
  await editPage.ubahEmail(data.emailBaru);
  await expect(editPage.kolomEmail()).toHaveValue(data.emailBaru);
  await editPage.klikSimpan();
  await expect(editPage.judul(data.konfirmasiTitle)).toBeVisible();
  await editPage.konfirmasiSimpan();
  await expect(editPage.judul(data.suksesTitle)).toBeVisible();
  await editPage.klikMengerti();
  await expect(editPage.barisTabel(data.nama)).toContainText(data.emailBaru);
});