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

test('TS-UI-ISPPA-118 baris berstatus Cocok', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai admin (beforeEach)
    2. Klik menu ISP lalu Perbandingan AS Number
    3. Filter Status Kecocokan Cocok
    4. Validasi AS Number dan ISP Name sisi Penapisan sama dengan sisi RTBH
  */
  const isp = new IspPerbandinganPage(page);
  await isp.bukaPerbandingan();
  await isp.pilihStatus('Cocok');
  await isp.klikTerapkan();
  await expect(isp.barisData().first()).toBeVisible();
  const [asnP, ispP, asnR, ispR, , status] = await Promise.all(['asnPenapisan', 'ispPenapisan', 'asnRtbh', 'ispRtbh', 'ipRtbh', 'status'].map((k) => isp.isiKolom(k)));
  expect(asnP[0]).toBe(asnR[0]);
  expect(ispP[0]).toBe(ispR[0]);
  expect(status[0]).toBe('Cocok');
});
