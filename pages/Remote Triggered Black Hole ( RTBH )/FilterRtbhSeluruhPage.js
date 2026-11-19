export class FilterRtbhSeluruhPage {
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

  kolomIp() {
    return this.page.getByRole('textbox', { name: '103.x.x.x' });
  }

  kotakCari() {
    return this.page.getByRole('searchbox', { name: 'Cari...' });
  }

  // Penanda data awal tabel sudah termuat
  infoData() {
    return this.page.getByText(/Menampilkan 1 sampai/);
  }

  async bukaRtbh() {
    await this.page.getByRole('link', { name: 'RTBH', exact: true }).click();
  }

  async klikReset() {
    await this.page.getByRole('button', { name: 'Reset' }).click();
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

  async pilihIsp(namaIsp) {
    await this.page.getByRole('combobox', { name: 'ISP' }).click();
    await this.kotakCari().pressSequentially(namaIsp);
    await this.page.getByRole('option', { name: namaIsp, exact: true }).click();
    // Tunggu dropdown tertutup supaya tidak bentrok dengan dropdown berikutnya
    await this.kotakCari().waitFor({ state: 'hidden' });
  }

  async isiIpAddress(ipAddress) {
    await this.kolomIp().click();
    await this.kolomIp().clear();
    await this.kolomIp().pressSequentially(ipAddress);
  }

  async pilihStatus(status) {
    // Nama combobox berubah mengikuti pilihan (Semua / Established / Passive)
    await this.page.getByRole('combobox', { name: /^(Semua|Established|Passive)$/ }).first().click();
    await this.page.getByRole('option', { name: status, exact: true }).click();
    // Tunggu dropdown tertutup supaya tidak bentrok dengan dropdown berikutnya
    await this.kotakCari().waitFor({ state: 'hidden' });
  }

  async pilihProvinsi(provinsi) {
    // Provinsi adalah combobox "Semua" terakhir di baris filter
    await this.page.getByRole('combobox', { name: 'Semua', exact: true }).last().click();
    await this.kotakCari().pressSequentially(provinsi);
    await this.page.getByRole('option', { name: provinsi, exact: true }).click();
    await this.kotakCari().waitFor({ state: 'hidden' });
  }

  async klikTerapkan() {
    await this.page.getByRole('button', { name: 'Terapkan' }).click();
  }
}