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

test('TS-UI-ISPDI-093 data terurut abjad nama ISP', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai admin (beforeEach)
    2. Klik menu ISP lalu Daftar ISP
    3. Ambil isi kolom NAMA ISP
    4. Validasi urutan A-Z
  */
  const isp = new IspDaftarPage(page);
  await isp.bukaDaftarIsp();
  await expect(isp.barisData().first()).toBeVisible();
  const nama = await isp.isiKolom('nama');
  // urutan aplikasi mengabaikan spasi dan tanda baca
  const kunci = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const terurut = [...nama].sort((a, b) => kunci(a).localeCompare(kunci(b)));
  expect(nama).toEqual(terurut);
});
