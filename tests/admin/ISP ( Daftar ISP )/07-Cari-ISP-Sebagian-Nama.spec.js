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

test('TS-UI-ISPDI-096 cari ISP sebagian nama', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai admin (beforeEach)
    2. Buka Daftar ISP (beforeEach)
    3. Isi Cari Nama ISP dengan sebagian nama
    4. Klik Terapkan
    5. Validasi semua nama ISP mengandung kata tersebut
  */
  const isp = new IspDaftarPage(page);
  await isp.cariIsp(data.namaSebagian);
  await expect(isp.barisData().first()).toBeVisible();
  for (const nama of await isp.isiKolom('nama')) {
    expect(nama.toLowerCase()).toContain(data.namaSebagian.toLowerCase());
  }
});
