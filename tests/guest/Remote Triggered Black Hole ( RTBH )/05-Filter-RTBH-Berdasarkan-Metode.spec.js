import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { DashboardRpzPage } from '../../../pages/Response Policy Zone ( RPZ )/DashboardRpzPage.js';
import { FilterRtbhStatusPage } from '../../../pages/Remote Triggered Black Hole ( RTBH )/FilterRtbhStatusPage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Filter-RTBH-Status');

// Session dari globalSetup tidak dipakai, login dilakukan di beforeEach
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.isiEmail(process.env.GUEST_USERNAME);
  await loginPage.isiPassword(process.env.GUEST_PASSWORD);
  await loginPage.klikMasuk();
});

test('guest bisa memfilter data RTBH berdasarkan status Established dan Passive', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai guest (beforeEach)
    2. Validasi sudah berada di halaman Dashboard
    3. Klik link RTBH
    4. Validasi halaman RTBH terbuka
    5. Pilih status Established
    6. Klik button Terapkan
    7. Validasi tabel menampilkan data status Established
    8. Ganti status menjadi Passive
    9. Klik button Terapkan
    10. Validasi tabel menampilkan data status Passive
  */
  const dashboardPage = new DashboardRpzPage(page);
  const filterPage = new FilterRtbhStatusPage(page);

  await expect(dashboardPage.judul(data.dashboardTitle, { exact: true })).toBeVisible({ timeout: 15_000 });
  await filterPage.bukaRtbh();
  await expect(filterPage.judul(data.rtbhTitle)).toBeVisible();

  await filterPage.pilihStatus(data.statusEstablished);
  await filterPage.klikTerapkan();
  await expect(filterPage.tabel()).toContainText(data.statusEstablished);
  await expect(filterPage.tabel()).not.toContainText(data.statusPassive);

  await filterPage.pilihStatus(data.statusPassive);
  await filterPage.klikTerapkan();
  await expect(filterPage.tabel()).toContainText(data.statusPassive);
  await expect(filterPage.tabel()).not.toContainText(data.statusEstablished);
});