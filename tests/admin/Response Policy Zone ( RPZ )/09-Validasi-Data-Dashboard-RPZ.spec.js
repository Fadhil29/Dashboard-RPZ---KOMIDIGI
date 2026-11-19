import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { DashboardRpzPage } from '../../../pages/Response Policy Zone ( RPZ )/DashboardRpzPage.js';
import { ValidasiDataDashboardRpzPage } from '../../../pages/Response Policy Zone ( RPZ )/ValidasiDataDashboardRpzPage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Validasi-Data-Dashboard-RPZ');

// Session dari globalSetup tidak dipakai, login dilakukan di beforeEach
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.isiEmail(process.env.ADMIN_USERNAME);
  await loginPage.isiPassword(process.env.ADMIN_PASSWORD);
  await loginPage.klikMasuk();
});

test('label kartu total dashboard RPZ tampil', async ({ page }) => {
  // Test Step :
  // 1. Login sebagai admin (beforeEach)
  // 2. Validasi sudah berada di halaman Dashboard
  // 3. Klik link RPZ
  // 4. Validasi halaman RPZ terbuka
  // 5. Validasi label Total ISP tampil
  // 6. Validasi label Total IP tampil
  // 7. Validasi label Total AXFR tampil
  // 8. Validasi label Total IXFR tampil
  const dashboardPage = new DashboardRpzPage(page);
  const validasiPage = new ValidasiDataDashboardRpzPage(page);

  await expect(dashboardPage.judul(data.dashboardTitle, { exact: true })).toBeVisible({ timeout: 15_000 });
  await dashboardPage.bukaRpz();
  await expect(validasiPage.judul(data.rpzTitle)).toBeVisible();

  await expect(validasiPage.label(data.labelTotalIsp)).toBeVisible({ timeout: 15_000 });
  await expect(validasiPage.label(data.labelTotalIp)).toBeVisible({ timeout: 15_000 });
  await expect(validasiPage.label(data.labelTotalAxfr)).toBeVisible({ timeout: 15_000 });
  await expect(validasiPage.label(data.labelTotalIxfr)).toBeVisible({ timeout: 15_000 });
});