import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { DashboardRpzPage } from '../../../pages/Response Policy Zone ( RPZ )/DashboardRpzPage.js';
import { FilterRtbhTanggalPage } from '../../../pages/Remote Triggered Black Hole ( RTBH )/FilterRtbhTanggalPage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Filter-Tanggal-RTBH');

// Session dari globalSetup tidak dipakai, login dilakukan di beforeEach
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.isiEmail(process.env.ADMIN_USERNAME);
  await loginPage.isiPassword(process.env.ADMIN_PASSWORD);
  await loginPage.klikMasuk();
});

test('admin bisa memfilter data RTBH berdasarkan dari tanggal', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai admin (beforeEach)
    2. Validasi sudah berada di halaman Dashboard
    3. Klik link RTBH
    4. Validasi halaman RTBH terbuka
    5. Pilih Dari Tanggal
    6. Klik button Terapkan
    7. Validasi tabel menampilkan data dengan First Sync sesuai tanggal yang difilter
  */
  const dashboardPage = new DashboardRpzPage(page);
  const filterPage = new FilterRtbhTanggalPage(page);

  await expect(dashboardPage.judul(data.dashboardTitle, { exact: true })).toBeVisible({ timeout: 15_000 });
  await filterPage.bukaRtbh();
  await expect(filterPage.judul(data.rtbhTitle)).toBeVisible();

  await filterPage.pilihTanggalDari(data.bulan, data.tanggal);
  await filterPage.klikTerapkan();

  await expect(filterPage.tabel()).toContainText(data.dataTabel, { timeout: 15_000 });
});