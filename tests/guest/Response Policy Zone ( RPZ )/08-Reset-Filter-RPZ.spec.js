import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { DashboardRpzPage } from '../../../pages/Response Policy Zone ( RPZ )/DashboardRpzPage.js';
import { ResetFilterRpzPage } from '../../../pages/Response Policy Zone ( RPZ )/ResetFilterRpzPage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Reset-Filter-RPZ');

// Session dari globalSetup tidak dipakai, login dilakukan di beforeEach
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.isiEmail(process.env.GUEST_USERNAME);
  await loginPage.isiPassword(process.env.GUEST_PASSWORD);
  await loginPage.klikMasuk();
});

test('guest bisa reset filter RPZ', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai guest (beforeEach)
    2. Validasi sudah berada di halaman Dashboard
    3. Klik link RPZ
    4. Validasi halaman RPZ terbuka
    5. Pilih provinsi
    6. Klik button Terapkan
    7. Validasi tabel menampilkan data provinsi yang difilter
    8. Klik button Reset
    9. Validasi filter provinsi kembali ke Semua
    10. Validasi Total IP kembali ke jumlah semula
  */
  const dashboardPage = new DashboardRpzPage(page);
    const resetPage = new ResetFilterRpzPage(page);
  
    await expect(dashboardPage.judul(data.dashboardTitle, { exact: true })).toBeVisible({ timeout: 15_000 });
    await dashboardPage.bukaRpz();
    await expect(resetPage.judul(data.rpzTitle)).toBeVisible();
  
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
  
    await resetPage.pilihProvinsi(data.provinsiDefault, data.provinsi);
    await resetPage.klikTerapkan();
    await expect(resetPage.tabel()).toContainText(data.provinsi, { timeout: 15_000 });
    await expect(resetPage.totalIp()).not.toHaveText(totalIpSemula, { timeout: 15_000 });
  
    await resetPage.klikReset();
    await expect(resetPage.comboboxDefault(data.provinsiDefault)).toHaveCount(2);
    await expect(resetPage.totalIp()).toHaveText(totalIpSemula, { timeout: 15_000 });
  });