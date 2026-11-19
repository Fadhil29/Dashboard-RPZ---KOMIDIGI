import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { IspPerbandinganPage } from '../../../pages/ISP ( Perbandingan AS Number )/IspPerbandinganPage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Isp-Perbandingan');

// Memakai sesi dari globalSetup (.auth), login ulang hanya bila sesi tidak valid
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.pastikanMasuk(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
  await expect(new IspPerbandinganPage(page).judul(data.dashboardTitle, { exact: true })).toBeVisible({ timeout: 30_000 });
});

test('TS-UI-ISPPA-117 kolom tabel perbandingan', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai admin (beforeEach)
    2. Klik menu ISP lalu Perbandingan AS Number
    3. Validasi enam kolom tabel
  */
  const isp = new IspPerbandinganPage(page);
  await isp.bukaPerbandingan();
  const header = (await page.getByRole('columnheader').allInnerTexts()).map((h) => h.replace(/\s+/g, ' ').trim().toLowerCase());
  expect(header).toHaveLength(7);
  expect(header[1]).toContain('as number');
  expect(header[2]).toContain('isp name');
  expect(header[3]).toContain('as number');
  expect(header[4]).toContain('isp name');
  expect(header[5]).toContain('ip address');
  expect(header[6]).toContain('status kecocokan');
});
