import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.js';
import { PaginationRtbhPage } from '../../../pages/Remote Triggered Black Hole ( RTBH )/PaginationRtbhPage.js';
import { getData } from '../../../config/testdata.js';

const data = getData('Pagination-RTBH');

// Session dari globalSetup tidak dipakai, login dilakukan di beforeEach
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.isiEmail(process.env.ADMIN_USERNAME);
  await loginPage.isiPassword(process.env.ADMIN_PASSWORD);
  await loginPage.klikMasuk();
});

test('admin bisa berpindah halaman tabel RTBH', async ({ page }) => {
  /*
    Test Step :
    1. Login sebagai admin (beforeEach)
    2. Validasi sudah berada di halaman Dashboard
    3. Buka link RTBH
    4. Validasi halaman RTBH terbuka
    5. Validasi halaman 1 menampilkan data awal
    6. Klik halaman 2
    7. Validasi halaman 2 menampilkan data berikutnya
    8. Klik button halaman sebelumnya
    9. Validasi kembali ke halaman 1
    10. Klik button halaman berikutnya
    11. Validasi halaman 2 tampil
    12. Klik button halaman pertama
    13. Validasi kembali ke halaman 1
  */
  const paginationPage = new PaginationRtbhPage(page);

  await expect(paginationPage.judul(data.dashboardTitle, { exact: true })).toBeVisible({ timeout: 15_000 });
  await paginationPage.bukaRtbh();
  await expect(paginationPage.judul(data.rtbhTitle)).toBeVisible();
  await expect(paginationPage.infoData(data.awalHalaman1, data.akhirHalaman1)).toBeVisible({ timeout: 15_000 });

  await paginationPage.klikHalaman(data.halamanKedua);
  await expect(paginationPage.infoData(data.awalHalaman2, data.akhirHalaman2)).toBeVisible();

  await paginationPage.klikSebelumnya();
  await expect(paginationPage.infoData(data.awalHalaman1, data.akhirHalaman1)).toBeVisible();

  await paginationPage.klikBerikutnya();
  await expect(paginationPage.infoData(data.awalHalaman2, data.akhirHalaman2)).toBeVisible();

  await paginationPage.klikPertama();
  await expect(paginationPage.infoData(data.awalHalaman1, data.akhirHalaman1)).toBeVisible();
});