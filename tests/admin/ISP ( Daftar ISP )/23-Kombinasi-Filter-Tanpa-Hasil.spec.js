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

test('TS-UI-ISPDI-114 kombinasi filter tanpa hasil', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai admin (beforeEach)
    2. Buka Daftar ISP (beforeEach)
    3. Isi Cari Nama ISP dengan nama ISP Ambon
    4. Pilih Provinsi DKI Jakarta
    5. Klik Terapkan
    6. Validasi keadaan kosong dan alert tidak ada data
  */
  const isp = new IspDaftarPage(page);
  await isp.isiCariNama(data.ispLengkap);
  await isp.pilihProvinsi(data.provinsiJakarta);
  await isp.klikTerapkan();
  await expect(isp.keadaanKosong()).toBeVisible();
  await expect(isp.barisData()).toHaveCount(0);
});
