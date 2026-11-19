import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { SearchPenggunaRolePage } from '../../../pages/Manajemen-Profile/SearchPenggunaRolePage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Search-Pengguna-Role');

// Session dari globalSetup tidak dipakai, login dilakukan di beforeEach
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.isiEmail(process.env.ADMIN_USERNAME);
  await loginPage.isiPassword(process.env.ADMIN_PASSWORD);
  await loginPage.klikMasuk();
});

test('admin bisa memfilter pengguna berdasarkan role', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai admin (beforeEach)
    2. Validasi sudah berada di halaman Dashboard
    3. Klik menu Manajemen Pengguna
    4. Validasi halaman Manajemen Pengguna dan filter Role tampil
    5. Pilih role Guest pada filter Role
    6. Klik button Terapkan
    7. Validasi pengguna dengan role Guest tampil di tabel
    8. Validasi pengguna dengan role Super Admin tidak tampil di tabel
  */
  const searchPage = new SearchPenggunaRolePage(page);

  await expect(searchPage.judul(data.dashboardTitle)).toBeVisible({ timeout: 15_000 });
  await searchPage.bukaMenuManajemenPengguna();
  await expect(searchPage.judul(data.menuTitle)).toBeVisible();
  await expect(searchPage.filterRole()).toBeVisible();
  await searchPage.pilihRole(data.role);
  await searchPage.klikTerapkan();
  await expect(searchPage.selRole(data.role)).not.toHaveCount(0);
  await expect(searchPage.selRole(data.roleLain)).toHaveCount(0);
});