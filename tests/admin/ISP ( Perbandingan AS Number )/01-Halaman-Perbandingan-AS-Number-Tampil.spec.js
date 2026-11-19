import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { IspPerbandinganPage } from '../../../pages/ISP ( Perbandingan AS Number )/IspPerbandinganPage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Isp-Perbandingan');

// Memakai sesi dari globalSetup (.auth), login ulang hanya bila sesi tidak valid
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.pastikanMasuk(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
  await expect(new IspPerbandinganPage(page).judul(data.dashboardTitle, { exact: true })).toBeVisible({ timeout: 30_000 });
});

test('TS-UI-ISPPA-115 halaman Perbandingan AS Number tampil', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai admin (beforeEach)
    2. Klik menu ISP lalu Perbandingan AS Number
    3. Validasi judul, subjudul, tombol Refresh Sync dan Export Excel
    4. Validasi kartu ringkasan, filter, dan Tabel Perbandingan
  */
  const isp = new IspPerbandinganPage(page);
  await isp.bukaPerbandingan();
  await expect(isp.judulHalaman(data.judul)).toBeVisible();
  await expect(isp.teks(data.subjudul)).toBeVisible();
  await expect(isp.tombolRefreshSync()).toBeVisible();
  await expect(isp.tombolExport()).toBeVisible();
  for (const kartu of ['Cocok', 'Tidak Cocok', 'Tidak Ditemukan']) {
    await expect(page.getByText(kartu, { exact: true }).first()).toBeVisible();
  }
  await expect(isp.kolomCariAsnIsp()).toBeVisible();
  await expect(isp.dropdownStatus()).toBeVisible();
  await expect(isp.kolomIpAddress()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Terapkan' })).toBeVisible();
  await expect(isp.judulTabel(data.judulTabel)).toBeVisible();
});
