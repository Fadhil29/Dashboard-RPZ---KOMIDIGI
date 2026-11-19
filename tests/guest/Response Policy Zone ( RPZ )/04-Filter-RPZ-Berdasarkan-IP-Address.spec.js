import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { DashboardRpzPage } from '../../../pages/Response Policy Zone ( RPZ )/DashboardRpzPage.js';
import { FilterRpzIpPage } from '../../../pages/Response Policy Zone ( RPZ )/FilterRpzIpPage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Filter-RPZ-IP-Address');

// Session dari globalSetup tidak dipakai, login dilakukan di beforeEach
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.isiEmail(process.env.GUEST_USERNAME);
  await loginPage.isiPassword(process.env.GUEST_PASSWORD);
  await loginPage.klikMasuk();
});

test('guest bisa memfilter data RPZ berdasarkan IP address', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai guest (beforeEach)
    2. Validasi sudah berada di halaman Dashboard
    3. Klik link RPZ
    4. Validasi halaman RPZ terbuka
    5. Ketik IP address di kolom filter
    6. Validasi kolom IP berisi IP yang diketik
    7. Klik button Terapkan
    8. Validasi tabel menampilkan data IP address yang difilter
  */
  const dashboardPage = new DashboardRpzPage(page);
  const filterPage = new FilterRpzIpPage(page);

  await expect(dashboardPage.judul(data.dashboardTitle, { exact: true })).toBeVisible({ timeout: 15_000 });
  await dashboardPage.bukaRpz();
  await expect(filterPage.judul(data.rpzTitle)).toBeVisible();

  await filterPage.isiIpAddress(data.ipAddress);
  await expect(filterPage.kolomIp()).toHaveValue(data.ipAddress);
  await filterPage.klikTerapkan();

  await expect(filterPage.tabel()).toContainText(data.ipAddress);
});