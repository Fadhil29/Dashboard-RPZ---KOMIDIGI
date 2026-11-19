import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { IspPerbandinganPage } from '../../../pages/ISP ( Perbandingan AS Number )/IspPerbandinganPage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Isp-Perbandingan');

// Memakai sesi dari globalSetup (.auth), login ulang hanya bila sesi tidak valid
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.pastikanMasuk(process.env.GUEST_USERNAME, process.env.GUEST_PASSWORD);
  const isp = new IspPerbandinganPage(page);
  await expect(isp.judul(data.dashboardTitle, { exact: true })).toBeVisible({ timeout: 30_000 });
  await isp.bukaPerbandingan();
  await expect(isp.judulHalaman(data.judul)).toBeVisible();
});

test('TS-UI-ISPPA-121 opsi dropdown Status Kecocokan', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai guest (beforeEach)
    2. Buka Perbandingan AS Number (beforeEach)
    3. Klik dropdown Status Kecocokan
    4. Validasi opsi Cocok, Tidak Cocok, Tidak Ditemukan tersedia
  */
  const isp = new IspPerbandinganPage(page);
  const opsi = (await isp.opsiStatus()).map((o) => o.trim());
  await expect(isp.dropdownStatus()).toContainText('Semua');
  expect(opsi).toEqual(expect.arrayContaining(data.statusOpsi));
});
