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

test('TS-UI-ISPDI-110 filter tetap berlaku di halaman 2', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai admin (beforeEach)
    2. Buka Daftar ISP (beforeEach)
    3. Pilih Provinsi DKI Jakarta lalu klik Terapkan
    4. Catat total data
    5. Pindah ke halaman 2
    6. Validasi provinsi tetap DKI Jakarta dan total tidak berubah
  */
  const isp = new IspDaftarPage(page);
  await isp.pilihProvinsi(data.provinsiJakarta);
  await isp.klikTerapkan();
  await expect(isp.barisData().first()).toBeVisible();
  const total = await isp.totalData();
  expect(total).toBeGreaterThan(data.perPage);
  await isp.klikHalaman(2);
  await expect(isp.infoRentang(data.perPage + 1, Math.min(data.perPage * 2, total))).toBeVisible();
  for (const provinsi of await isp.isiKolom('provinsi')) {
    expect(provinsi).toBe(data.provinsiJakartaTabel);
  }
  expect(await isp.totalData()).toBe(total);
});
