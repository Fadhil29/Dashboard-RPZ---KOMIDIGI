import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { DashboardRpzPage } from '../../../pages/Response Policy Zone ( RPZ )/DashboardRpzPage.js';
import { FilterRpzProvinsiPage } from '../../../pages/Response Policy Zone ( RPZ )/FilterRpzProvinsiPage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Filter-RPZ-Provinsi');

// Session dari globalSetup tidak dipakai, login dilakukan di beforeEach
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.isiEmail(process.env.GUEST_USERNAME);
  await loginPage.isiPassword(process.env.GUEST_PASSWORD);
  await loginPage.klikMasuk();
});

test('guest bisa memfilter data RPZ berdasarkan provinsi', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai guest (beforeEach)
    2. Validasi sudah berada di halaman Dashboard
    3. Klik link RPZ
    4. Validasi halaman RPZ terbuka
    5. Pilih provinsi
    6. Klik button Terapkan
    7. Validasi tabel menampilkan data provinsi yang difilter
  */
  const dashboardPage = new DashboardRpzPage(page);
  const filterPage = new FilterRpzProvinsiPage(page);

  await expect(dashboardPage.judul(data.dashboardTitle, { exact: true })).toBeVisible({ timeout: 15_000 });
  await dashboardPage.bukaRpz();
  await expect(filterPage.judul(data.rpzTitle)).toBeVisible();

  await filterPage.pilihProvinsi(data.provinsi);
  await filterPage.klikTerapkan();

  await expect(filterPage.tabel()).toContainText(data.provinsi);
});