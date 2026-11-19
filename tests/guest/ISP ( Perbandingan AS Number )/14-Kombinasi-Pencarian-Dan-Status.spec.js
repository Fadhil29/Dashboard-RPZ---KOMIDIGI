import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { IspPerbandinganPage } from '../../../pages/ISP ( Perbandingan AS Number )/IspPerbandinganPage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Isp-Perbandingan');

// Memakai sesi dari globalSetup (.auth), login ulang hanya bila sesi tidak valid
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.pastikanMasuk(process.env.GUEST_USERNAME, process.env.GUEST_PASSWORD);
  const isp = new IspPerbandinganPage(page);
  await expect(isp.judul(data.dashboardTitle, { exact: true })).toBeVisible({ timeout: 30_000 });
  await isp.bukaPerbandingan();
  await expect(isp.judulHalaman(data.judul)).toBeVisible();
});

test('TS-UI-ISPPA-128 kombinasi pencarian dan status', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai guest (beforeEach)
    2. Buka Perbandingan AS Number (beforeEach)
    3. Pilih Status Kecocokan Cocok lalu klik Terapkan
    4. Ambil nama ISP dari baris pertama
    5. Isi Cari ASN / ISP dengan nama ISP tersebut lalu klik Terapkan
    6. Validasi semua baris berstatus Cocok dan memuat nama ISP itu
  */
  const isp = new IspPerbandinganPage(page);
  await isp.pilihStatus('Cocok');
  await isp.klikTerapkan();
  await expect(isp.barisData().first()).toBeVisible();
  const nama = (await isp.isiKolom('ispPenapisan'))[0];
  await isp.isiCariAsnIsp(nama);
  await isp.klikTerapkan();
  await expect(isp.barisData().first()).toBeVisible();
  for (const isi of await isp.isiKolom('status')) {
    expect(isi).toBe('Cocok');
  }
  for (const isi of await isp.isiKolom('ispPenapisan')) {
    expect(isi.toLowerCase()).toContain(nama.toLowerCase());
  }
});