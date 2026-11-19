import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { DashboardRpzPage } from '../../../pages/Response Policy Zone ( RPZ )/DashboardRpzPage.js';
import { ResetFilterRtbhPage } from '../../../pages/Remote Triggered Black Hole ( RTBH )/ResetFilterRtbhPage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Reset-Filter-RTBH');

// Session dari globalSetup tidak dipakai, login dilakukan di beforeEach
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.isiEmail(process.env.GUEST_USERNAME);
  await loginPage.isiPassword(process.env.GUEST_PASSWORD);
  await loginPage.klikMasuk();
});

test('guest bisa reset filter RTBH', async ({ page }) => {
  // Test Step :
  // 1. Login sebagai guest (beforeEach)
  // 2. Validasi sudah berada di halaman Dashboard
  // 3. Klik link RTBH
  // 4. Validasi halaman RTBH terbuka
  // 5. Catat Total IP awal
  // 6. Pilih provinsi
  // 7. Klik button Terapkan
  // 8. Validasi tabel menampilkan data provinsi yang difilter
  // 9. Validasi Total IP berubah dari jumlah awal
  // 10. Klik button Reset
  // 11. Validasi filter Status dan Provinsi kembali ke Semua
  // 12. Validasi Total IP kembali ke jumlah awal
  const dashboardPage = new DashboardRpzPage(page);
  const resetPage = new ResetFilterRtbhPage(page);

  await expect(dashboardPage.judul(data.dashboardTitle, { exact: true })).toBeVisible({ timeout: 15_000 });
  await resetPage.bukaRtbh();
  await expect(resetPage.judul(data.rtbhTitle)).toBeVisible();

  // Total IP dianimasikan naik, tunggu sampai angkanya stabil sebelum dicatat
  let bacaanTerakhir = '';
  await expect
    .poll(
      async () => {
        const sekarang = await resetPage.teksTotalIp();
        const stabil = sekarang === bacaanTerakhir && /[1-9]/.test(sekarang);
        bacaanTerakhir = sekarang;
        return stabil;
      },
      { intervals: [500], timeout: 15_000 },
    )
    .toBe(true);
  const totalIpSemula = bacaanTerakhir;

  await resetPage.pilihProvinsi(data.provinsi);
  await resetPage.klikTerapkan();
  await expect(page).toHaveURL(/[?&]province=\d+/);
  await expect(resetPage.tabel()).toContainText(data.provinsi, { timeout: 15_000 });
  await expect(resetPage.totalIp()).not.toHaveText(totalIpSemula, { timeout: 15_000 });

  await resetPage.klikReset();
  await expect(resetPage.comboboxSemua()).toHaveCount(2);
  await expect(resetPage.totalIp()).toHaveText(totalIpSemula, { timeout: 15_000 });
});