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

test('TS-UI-ISPDI-100 kombinasi nama dan Provinsi', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai guest (beforeEach)
    2. Buka Daftar ISP (beforeEach)
    3. Isi Cari Nama ISP dengan nama ISP
    4. Pilih Provinsi Banten
    5. Klik Terapkan
    6. Validasi nama mengandung kata dan provinsi sesuai
  */
  const isp = new IspDaftarPage(page);
  await isp.isiCariNama(data.namaKombinasi);
  await isp.pilihProvinsi(data.provinsiKombinasi);
  await isp.klikTerapkan();
  await expect(isp.barisData().first()).toBeVisible();
  for (const nama of await isp.isiKolom('nama')) {
    expect(nama.toLowerCase()).toContain(data.namaKombinasi.toLowerCase());
  }
  for (const provinsi of await isp.isiKolom('provinsi')) {
    expect(provinsi).toBe(data.provinsiKombinasi);
  }
});
