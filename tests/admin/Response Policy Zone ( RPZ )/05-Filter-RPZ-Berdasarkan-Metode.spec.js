import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { DashboardRpzPage } from '../../../pages/Response Policy Zone ( RPZ )/DashboardRpzPage.js';
import { FilterRpzMetodePage } from '../../../pages/Response Policy Zone ( RPZ )/FilterRpzMetodePage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Filter-RPZ-Metode');

// Session dari globalSetup tidak dipakai, login dilakukan di beforeEach
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.isiEmail(process.env.ADMIN_USERNAME);
  await loginPage.isiPassword(process.env.ADMIN_PASSWORD);
  await loginPage.klikMasuk();
});

test('admin bisa memfilter data RPZ berdasarkan metode AXFR dan IXFR', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai admin (beforeEach)
    2. Validasi sudah berada di halaman Dashboard
    3. Klik link RPZ
    4. Validasi halaman RPZ terbuka
    5. Pilih metode AXFR
    6. Klik button Terapkan
    7. Validasi tabel menampilkan data metode AXFR
    8. Ganti metode menjadi IXFR
    9. Klik button Terapkan
    10. Validasi tabel menampilkan data metode IXFR
  */
  const dashboardPage = new DashboardRpzPage(page);
  const filterPage = new FilterRpzMetodePage(page);

  await expect(dashboardPage.judul(data.dashboardTitle, { exact: true })).toBeVisible({ timeout: 15_000 });
  await dashboardPage.bukaRpz();
  await expect(filterPage.judul(data.rpzTitle)).toBeVisible();

  await filterPage.pilihMetode(data.metodeAxfr);
  await filterPage.klikTerapkan();
  await expect(filterPage.tabel()).toContainText(data.metodeAxfr);

  await filterPage.pilihMetode(data.metodeIxfr);
  await filterPage.klikTerapkan();
  await expect(filterPage.tabel()).toContainText(data.metodeIxfr);
});