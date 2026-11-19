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

test('TS-UI-ISPPA-138 filter tetap berlaku di halaman 2', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai guest (beforeEach)
    2. Buka Perbandingan AS Number (beforeEach)
    3. Pilih Status Tidak Ditemukan lalu klik Terapkan
    4. Catat total data
    5. Pindah ke halaman 2
    6. Validasi semua baris Tidak Ditemukan dan total tidak berubah
  */
  const isp = new IspPerbandinganPage(page);
  await isp.pilihStatus('Tidak Ditemukan');
  await isp.klikTerapkan();
  await expect(isp.barisData().first()).toBeVisible();
  const total = await isp.totalData();
  expect(total).toBeGreaterThan(data.perPage);
  await isp.klikHalaman(2);
  await expect(isp.infoRentang(data.perPage + 1, Math.min(data.perPage * 2, total))).toBeVisible();
  for (const isi of await isp.isiKolom('status')) {
    expect(isi).toBe('Tidak Ditemukan');
  }
  expect(await isp.totalData()).toBe(total);
});
