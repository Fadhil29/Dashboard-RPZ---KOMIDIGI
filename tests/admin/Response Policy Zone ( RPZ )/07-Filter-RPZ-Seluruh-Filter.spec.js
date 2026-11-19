import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { DashboardRpzPage } from '../../../pages/Response Policy Zone ( RPZ )/DashboardRpzPage.js';
import { FilterRpzSeluruhPage } from '../../../pages/Response Policy Zone ( RPZ )/FilterRpzSeluruhPage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Filter-RPZ-Seluruh');

// Session dari globalSetup tidak dipakai, login dilakukan di beforeEach
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.isiEmail(process.env.ADMIN_USERNAME);
  await loginPage.isiPassword(process.env.ADMIN_PASSWORD);
  await loginPage.klikMasuk();
});

test('admin bisa memfilter data RPZ dengan seluruh filter sekaligus', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai admin (beforeEach)
    2. Validasi sudah berada di halaman Dashboard
    3. Klik link RPZ
    4. Validasi halaman RPZ terbuka
    5. Klik button Reset
    6. Pilih Dari Tanggal
    7. Pilih Sampai Tanggal
    8. Pilih ISP
    9. Ketik IP address
    10. Validasi kolom IP berisi IP yang diketik
    11. Pilih metode
    12. Pilih provinsi
    13. Klik button Terapkan
    14. Validasi tabel menampilkan data sesuai ISP, IP address, metode, dan provinsi
  */
  const dashboardPage = new DashboardRpzPage(page);
  const filterPage = new FilterRpzSeluruhPage(page);

  await expect(dashboardPage.judul(data.dashboardTitle, { exact: true })).toBeVisible({ timeout: 15_000 });
  await dashboardPage.bukaRpz();
  await expect(filterPage.judul(data.rpzTitle)).toBeVisible();

  await filterPage.klikReset();
  await filterPage.pilihTanggalDari(data.bulan, data.tanggal);
  await filterPage.pilihTanggalSampai(data.bulanSampai, data.tanggalSampai);
  await filterPage.pilihIsp(data.isp);
  await filterPage.isiIpAddress(data.ipAddress);
  await expect(filterPage.kolomIp()).toHaveValue(data.ipAddress);
  await filterPage.pilihMetode(data.metode);
  await filterPage.pilihProvinsi(data.provinsi);
  await filterPage.klikTerapkan();

  await expect(filterPage.tabel()).toContainText(data.isp, { timeout: 15_000 });
  await expect(filterPage.tabel()).toContainText(data.ipAddress);
  await expect(filterPage.tabel()).toContainText(data.metode);
  await expect(filterPage.tabel()).toContainText(data.provinsi);
});