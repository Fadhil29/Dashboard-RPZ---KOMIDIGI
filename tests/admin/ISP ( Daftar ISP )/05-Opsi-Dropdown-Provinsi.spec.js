import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { IspDaftarPage } from '../../../pages/ISP ( Daftar ISP )/IspDaftarPage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Isp-Daftar');

// Memakai sesi dari globalSetup (.auth), login ulang hanya bila sesi tidak valid
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.pastikanMasuk(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
  const isp = new IspDaftarPage(page);
  await expect(isp.judul(data.dashboardTitle, { exact: true })).toBeVisible({ timeout: 30_000 });
  await isp.bukaDaftarIsp();
  await expect(isp.judulHalaman(data.judul)).toBeVisible();
});

test('TS-UI-ISPDI-094 opsi dropdown Provinsi', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai admin (beforeEach)
    2. Buka Daftar ISP (beforeEach)
    3. Klik dropdown Provinsi
    4. Validasi nilai awal Semua dan opsi provinsi terurut abjad
  */
  const isp = new IspDaftarPage(page);
  const opsi = (await isp.opsiProvinsi()).map((o) => o.trim());
  await expect(isp.dropdownProvinsi()).toContainText('Semua');
  const provinsi = opsi;
  expect(provinsi).toEqual([...provinsi].sort((a, b) => a.localeCompare(b, 'id', { sensitivity: 'base' })));
});
