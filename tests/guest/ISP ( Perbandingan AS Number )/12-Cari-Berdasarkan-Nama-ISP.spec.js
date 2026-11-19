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

test('TS-UI-ISPPA-126 cari berdasarkan nama ISP', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai guest (beforeEach)
    2. Buka Perbandingan AS Number (beforeEach)
    3. Ambil nama ISP dari baris pertama tabel
    4. Isi Cari ASN / ISP dengan nama ISP tersebut
    5. Klik Terapkan
    6. Validasi semua baris memuat nama ISP itu dan total sesuai kartu
  */
  const isp = new IspPerbandinganPage(page);
  const nama = (await isp.isiKolom('ispPenapisan'))[0];
  await isp.isiCariAsnIsp(nama);
  await isp.klikTerapkan();
  await expect(isp.barisData().first()).toBeVisible();
  const [penapisan, rtbh] = await Promise.all([isp.isiKolom('ispPenapisan'), isp.isiKolom('ispRtbh')]);
  penapisan.forEach((nilai, i) => expect(`${nilai} ${rtbh[i]}`.toLowerCase()).toContain(nama.toLowerCase()));
  await isp.pastikanKartuSamaDenganTotal();
});