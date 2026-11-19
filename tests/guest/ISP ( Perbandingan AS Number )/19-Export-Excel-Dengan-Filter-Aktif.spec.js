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

test('TS-UI-ISPPA-133 Export Excel dengan filter aktif', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai guest (beforeEach)
    2. Buka Perbandingan AS Number (beforeEach)
    3. Pilih Status Cocok, ambil nama ISP baris pertama, isi pencarian lalu klik Terapkan
    4. Klik Export Excel
    5. Validasi file .xlsx terunduh
  */
  const isp = new IspPerbandinganPage(page);
  await isp.pilihStatus('Cocok');
  await isp.klikTerapkan();
  await expect(isp.barisData().first()).toBeVisible();
  const nama = (await isp.isiKolom('ispPenapisan'))[0];
  await isp.isiCariAsnIsp(nama);
  await isp.klikTerapkan();
  await expect(isp.barisData().first()).toBeVisible();
  const unduhan = await isp.exportExcel();
  expect(unduhan.suggestedFilename()).toMatch(/\.xlsx$/);
  expect(await unduhan.failure()).toBeNull();
});
