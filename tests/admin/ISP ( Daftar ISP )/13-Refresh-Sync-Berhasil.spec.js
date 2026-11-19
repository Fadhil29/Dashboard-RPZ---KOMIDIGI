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

// fitur Refresh Sync belum berfungsi di aplikasi, aktifkan lagi setelah siap
test.fixme('TS-UI-ISPDI-102 Refresh Sync berhasil', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai admin (beforeEach)
    2. Buka Daftar ISP (beforeEach)
    3. Klik Refresh Sync dan tunggu selesai
    4. Validasi tabel tetap tampil tanpa error
  */
  const isp = new IspDaftarPage(page);
  await isp.klikRefreshSync();
  await expect(isp.tombolRefreshSync()).toBeEnabled({ timeout: 60_000 });
  await expect(isp.tabel()).toBeVisible();
  await expect(isp.infoData()).toBeVisible();
});
