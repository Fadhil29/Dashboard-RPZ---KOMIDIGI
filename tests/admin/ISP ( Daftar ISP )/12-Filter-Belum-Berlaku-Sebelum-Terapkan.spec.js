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

test('TS-UI-ISPDI-101 filter belum berlaku sebelum Terapkan', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai admin (beforeEach)
    2. Buka Daftar ISP (beforeEach)
    3. Catat info jumlah data
    4. Ubah Provinsi menjadi DKI Jakarta tanpa klik Terapkan
    5. Validasi info jumlah data tidak berubah
  */
  const isp = new IspDaftarPage(page);
  await expect(isp.infoRentang(1, data.perPage)).toBeVisible();
  const sebelum = await isp.infoData().innerText();
  await isp.pilihProvinsi(data.provinsiJakarta);
  await page.waitForLoadState('networkidle');
  expect(await isp.infoData().innerText()).toBe(sebelum);
});
