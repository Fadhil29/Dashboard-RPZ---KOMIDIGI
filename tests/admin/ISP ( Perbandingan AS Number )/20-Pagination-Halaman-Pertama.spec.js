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

test('TS-UI-ISPPA-135 pagination halaman pertama', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai admin (beforeEach)
    2. Buka Perbandingan AS Number (beforeEach)
    3. Validasi maksimal 15 data dan info Showing 1 to 15
    4. Validasi tombol Previous nonaktif
  */
  const isp = new IspPerbandinganPage(page);
  await expect(isp.infoRentang(1, data.perPage)).toBeVisible();
  expect(await isp.barisData().count()).toBeLessThanOrEqual(data.perPage);
  await expect(isp.tombolSebelumnya()).toBeDisabled();
});
