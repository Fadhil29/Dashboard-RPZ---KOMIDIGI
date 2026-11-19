import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { DashboardPage } from '../../../pages/Dashboard/DashboardPage.js';
import { ManajemenPenggunaPage } from '../../../pages/Manajemen-Profile/ManajemenPenggunaPage.js';
import { getData } from '../../../config/testdata.js';

const dashboard = getData('dashboard');
const manajemen = getData('manajemen-pengguna');

// Session dari globalSetup tidak dipakai, login dilakukan di beforeEach
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.isiEmail(process.env.ADMIN_USERNAME);
  await loginPage.isiPassword(process.env.ADMIN_PASSWORD);
  await loginPage.klikMasuk();
});

test('admin bisa membuka menu Manajemen Pengguna', async ({ page }) => {
  /*
    Test Step :
    1. Buka halaman login
    2. Isi email dengan akun admin
    3. Isi password dengan benar
    4. Klik button Masuk
    5. Validasi sudah berada di halaman Dashboard
    6. Validasi menu Manajemen Pengguna tampil di sidebar
    7. Klik menu Manajemen Pengguna
    8. Validasi halaman Manajemen Pengguna terbuka
  */
  const dashboardPage = new DashboardPage(page);
  const manajemenPage = new ManajemenPenggunaPage(page);

  await expect(dashboardPage.judul(dashboard.title)).toBeVisible({ timeout: 15_000 });
  await expect(manajemenPage.menuLink(manajemen.title)).toBeVisible();
  await manajemenPage.bukaMenu(manajemen.title);
  await expect(manajemenPage.judul(manajemen.title)).toBeVisible();
});