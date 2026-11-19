import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { IspPerbandinganPage } from '../../../pages/ISP ( Perbandingan AS Number )/IspPerbandinganPage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Isp-Perbandingan');

// Memakai sesi dari globalSetup (.auth), login ulang hanya bila sesi tidak valid
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.pastikanMasuk(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
  const isp = new IspPerbandinganPage(page);
  await expect(isp.judul(data.dashboardTitle, { exact: true })).toBeVisible({ timeout: 30_000 });
  await isp.bukaPerbandingan();
  await expect(isp.judulHalaman(data.judul)).toBeVisible();
});

test('TS-UI-ISPPA-127 filter IP Address valid', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai admin (beforeEach)
    2. Buka Perbandingan AS Number (beforeEach)
    3. Ambil IP Address dari baris pertama tabel
    4. Isi IP Address dengan IP tersebut
    5. Klik Terapkan
    6. Validasi semua baris ber-IP itu, total sesuai kartu dan info jumlah data
  */
  const isp = new IspPerbandinganPage(page);
  const ip = (await isp.isiKolom('ipRtbh'))[0];
  await isp.isiIpAddress(ip);
  await isp.klikTerapkan();
  await expect(isp.barisData().first()).toBeVisible();
  for (const isi of await isp.isiKolom('ipRtbh')) {
    expect(isi).toBe(ip);
  }
  const total = await isp.totalData();
  expect(await isp.barisData().count()).toBe(total);
  await isp.pastikanKartuSamaDenganTotal();
});