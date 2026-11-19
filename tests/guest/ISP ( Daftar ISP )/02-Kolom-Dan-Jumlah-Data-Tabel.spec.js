import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { IspDaftarPage } from '../../../pages/ISP ( Daftar ISP )/IspDaftarPage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Isp-Daftar');

// Memakai sesi dari globalSetup (.auth), login ulang hanya bila sesi tidak valid
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.pastikanMasuk(process.env.GUEST_USERNAME, process.env.GUEST_PASSWORD);
  await expect(new IspDaftarPage(page).judul(data.dashboardTitle, { exact: true })).toBeVisible({ timeout: 30_000 });
});

test('TS-UI-ISPDI-091 kolom dan jumlah data tabel', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai guest (beforeEach)
    2. Klik menu ISP lalu Daftar ISP
    3. Validasi kolom tabel
    4. Validasi info Showing X to Y of total results
  */
  const isp = new IspDaftarPage(page);
  await isp.bukaDaftarIsp();
  for (const kolom of data.kolom) {
    await expect(page.getByRole('columnheader', { name: kolom })).toBeVisible();
  }
  await expect(isp.infoData()).toBeVisible();
});
