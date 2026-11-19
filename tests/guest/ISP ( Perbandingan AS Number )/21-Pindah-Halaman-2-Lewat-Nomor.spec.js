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

test('TS-UI-ISPPA-136 pindah halaman 2 lewat nomor', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai guest (beforeEach)
    2. Buka Perbandingan AS Number (beforeEach)
    3. Catat IP Address pertama halaman 1
    4. Klik angka 2
    5. Validasi info Showing 16 to 30 dan data berbeda
  */
  const isp = new IspPerbandinganPage(page);
  const pertama = (await isp.isiKolom('ipRtbh'))[0];
  await isp.klikHalaman(2);
  await expect(isp.infoRentang(data.perPage + 1, data.perPage * 2)).toBeVisible();
  await expect.poll(async () => (await isp.isiKolom('ipRtbh'))[0]).not.toBe(pertama);
});
