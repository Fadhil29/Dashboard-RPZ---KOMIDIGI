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

test('TS-UI-ISPPA-125 cari berdasarkan AS Number', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai guest (beforeEach)
    2. Buka Perbandingan AS Number (beforeEach)
    3. Ambil AS Number dari baris pertama tabel
    4. Isi Cari ASN / ISP dengan AS Number tersebut
    5. Klik Terapkan
    6. Validasi semua baris memuat AS Number itu dan total sesuai kartu
  */
  const isp = new IspPerbandinganPage(page);
  const asn = (await isp.isiKolom('asnPenapisan'))[0];
  await isp.isiCariAsnIsp(asn);
  await isp.klikTerapkan();
  await expect(isp.barisData().first()).toBeVisible();
  const [penapisan, rtbh] = await Promise.all([isp.isiKolom('asnPenapisan'), isp.isiKolom('asnRtbh')]);
  penapisan.forEach((nilai, i) => expect([nilai, rtbh[i]]).toContain(asn));
  await isp.pastikanKartuSamaDenganTotal();
});