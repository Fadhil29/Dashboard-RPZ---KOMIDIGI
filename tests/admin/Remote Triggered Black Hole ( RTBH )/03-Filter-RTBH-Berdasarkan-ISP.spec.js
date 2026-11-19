import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { DashboardRpzPage } from '../../../pages/Response Policy Zone ( RPZ )/DashboardRpzPage.js';
import { FilterRtbhIspPage } from '../../../pages/Remote Triggered Black Hole ( RTBH )/FilterRtbhIspPage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Filter-RTBH-ISP');

// Session dari globalSetup tidak dipakai, login dilakukan di beforeEach
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.isiEmail(process.env.ADMIN_USERNAME);
  await loginPage.isiPassword(process.env.ADMIN_PASSWORD);
  await loginPage.klikMasuk();
});

test('admin bisa memfilter data RTBH berdasarkan ISP', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai admin (beforeEach)
    2. Validasi sudah berada di halaman Dashboard
    3. Klik link RTBH
    4. Validasi halaman RTBH terbuka
    5. Pilih ISP
    6. Klik button Terapkan
    7. Validasi tabel menampilkan data ISP yang difilter
  */
  const dashboardPage = new DashboardRpzPage(page);
  const filterPage = new FilterRtbhIspPage(page);

  await expect(dashboardPage.judul(data.dashboardTitle, { exact: true })).toBeVisible({ timeout: 15_000 });
  await filterPage.bukaRtbh();
  await expect(filterPage.judul(data.rtbhTitle)).toBeVisible();

  await filterPage.pilihIsp(data.isp);
  await filterPage.klikTerapkan();

  await expect(filterPage.tabel()).toContainText(data.isp);
});