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

test('TS-UI-ISPPA-123 filter status Tidak Cocok', async ({ page }) => {
  const status = 'Tidak Cocok';
  /*
    Test Step :
    1. Login sebagai guest (beforeEach)
    2. Buka Perbandingan AS Number (beforeEach)
    3. Pilih Status Kecocokan sesuai status
    4. Klik Terapkan
    5. Validasi semua baris berstatus tersebut dan total sama dengan kartu
  */
  const isp = new IspPerbandinganPage(page);
  await isp.pilihStatus(status);
  await isp.klikTerapkan();
  await expect(isp.barisData().first()).toBeVisible();
  for (const isi of await isp.isiKolom('status')) {
    expect(isi).toBe(status);
  }
  await expect.poll(() => isp.nilaiKartu(status), { timeout: 15_000 }).toBe(await isp.totalData());
});
