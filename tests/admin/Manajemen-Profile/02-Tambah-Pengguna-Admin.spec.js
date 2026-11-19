import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { TambahPenggunaAdminPage } from '../../../pages/Manajemen-Profile/TambahPenggunaAdminPage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('tambah_pengguna_admin');

// Nama dan email dibuat unik tiap run supaya tes bisa diulang tanpa bentrok data
// Timestamp format yyyyMMddHHmmss, misalnya 20261106165012
const suffix = new Date().toISOString().replace(/\D/g, '').slice(0, 14);
const nama = `${data.nama} Admin ${suffix}`;
const email = data.email.replace('@', `+admin${suffix}@`);

// Session dari globalSetup tidak dipakai, login dilakukan di beforeEach
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.isiEmail(process.env.ADMIN_USERNAME);
  await loginPage.isiPassword(process.env.ADMIN_PASSWORD);
  await loginPage.klikMasuk();
});

test('admin bisa menambah pengguna dengan role Super Admin', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai admin (beforeEach)
    2. Validasi sudah berada di halaman Dashboard
    3. Klik menu Manajemen Pengguna
    4. Validasi halaman Manajemen Pengguna terbuka
    5. Klik button Tambah Pengguna
    6. Validasi form Tambah Pengguna tampil
    7. Isi nama lengkap, email, password, dan ulangi password
    8. Pilih role Super Admin
    9. Klik button Simpan
    10. Validasi dialog konfirmasi Simpan Pengguna? tampil
    11. Klik button Simpan di dialog
    12. Validasi notifikasi Berhasil tampil
    13. Klik button Mengerti
    14. Validasi pengguna baru dan rolenya tampil di tabel
  */
  const tambahPage = new TambahPenggunaAdminPage(page);

  await expect(tambahPage.judul(data.dashboardTitle)).toBeVisible({ timeout: 15_000 });
  await tambahPage.bukaMenuManajemenPengguna();
  await expect(tambahPage.judul(data.menuTitle)).toBeVisible();
  await tambahPage.bukaFormTambah();
  await expect(tambahPage.judul(data.title)).toBeVisible();
  await tambahPage.isiFormPengguna({ nama, email, password: data.password });
  await tambahPage.pilihRole(data.role);
  await tambahPage.klikSimpan();
  await expect(tambahPage.judul(data.konfirmasiTitle)).toBeVisible();
  await tambahPage.konfirmasiSimpan();
  await expect(tambahPage.judul(data.suksesTitle)).toBeVisible();
  await tambahPage.klikMengerti();
  await expect(tambahPage.selTabel(nama)).toBeVisible();
  await expect(tambahPage.barisTabel(nama)).toContainText(data.role);
});