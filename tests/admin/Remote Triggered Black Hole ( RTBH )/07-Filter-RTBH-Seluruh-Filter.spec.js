import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { DashboardRpzPage } from '../../../pages/Response Policy Zone ( RPZ )/DashboardRpzPage.js';
import { FilterRtbhSeluruhPage } from '../../../pages/Remote Triggered Black Hole ( RTBH )/FilterRtbhSeluruhPage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Filter-RTBH-Seluruh');

// Session dari globalSetup tidak dipakai, login dilakukan di beforeEach
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.isiEmail(process.env.ADMIN_USERNAME);
  await loginPage.isiPassword(process.env.ADMIN_PASSWORD);
  await loginPage.klikMasuk();
});

test('admin bisa memfilter data RTBH dengan seluruh filter sekaligus', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai admin (beforeEach)
    2. Validasi sudah berada di halaman Dashboard
    3. Klik link RTBH
    4. Validasi halaman RTBH terbuka
    5. Validasi data awal tabel sudah termuat
    6. Klik button Reset
    7. Pilih Dari Tanggal
    8. Pilih ISP
    9. Ketik IP address
    10. Validasi kolom IP berisi IP yang diketik
    11. Pilih status
    12. Pilih provinsi
    13. Klik button Terapkan
    14. Validasi tabel menampilkan data sesuai ISP, IP address, status, dan provinsi
  */
  const dashboardPage = new DashboardRpzPage(page);
  const filterPage = new FilterRtbhSeluruhPage(page);

  await expect(dashboardPage.judul(data.dashboardTitle, { exact: true })).toBeVisible({ timeout: 15_000 });
  await filterPage.bukaRtbh();
  await expect(filterPage.judul(data.rtbhTitle)).toBeVisible();
  await expect(filterPage.infoData()).toBeVisible({ timeout: 15_000 });

  await filterPage.klikReset();
  await filterPage.pilihTanggalDari(data.bulan, data.tanggal);
  await filterPage.pilihIsp(data.isp);
  await filterPage.isiIpAddress(data.ipAddress);
  await expect(filterPage.kolomIp()).toHaveValue(data.ipAddress);
  await filterPage.pilihStatus(data.status);
  await filterPage.pilihProvinsi(data.provinsi);
  await filterPage.klikTerapkan();

  await expect(filterPage.tabel()).toContainText(data.isp, { timeout: 15_000 });
  await expect(filterPage.tabel()).toContainText(data.ipAddress);
  await expect(filterPage.tabel()).toContainText(data.status);
  await expect(filterPage.tabel()).toContainText(data.provinsi);
});