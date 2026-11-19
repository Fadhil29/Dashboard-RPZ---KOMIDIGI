import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { IspDaftarPage } from '../../../pages/ISP ( Daftar ISP )/IspDaftarPage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Isp-Daftar');

// Memakai sesi dari globalSetup (.auth), login ulang hanya bila sesi tidak valid
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.pastikanMasuk(process.env.GUEST_USERNAME, process.env.GUEST_PASSWORD);
  await expect(new IspDaftarPage(page).judul(data.dashboardTitle, { exact: true })).toBeVisible({ timeout: 30_000 });
});

test('TS-UI-ISPDI-090 halaman Daftar ISP tampil', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai guest (beforeEach)
    2. Klik menu ISP lalu Daftar ISP
    3. Validasi judul, subjudul, tombol Refresh Sync dan Export Excel
    4. Validasi filter dan tabel tampil
  */
  const isp = new IspDaftarPage(page);
  await isp.bukaDaftarIsp();
  await expect(isp.judulHalaman(data.judul)).toBeVisible();
  await expect(isp.judulTabel(data.judul)).toBeVisible();
  await expect(isp.teks(data.subjudul)).toBeVisible();
  await expect(isp.tombolRefreshSync()).toBeVisible();
  await expect(isp.tombolExport()).toBeVisible();
  await expect(isp.kolomCariNama()).toBeVisible();
  await expect(isp.dropdownProvinsi()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Terapkan' })).toBeVisible();
  await expect(isp.tabel()).toBeVisible();
});
