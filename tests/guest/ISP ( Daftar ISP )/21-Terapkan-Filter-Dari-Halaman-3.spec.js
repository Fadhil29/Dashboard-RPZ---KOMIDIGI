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

test('TS-UI-ISPDI-111 terapkan filter dari halaman 3', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai guest (beforeEach)
    2. Buka Daftar ISP (beforeEach)
    3. Pindah ke halaman 3
    4. Ubah Provinsi lalu klik Terapkan
    5. Validasi kembali ke halaman 1 dengan data tampil
  */
  const isp = new IspDaftarPage(page);
  await isp.klikHalaman(3);
  await expect(isp.infoRentang(data.perPage * 2 + 1, data.perPage * 3)).toBeVisible();
  await isp.pilihProvinsi(data.provinsiJakarta);
  await isp.klikTerapkan();
  await expect(isp.barisData().first()).toBeVisible();
  await expect(isp.infoRentang(1, data.perPage)).toBeVisible();
  await expect(page).not.toHaveURL(/page=3/);
});
