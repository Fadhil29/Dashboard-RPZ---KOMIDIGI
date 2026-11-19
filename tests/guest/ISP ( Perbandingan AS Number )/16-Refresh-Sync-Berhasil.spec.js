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

// fitur Refresh Sync belum berfungsi di aplikasi, aktifkan lagi setelah siap
test.fixme('TS-UI-ISPPA-130 Refresh Sync berhasil', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai guest (beforeEach)
    2. Buka Perbandingan AS Number (beforeEach)
    3. Klik Refresh Sync dan tunggu selesai
    4. Validasi tabel dan kartu ringkasan tampil tanpa error
  */
  const isp = new IspPerbandinganPage(page);
  await isp.klikRefreshSync();
  await expect(isp.tombolRefreshSync()).toBeEnabled({ timeout: 60_000 });
  await expect(isp.tabel()).toBeVisible();
  await isp.pastikanKartuSamaDenganTotal();
});
