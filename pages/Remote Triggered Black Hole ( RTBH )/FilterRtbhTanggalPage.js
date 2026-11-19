export class FilterRtbhTanggalPage {
  constructor(page) {
    this.page = page;
  }

  judul(nama) {
    return this.page.getByRole('heading', { name: nama });
  }

  tabel() {
    return this.page.getByRole('table');
  }

  kalender() {
    return this.page.getByRole('dialog', { name: 'Choose Date' });
  }

  // Penanda data awal tabel sudah termuat
  infoData() {
    return this.page.getByText(/Menampilkan 1 sampai/);
  }

  async bukaRtbh() {
    await this.page.getByRole('link', { name: 'RTBH', exact: true }).click();
  }

  async pilihTanggalDari(bulan, tanggal) {
    await this.page.getByRole('combobox', { name: 'Dari Tanggal' }).click();
    await this.pilihTanggal(bulan, tanggal);
  }

  async pilihTanggalSampai(bulan, tanggal) {
    await this.page.getByRole('combobox', { name: 'Sampai Tanggal' }).click();
    await this.pilihTanggal(bulan, tanggal);
  }

  async pilihTanggal(bulan, tanggal) {
    const kalender = this.kalender();
    await kalender.getByRole('button', { name: 'Choose Month' }).click();
    await kalender.getByText(bulan, { exact: true }).click();
    // Tanggal 1-15 muncul lagi di akhir grid (bulan berikutnya), tanggal 16+ di awal grid (bulan sebelumnya)
    const sel = kalender.getByRole('gridcell', { name: tanggal, exact: true });
    await (Number(tanggal) > 15 ? sel.last() : sel.first()).click();
    // Tunggu kalender tertutup supaya tidak bentrok dengan kalender berikutnya
    await kalender.waitFor({ state: 'hidden' });
  }

  async klikTerapkan() {
    await this.page.getByRole('button', { name: 'Terapkan' }).click();
  }
}