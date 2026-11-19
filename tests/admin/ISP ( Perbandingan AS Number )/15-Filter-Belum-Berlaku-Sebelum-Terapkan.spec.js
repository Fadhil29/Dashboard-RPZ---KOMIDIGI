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

test('TS-UI-ISPPA-129 filter belum berlaku sebelum Terapkan', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai admin (beforeEach)
    2. Buka Perbandingan AS Number (beforeEach)
    3. Catat info jumlah data
    4. Ubah Status Kecocokan menjadi Cocok tanpa klik Terapkan
    5. Validasi info jumlah data tidak berubah
  */
  const isp = new IspPerbandinganPage(page);
  await expect(isp.infoData()).toBeVisible();
  const info = await isp.infoData().innerText();
  await isp.pilihStatus('Cocok');
  await page.waitForLoadState('networkidle');
  expect(await isp.infoData().innerText()).toBe(info);
});
