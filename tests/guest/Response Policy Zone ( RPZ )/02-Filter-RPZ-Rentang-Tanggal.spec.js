import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { DashboardRpzPage } from '../../../pages/Response Policy Zone ( RPZ )/DashboardRpzPage.js';
import { FilterRpzTanggalPage } from '../../../pages/Response Policy Zone ( RPZ )/FilterRpzTanggalPage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Filter-Tanggal-RPZ');

// Session dari globalSetup tidak dipakai, login dilakukan di beforeEach
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.isiEmail(process.env.GUEST_USERNAME);
  await loginPage.isiPassword(process.env.GUEST_PASSWORD);
  await loginPage.klikMasuk();
});

test('guest bisa memfilter data RPZ berdasarkan dari tanggal sampai tanggal', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai guest (beforeEach)
    2. Validasi sudah berada di halaman Dashboard
    3. Klik link RPZ
    4. Validasi halaman RPZ terbuka
    5. Pilih Dari Tanggal
    6. Pilih Sampai Tanggal
    7. Klik button Terapkan
    8. Validasi tabel menampilkan data dengan First Sync sesuai tanggal yang difilter
  */
  const dashboardPage = new DashboardRpzPage(page);
  const filterPage = new FilterRpzTanggalPage(page);

  await expect(dashboardPage.judul(data.dashboardTitle, { exact: true })).toBeVisible({ timeout: 15_000 });
  await dashboardPage.bukaRpz();
  await expect(filterPage.judul(data.rpzTitle)).toBeVisible();

  await filterPage.pilihTanggalDari(data.bulan, data.tanggal);
  await filterPage.pilihTanggalSampai(data.bulanSampai, data.tanggalSampai);
  await filterPage.klikTerapkan();

  await expect(filterPage.tabel()).toContainText(data.dataTabel, { timeout: 15_000 });
});