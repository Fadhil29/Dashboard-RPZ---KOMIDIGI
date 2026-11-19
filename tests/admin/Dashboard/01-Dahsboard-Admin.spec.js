import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { DashboardPage } from '../../../pages/Dashboard/DashboardPage.js';
import { getData } from '../../../config/testdata.js';

const dashboard = getData('dashboard');

// Tes ini menguji proses login itu sendiri, jadi mulai tanpa session
test.use({ storageState: { cookies: [], origins: [] } });

test('admin bisa login dan melihat halaman dashboard', async ({ page }) => {
  /*
    Test Step :
    1. Buka halaman login
    2. Isi email dengan akun admin
    3. Isi password dengan benar
    4. Klik button Masuk
    5. Validasi sudah berada di halaman dashboard (URL, button Keluar, judul Dashboard)
  */
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await loginPage.goto();
  await loginPage.isiEmail(process.env.ADMIN_USERNAME);
  await loginPage.isiPassword(process.env.ADMIN_PASSWORD);
  await loginPage.klikMasuk();
  await expect(dashboardPage.tombolKeluar()).toBeVisible();
  await expect(dashboardPage.judul(dashboard.title)).toBeVisible();
});