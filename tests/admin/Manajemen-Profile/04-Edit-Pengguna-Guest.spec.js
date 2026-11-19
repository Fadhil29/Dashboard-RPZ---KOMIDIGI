import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { EditPenggunaGuestPage } from '../../../pages/Manajemen-Profile/EditPenggunaGuestPage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Edit-Pengguna-Guest');

// Awalan tetap, bagian belakang (angka) diganti dengan akhiran
const namaBaru = `${data.nama} ${data.akhiran}`;

// Session dari globalSetup tidak dipakai, login dilakukan di beforeEach
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.isiEmail(process.env.ADMIN_USERNAME);
  await loginPage.isiPassword(process.env.ADMIN_PASSWORD);
  await loginPage.klikMasuk();
});

test('admin bisa mengedit pengguna guest', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai admin (beforeEach)
    2. Validasi sudah berada di halaman Dashboard
    3. Klik menu Manajemen Pengguna
    4. Validasi halaman Manajemen Pengguna terbuka
    5. Validasi pengguna yang akan diedit tampil di tabel
    6. Klik button Edit pada baris pengguna tersebut
    7. Validasi form Edit Pengguna tampil dan data lama sudah terisi
    8. Klik kolom nama, ganti bagian belakang nama menjadi Edit
    9. Validasi kolom nama berisi nama baru
    10. Klik button Simpan
    11. Validasi dialog konfirmasi Simpan Perubahan? tampil
    12. Klik button Simpan di dialog
    13. Validasi notifikasi Berhasil tampil
    14. Klik button Mengerti
    15. Validasi nama baru tampil di tabel
  */
  const editPage = new EditPenggunaGuestPage(page);

  await expect(editPage.judul(data.dashboardTitle)).toBeVisible({ timeout: 15_000 });
  await editPage.bukaMenuManajemenPengguna();
  await expect(editPage.judul(data.menuTitle)).toBeVisible();
  await expect(editPage.barisTabel(data.nama)).toBeVisible();
  await editPage.klikEdit(data.nama);
  await expect(editPage.judul(data.editTitle)).toBeVisible();
  await expect(editPage.kolomNama()).not.toBeEmpty();
  await editPage.ubahNama(namaBaru);
  await expect(editPage.kolomNama()).toHaveValue(namaBaru);
  await editPage.klikSimpan();
  await expect(editPage.judul(data.konfirmasiTitle)).toBeVisible();
  await editPage.konfirmasiSimpan();
  await expect(editPage.judul(data.suksesTitle)).toBeVisible();
  await editPage.klikMengerti();
  await expect(editPage.selTabel(namaBaru)).toBeVisible();
});