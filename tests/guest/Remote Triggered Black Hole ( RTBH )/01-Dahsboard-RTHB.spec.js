import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { DashboardRtbhPage } from '../../../pages/Remote Triggered Black Hole ( RTBH )/DashboardRtbhPage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Dashboard-RTBH');

// Session dari globalSetup tidak dipakai, login dilakukan di beforeEach
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.isiEmail(process.env.GUEST_USERNAME);
  await loginPage.isiPassword(process.env.GUEST_PASSWORD);
  await loginPage.klikMasuk();
});

test('guest bisa membuka halaman RTBH dari dashboard', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai guest (beforeEach)
    2. Validasi sudah berada di halaman Dashboard
    3. Klik link RTBH
    4. Validasi halaman RTBH terbuka
    5. Validasi teks Monitoring sinkronisasi BGP tampil
  */
  const dashboardPage = new DashboardRtbhPage(page);

  await expect(dashboardPage.judul(data.dashboardTitle, { exact: true })).toBeVisible({ timeout: 15_000 });
  await dashboardPage.bukaRtbh();
  await expect(dashboardPage.judul(data.rtbhTitle)).toBeVisible();
  await expect(dashboardPage.teks(data.monitoringText)).toBeVisible();
});