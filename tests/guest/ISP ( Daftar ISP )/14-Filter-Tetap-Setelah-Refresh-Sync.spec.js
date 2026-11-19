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

// fitur Refresh Sync belum berfungsi di aplikasi, aktifkan lagi setelah siap
test.fixme('TS-UI-ISPDI-103 filter tetap setelah Refresh Sync', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai guest (beforeEach)
    2. Buka Daftar ISP (beforeEach)
    3. Isi Cari Nama ISP lalu klik Terapkan
    4. Klik Refresh Sync dan tunggu selesai
    5. Validasi nilai filter dan data tetap sesuai
  */
  const isp = new IspDaftarPage(page);
  await isp.cariIsp(data.namaSebagian);
  await expect(isp.barisData().first()).toBeVisible();
  await isp.klikRefreshSync();
  await expect(isp.tombolRefreshSync()).toBeEnabled({ timeout: 60_000 });
  await expect(isp.kolomCariNama()).toHaveValue(data.namaSebagian);
  for (const nama of await isp.isiKolom('nama')) {
    expect(nama.toLowerCase()).toContain(data.namaSebagian.toLowerCase());
  }
});
