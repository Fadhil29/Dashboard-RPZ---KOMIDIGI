import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { ResetNamaRolePage } from '../../../pages/Manajemen-Profile/ResetNamaRolePage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Reset-Nama-Role');

// Session dari globalSetup tidak dipakai, login dilakukan di beforeEach
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.isiEmail(process.env.ADMIN_USERNAME);
  await loginPage.isiPassword(process.env.ADMIN_PASSWORD);
  await loginPage.klikMasuk();
});

test('admin bisa mereset pencarian nama dan filter role', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai admin (beforeEach)
    2. Validasi sudah berada di halaman Dashboard
    3. Klik menu Manajemen Pengguna
    4. Validasi halaman Manajemen Pengguna terbuka
    5. Isi kolom pencarian dengan nama pertama dan pilih role pertama
    6. Klik button Reset
    7. Validasi kolom pencarian kosong dan filter Role kembali ke Semua
    8. Isi kolom pencarian dengan nama kedua dan pilih role kedua
    9. Klik button Terapkan
    10. Validasi pengguna yang dicari tampil di tabel
    11. Klik button Reset
    12. Validasi kolom pencarian kosong dan filter Role kembali ke Semua
  */
  const resetPage = new ResetNamaRolePage(page);

  await expect(resetPage.judul(data.dashboardTitle)).toBeVisible({ timeout: 15_000 });
  await resetPage.bukaMenuManajemenPengguna();
  await expect(resetPage.judul(data.menuTitle)).toBeVisible();

  await resetPage.isiPencarian(data.keywordPertama);
  await expect(resetPage.kolomCari()).toHaveValue(data.keywordPertama);
  await resetPage.pilihRole(data.rolePertama);
  await resetPage.klikReset();
  await expect(resetPage.kolomCari()).toHaveValue('');
  await expect(resetPage.filterRole()).toBeVisible();

  await resetPage.isiPencarian(data.keywordKedua);
  await expect(resetPage.kolomCari()).toHaveValue(data.keywordKedua);
  await resetPage.pilihRole(data.roleKedua);
  await resetPage.klikTerapkan();
  await expect(resetPage.selTabel(data.keywordKedua)).toBeVisible();

  await resetPage.klikReset();
  await expect(resetPage.kolomCari()).toHaveValue('');
  await expect(resetPage.filterRole()).toBeVisible();
});