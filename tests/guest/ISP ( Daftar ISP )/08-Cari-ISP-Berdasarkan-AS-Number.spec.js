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

test('TS-UI-ISPDI-097 cari ISP berdasarkan AS Number', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai guest (beforeEach)
    2. Buka Daftar ISP (beforeEach)
    3. Isi Cari Nama ISP dengan AS Number
    4. Klik Terapkan
    5. Validasi hanya ISP dengan AS Number tersebut tampil
  */
  const isp = new IspDaftarPage(page);
  await isp.cariIsp(data.asnIsp);
  await expect(isp.barisData()).toHaveCount(1);
  await expect(isp.barisData().first()).toContainText(data.ispLengkap);
});
