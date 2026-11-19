import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { IspPerbandinganPage } from '../../../pages/ISP ( Perbandingan AS Number )/IspPerbandinganPage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Isp-Perbandingan');

// Memakai sesi dari globalSetup (.auth), login ulang hanya bila sesi tidak valid
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.pastikanMasuk(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
  const isp = new IspPerbandinganPage(page);
  await expect(isp.judul(data.dashboardTitle, { exact: true })).toBeVisible({ timeout: 30_000 });
  await isp.bukaPerbandingan();
  await expect(isp.judulHalaman(data.judul)).toBeVisible();
});

test('TS-UI-ISPPA-137 tombol Next dan Previous', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai admin (beforeEach)
    2. Buka Perbandingan AS Number (beforeEach)
    3. Klik Next
    4. Validasi info halaman 2
    5. Klik Previous
    6. Validasi kembali ke halaman 1
  */
  const isp = new IspPerbandinganPage(page);
  await isp.klikNext();
  await expect(isp.infoRentang(data.perPage + 1, data.perPage * 2)).toBeVisible();
  await isp.klikPrevious();
  await expect(isp.infoRentang(1, data.perPage)).toBeVisible();
});
