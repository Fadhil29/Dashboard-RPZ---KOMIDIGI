import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { IspDaftarPage } from '../../../pages/ISP ( Daftar ISP )/IspDaftarPage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Isp-Daftar');

// Memakai sesi dari globalSetup (.auth), login ulang hanya bila sesi tidak valid
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.pastikanMasuk(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
  await expect(new IspDaftarPage(page).judul(data.dashboardTitle, { exact: true })).toBeVisible({ timeout: 30_000 });
});

test('TS-UI-ISPDI-092 badge kolom Layanan', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai admin (beforeEach)
    2. Klik menu ISP lalu Daftar ISP
    3. Ambil isi kolom LAYANAN
    4. Validasi tiap isi hanya RPZ Only, RPZ & RTBH, RTBH Only atau "-"
  */
  const isp = new IspDaftarPage(page);
  await isp.bukaDaftarIsp();
  await expect(isp.barisData().first()).toBeVisible();
  const layanan = await isp.isiKolom('layanan');
  expect(layanan.length).toBeGreaterThan(0);
  for (const isi of layanan) {
    expect(['RPZ Only', 'RPZ & RTBH', 'RTBH Only', '-']).toContain(isi);
  }
});
