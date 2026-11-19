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

test('TS-UI-ISPDI-095 cari ISP nama lengkap', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai guest (beforeEach)
    2. Buka Daftar ISP (beforeEach)
    3. Isi Cari Nama ISP dengan nama lengkap
    4. Klik Terapkan
    5. Validasi 1 data tampil lengkap dan URL memuat search
  */
  const isp = new IspDaftarPage(page);
  await isp.cariIsp(data.ispLengkap);
  await expect(isp.barisData()).toHaveCount(1);
  const baris = isp.barisData().first();
  await expect(baris).toContainText(data.ispLengkap);
  await expect(baris).toContainText(data.asnIsp);
  await expect(baris).toContainText(data.kotaIsp);
  await expect(baris).toContainText(data.provinsiIsp);
  await expect(baris).toContainText(data.layananIsp);
  await expect(isp.infoSatuData()).toBeVisible();
  await expect(page).toHaveURL(/search=/);
});
