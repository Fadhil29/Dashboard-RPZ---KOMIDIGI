import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { IspPerbandinganPage } from '../../../pages/ISP ( Perbandingan AS Number )/IspPerbandinganPage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Isp-Perbandingan');

// Memakai sesi dari globalSetup (.auth), login ulang hanya bila sesi tidak valid
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.pastikanMasuk(process.env.GUEST_USERNAME, process.env.GUEST_PASSWORD);
  await expect(new IspPerbandinganPage(page).judul(data.dashboardTitle, { exact: true })).toBeVisible({ timeout: 30_000 });
});

test('TS-UI-ISPPA-116 kartu ringkasan sama dengan total data', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai guest (beforeEach)
    2. Klik menu ISP lalu Perbandingan AS Number
    3. Baca angka keempat kartu (Cocok, Tidak Cocok, Tidak Ditemukan, Tidak Terdaftar)
    4. Validasi jumlah keempatnya sama dengan total pada info Menampilkan
  */
  const isp = new IspPerbandinganPage(page);
  await isp.bukaPerbandingan();
  await expect(isp.infoData()).toBeVisible();
  await isp.pastikanKartuSamaDenganTotal();
});
