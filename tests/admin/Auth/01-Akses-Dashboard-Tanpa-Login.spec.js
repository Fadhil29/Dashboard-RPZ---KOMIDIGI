import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { DashboardPage } from '../../../pages/Dashboard/DashboardPage.js';
import { getData } from '../../../config/testdata.js';

const dashboard = getData('dashboard');

// Tes ini mulai tanpa session
test.use({ storageState: { cookies: [], origins: [] } });

test('akses dashboard tanpa login', async ({ page }) => {
  // Test Step :
  // 1. Buka URL dashboard tanpa login
  // 2. Validasi dialihkan ke halaman login
  // 3. Login sebagai admin
  // 4. Validasi halaman dashboard tampil
  // 5. Klik button Keluar dan konfirmasi di dialog
  // 6. Validasi kembali ke halaman login
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await dashboardPage.goto();
  await expect(page).toHaveURL(/\/login/);
  await expect(loginPage.kolomEmail()).toBeVisible();

  await loginPage.login(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
  await expect(dashboardPage.tombolKeluar()).toBeVisible();
  await expect(dashboardPage.judul(dashboard.title)).toBeVisible();

  await dashboardPage.keluar();
  await expect(page).toHaveURL(/\/login/);
  await expect(loginPage.kolomEmail()).toBeVisible();
});