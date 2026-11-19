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
test.fixme('TS-UI-ISPPA-131 filter tetap setelah Refresh Sync', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai guest (beforeEach)
    2. Buka Perbandingan AS Number (beforeEach)
    3. Pilih Status Kecocokan Cocok lalu klik Terapkan
    4. Klik Refresh Sync dan tunggu selesai
    5. Validasi semua baris tetap berstatus Cocok
  */
  const isp = new IspPerbandinganPage(page);
  await isp.pilihStatus('Cocok');
  await isp.klikTerapkan();
  await expect(isp.barisData().first()).toBeVisible();
  await isp.klikRefreshSync();
  await expect(isp.tombolRefreshSync()).toBeEnabled({ timeout: 60_000 });
  await expect(isp.dropdownStatus()).toContainText('Cocok');
  for (const isi of await isp.isiKolom('status')) {
    expect(isi).toBe('Cocok');
  }
});
