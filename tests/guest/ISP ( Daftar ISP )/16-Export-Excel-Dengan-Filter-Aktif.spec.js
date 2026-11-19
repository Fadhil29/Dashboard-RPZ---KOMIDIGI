import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { IspDaftarPage } from '../../../pages/ISP ( Daftar ISP )/IspDaftarPage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Isp-Daftar');

// Memakai sesi dari globalSetup (.auth), login ulang hanya bila sesi tidak valid
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.pastikanMasuk(process.env.GUEST_USERNAME, process.env.GUEST_PASSWORD);
  const isp = new IspDaftarPage(page);
  await expect(isp.judul(data.dashboardTitle, { exact: true })).toBeVisible({ timeout: 30_000 });
  await isp.bukaDaftarIsp();
  await expect(isp.judulHalaman(data.judul)).toBeVisible();
});

test('TS-UI-ISPDI-105 Export Excel dengan filter aktif', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai guest (beforeEach)
    2. Buka Daftar ISP (beforeEach)
    3. Isi pencarian dan pilih Provinsi lalu klik Terapkan
    4. Klik Export Excel
    5. Validasi file .xlsx terunduh
  */
  const isp = new IspDaftarPage(page);
  await isp.isiCariNama(data.namaKombinasi);
  await isp.pilihProvinsi(data.provinsiKombinasi);
  await isp.klikTerapkan();
  await expect(isp.barisData().first()).toBeVisible();
  const unduhan = await isp.exportExcel();
  expect(unduhan.suggestedFilename()).toMatch(/\.xlsx$/);
  expect(await unduhan.failure()).toBeNull();
});
