import { expect } from '@playwright/test';

// Aksi umum halaman ISP (Daftar ISP dan Perbandingan AS Number)
export class IspBasePage {
  constructor(page) {
    this.page = page;
  }

  judul(nama, { exact = false } = {}) {
    return this.page.getByRole('heading', { name: nama, exact }).first();
  }

  // Judul halaman = heading level 1 dengan teks persis
  judulHalaman(nama) {
    return this.page.getByRole('heading', { name: nama, exact: true, level: 1 });
  }

  judulTabel(nama) {
    return this.page.getByRole('heading', { name: nama, level: 2 });
  }

  teks(konten) {
    return this.page.getByText(konten).first();
  }

  async bukaMenuIsp(subMenu, alamat) {
    const linkSub = this.page.getByRole('link', { name: subMenu, exact: true });
    // klik menu kadang belum berpindah halaman (menu masih beranimasi), jadi diulang sampai URL sesuai
    await expect(async () => {
      if (!(await linkSub.isVisible())) {
        await this.page.getByRole('button', { name: 'ISP', exact: true }).click();
      }
      await linkSub.click({ timeout: 3_000 });
      await expect(this.page).toHaveURL(alamat, { timeout: 3_000 });
    }).toPass({ timeout: 30_000 });
    await this.tungguTabelSiap();
  }

  // Tabel masih berupa skeleton saat halaman baru dibuka. Isi filter sebelum data siap
  // akan terhapus saat Angular me-render ulang, jadi tunggu sampai ada data dulu.
  async tungguTabelSiap() {
    await expect(this.page.getByText(/Menampilkan \d+ sampai [1-9]\d* dari [1-9][\d.,]*/).first()).toBeVisible({
      timeout: 30_000,
    });
  }

  // Isi kolom teks dan pastikan nilainya tidak terhapus oleh render ulang
  async isiTeks(kolom, nilai) {
    // Diketik per karakter (bukan fill) agar event keyboard terkirim ke komponen input Angular
    await expect(async () => {
      await kolom.click();
      await kolom.clear();
      await kolom.pressSequentially(nilai, { delay: 30 });
      await expect(kolom).toHaveValue(nilai, { timeout: 1_000 });
    }).toPass({ timeout: 15_000 });
  }

  tabel() {
    return this.page.getByRole('table');
  }

  barisData() {
    return this.tabel()
      .getByRole('row')
      .filter({ has: this.page.getByRole('cell') })
      .filter({ hasNotText: /tidak ada data/i });
  }

  async tungguData() {
    await this.page.waitForLoadState('networkidle');
  }

  // Label filter tidak terhubung ke input, jadi dicari lewat elemen setelah label
  area(label) {
    return this.page.getByText(label, { exact: true }).first().locator('xpath=following-sibling::*[1]');
  }

  kolomTeks(label) {
    return this.area(label).locator('xpath=self::input | .//input').first();
  }

  dropdown(label) {
    return this.area(label).getByRole('combobox');
  }

  async pilihOpsi(label, opsi) {
    await this.dropdown(label).click();
    await this.page.getByRole('option', { name: opsi, exact: true }).click();
  }

  async teksOpsiDropdown(label) {
    await this.dropdown(label).click();
    const opsi = this.page.getByRole('option');
    // daftar opsi sempat berisi "Tidak ada data" selama masih dimuat
    await expect.poll(async () => (await opsi.allInnerTexts()).filter((o) => !/tidak ada data/i.test(o)).length).toBeGreaterThan(0);
    return opsi.allInnerTexts();
  }

  async klikTerapkan() {
    // aplikasi memperbarui URL (query string) saat filter diterapkan, tunggu itu dulu
    const sebelum = this.page.url();
    await this.page.getByRole('button', { name: 'Terapkan' }).click();
    await this.page.waitForURL((url) => url.href !== sebelum, { timeout: 5_000 }).catch(() => {});
    await this.tungguData();
  }

  async klikRefreshSync() {
    await this.page.getByRole('button', { name: 'Refresh Sync' }).click();
    await this.tungguData();
  }

  tombolRefreshSync() {
    return this.page.getByRole('button', { name: 'Refresh Sync' });
  }

  tombolExport() {
    return this.page.getByRole('button', { name: 'Export Excel' });
  }

  async exportExcel() {
    const unduhan = this.page.waitForEvent('download');
    await this.tombolExport().click();
    return unduhan;
  }

  infoData() {
    return this.page.getByText(/Menampilkan \d+ sampai \d+ dari [\d.,]+ data/).first();
  }

  infoRentang(awal, akhir) {
    return this.page.getByText(new RegExp('Menampilkan ' + awal + ' sampai ' + akhir + ' dari [\\d.,]+ data')).first();
  }

  infoSatuData() {
    return this.page.getByText('Menampilkan 1 sampai 1 dari 1 data').first();
  }

  async totalData() {
    const teks = await this.infoData().innerText();
    return Number(teks.match(/dari ([\d.,]+) data/)[1].replace(/[.,]/g, ''));
  }

  paginasi() {
    return this.page.getByRole('navigation', { name: 'Pagination' });
  }

  tombolSebelumnya() {
    return this.paginasi().getByRole('button', { name: 'Halaman sebelumnya' });
  }

  async klikHalaman(nomor) {
    await this.paginasi().getByRole('button', { name: String(nomor), exact: true }).click();
    await this.tungguData();
  }

  async klikNext() {
    await this.paginasi().getByRole('button', { name: 'Halaman berikutnya' }).click();
    await this.tungguData();
  }

  async klikPrevious() {
    await this.tombolSebelumnya().click();
    await this.tungguData();
  }

  keadaanKosong() {
    return this.page.getByText(/tidak ada data|data tidak tersedia|tidak tersedia/i).first();
  }

  // Isi satu kolom pada semua baris. Indeks 0 adalah kolom No.
  async isiSel(indeks) {
    return this.barisData().evaluateAll(
      (baris, i) => baris.map((b) => b.querySelectorAll('td')[i]?.innerText.trim() ?? ''),
      indeks
    );
  }
}
