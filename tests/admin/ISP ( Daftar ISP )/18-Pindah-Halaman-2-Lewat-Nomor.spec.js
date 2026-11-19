import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { IspDaftarPage } from '../../../pages/ISP ( Daftar ISP )/IspDaftarPage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Isp-Daftar');

// Memakai sesi dari globalSetup (.auth), login ulang hanya bila sesi tidak valid
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.pastikanMasuk(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
  const isp = new IspDaftarPage(page);
  await expect(isp.judul(data.dashboardTitle, { exact: true })).toBeVisible({ timeout: 30_000 });
  await isp.bukaDaftarIsp();
  await expect(isp.judulHalaman(data.judul)).toBeVisible();
});

test('TS-UI-ISPDI-108 pindah halaman 2 lewat nomor', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai admin (beforeEach)
    2. Buka Daftar ISP (beforeEach)
    3. Catat nama ISP pertama halaman 1
    4. Klik angka 2
    5. Validasi info Showing 16 to 30, data berbeda, URL memuat page=2
  */
  const isp = new IspDaftarPage(page);
  const pertama = (await isp.isiKolom('nama'))[0];
  await isp.klikHalaman(2);
  await expect(isp.infoRentang(data.perPage + 1, data.perPage * 2)).toBeVisible();
  await expect.poll(async () => (await isp.isiKolom('nama'))[0]).not.toBe(pertama);
  await expect(page).toHaveURL(/page=2/);
});
