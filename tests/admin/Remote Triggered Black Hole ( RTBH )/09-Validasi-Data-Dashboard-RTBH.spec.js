import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { DashboardRpzPage } from '../../../pages/Response Policy Zone ( RPZ )/DashboardRpzPage.js';
import { ValidasiDataDashboardRtbhPage } from '../../../pages/Remote Triggered Black Hole ( RTBH )/ValidasiDataDashboardRtbhPage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Validasi-Data-Dashboard-RTBH');

// Session dari globalSetup tidak dipakai, login dilakukan di beforeEach
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.isiEmail(process.env.ADMIN_USERNAME);
  await loginPage.isiPassword(process.env.ADMIN_PASSWORD);
  await loginPage.klikMasuk();
});

test('label kartu total dashboard RTBH tampil', async ({ page }) => {
  // Test Step :
  // 1. Login sebagai admin (beforeEach)
  // 2. Validasi sudah berada di halaman Dashboard
  // 3. Klik link RTBH
  // 4. Validasi halaman RTBH terbuka
  // 5. Validasi label Total ISP tampil
  // 6. Validasi label Total IP tampil
  // 7. Validasi label Total Established tampil
  // 8. Validasi label Total Passive tampil
  const dashboardPage = new DashboardRpzPage(page);
  const validasiPage = new ValidasiDataDashboardRtbhPage(page);

  await expect(dashboardPage.judul(data.dashboardTitle, { exact: true })).toBeVisible({ timeout: 15_000 });
  await validasiPage.bukaRtbh();
  await expect(validasiPage.judul(data.rtbhTitle)).toBeVisible();

  await expect(validasiPage.label(data.labelTotalIsp)).toBeVisible({ timeout: 15_000 });
  await expect(validasiPage.label(data.labelTotalIp)).toBeVisible({ timeout: 15_000 });
  await expect(validasiPage.label(data.labelTotalEstablished)).toBeVisible({ timeout: 15_000 });
  await expect(validasiPage.label(data.labelTotalPassive)).toBeVisible({ timeout: 15_000 });
});