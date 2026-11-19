import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { SearchPenggunaNamaRolePage } from '../../../pages/Manajemen-Profile/SearchPenggunaNamaRolePage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Search-Pengguna-Nama-Role');

// Session dari globalSetup tidak dipakai, login dilakukan di beforeEach
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.isiEmail(process.env.ADMIN_USERNAME);
  await loginPage.isiPassword(process.env.ADMIN_PASSWORD);
  await loginPage.klikMasuk();
});

test('admin bisa mencari pengguna berdasarkan nama dan role', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai admin (beforeEach)
    2. Validasi sudah berada di halaman Dashboard
    3. Klik menu Manajemen Pengguna
    4. Validasi halaman Manajemen Pengguna terbuka
    5. Isi kolom pencarian dengan nama pengguna
    6. Validasi kolom pencarian berisi nama tersebut
    7. Pilih role Guest pada filter Role
    8. Klik button Terapkan
    9. Validasi pengguna yang dicari tampil di tabel
    10. Validasi role pengguna tersebut adalah Guest
    11. Validasi role Super Admin tidak tampil di tabel
  */
  const searchPage = new SearchPenggunaNamaRolePage(page);

  await expect(searchPage.judul(data.dashboardTitle)).toBeVisible({ timeout: 15_000 });
  await searchPage.bukaMenuManajemenPengguna();
  await expect(searchPage.judul(data.menuTitle)).toBeVisible();
  await searchPage.isiPencarian(data.keyword);
  await expect(searchPage.kolomCari()).toHaveValue(data.keyword);
  await searchPage.pilihRole(data.role);
  await searchPage.klikTerapkan();
  await expect(searchPage.selTabel(data.keyword)).toBeVisible();
  await expect(searchPage.barisTabel(data.keyword)).toContainText(data.role);
  await expect(searchPage.selTabel(data.roleLain)).toHaveCount(0);
});
