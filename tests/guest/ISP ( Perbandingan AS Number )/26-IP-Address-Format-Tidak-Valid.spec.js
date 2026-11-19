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

test('TS-UI-ISPPA-142 IP Address format tidak valid', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai guest (beforeEach)
    2. Buka Perbandingan AS Number (beforeEach)
    3. Isi IP Address dengan abc
    4. Klik Terapkan
    5. Validasi keadaan kosong, tiga kartu bernilai 0, alert tidak ada data
  */
  const isp = new IspPerbandinganPage(page);
  await isp.isiIpAddress(data.ipTidakValid);
  await isp.klikTerapkan();
  await expect(isp.keadaanKosong()).toBeVisible();
  await expect(isp.barisData()).toHaveCount(0);
  await expect.poll(() => isp.jumlahKartu()).toBe(0);
});
