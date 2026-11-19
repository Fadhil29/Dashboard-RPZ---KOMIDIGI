import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { DashboardPage } from '../../../pages/Dashboard/DashboardPage.js';
import { TambahPenggunaPage } from '../../../pages/Manajemen-Profile/TambahPenggunaPage.js';
import { getData } from '../../../config/testdata.js';

const dashboard = getData('dashboard');
const tambah = getData('tambah-pengguna');

// Nama dibuat unik tiap run supaya baris di tabel mudah dibedakan.
// Email dipakai apa adanya dari data, jadi pengguna harus dihapus setelah tes.
const suffix = Date.now().toString().slice(-3);
const nama = `${tambah.nama} ${suffix}`;
const email = tambah.email;

// Session dari globalSetup tidak dipakai, login dilakukan di beforeEach
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.isiEmail(process.env.ADMIN_USERNAME);
  await loginPage.isiPassword(process.env.ADMIN_PASSWORD);
  await loginPage.klikMasuk();
});

test('admin bisa menambah pengguna baru', async ({ page }) => {
  /*
    Test Step :
    1. Buka halaman login
    2. Isi email dengan akun admin
    3. Isi password dengan benar
    4. Klik button Masuk
    5. Validasi sudah berada di halaman Dashboard
    6. Klik menu Manajemen Pengguna
    7. Validasi halaman Manajemen Pengguna terbuka
    8. Klik button Tambah Pengguna
    9. Validasi form Tambah Pengguna tampil
    10. Isi nama lengkap, email, password, dan ulangi password
    11. Klik button Simpan
    12. Validasi dialog konfirmasi Simpan Pengguna? tampil
    13. Klik button Simpan di dialog
    14. Validasi notifikasi Berhasil tampil
    15. Klik button Mengerti
    16. Validasi pengguna baru tampil di tabel
  */
  const dashboardPage = new DashboardPage(page);
  const tambahPage = new TambahPenggunaPage(page);

  await expect(dashboardPage.judul(dashboard.title)).toBeVisible({ timeout: 15_000 });
  await tambahPage.bukaMenuManajemenPengguna();
  await expect(tambahPage.judul(tambah.menuTitle)).toBeVisible();
  await tambahPage.bukaFormTambah();
  await expect(tambahPage.judul(tambah.title)).toBeVisible();
  await tambahPage.isiFormPengguna({ nama, email, password: tambah.password });
  await tambahPage.klikSimpan();
  await expect(tambahPage.judul(tambah.konfirmasiTitle)).toBeVisible();
  await tambahPage.konfirmasiSimpan();
  await expect(tambahPage.judul(tambah.suksesTitle)).toBeVisible();
  await tambahPage.klikMengerti();
  await expect(tambahPage.selTabel(nama)).toBeVisible();
});