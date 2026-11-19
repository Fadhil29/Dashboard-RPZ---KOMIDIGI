export class FilterRpzSeluruhPage {
  constructor(page) {
    this.page = page;
  }

  judul(nama) {
    return this.page.getByRole('heading', { name: nama });
  }

  tabel() {
    return this.page.getByRole('table');
  }

  kolomIp() {
    return this.page.getByRole('textbox', { name: '103.x.x.x' });
  }

  kolomMetode() {
    return this.page
      .getByText('Metode', { exact: true })
      .locator('xpath=following::*[@role="combobox"][1]');
  }

  kalender() {
    return this.page.getByRole('dialog', { name: 'Choose Date' });
  }

  async klikReset() {
    await this.page.getByRole('button', { name: 'Reset' }).click();
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

  async pilihTanggalDari(bulan, tanggal) {
    await this.page.getByRole('combobox', { name: 'Dari Tanggal' }).click();
    await this.pilihTanggal(bulan, tanggal);
  }

  async pilihTanggalSampai(bulan, tanggal) {
    await this.page.getByRole('combobox', { name: 'Sampai Tanggal' }).click();
    await this.pilihTanggal(bulan, tanggal);
  }

  async pilihIsp(namaIsp) {
    await this.page.locator('#ISP').click();
    await this.page.getByRole('searchbox', { name: 'Cari...' }).fill(namaIsp);
    await this.page.getByRole('option', { name: namaIsp, exact: true }).click();
  }

  async isiIpAddress(ip) {
    await this.kolomIp().click();
    await this.kolomIp().clear();
    await this.kolomIp().pressSequentially(ip);
  }

  async pilihMetode(metode) {
    await this.kolomMetode().click();
    await this.page.getByRole('option', { name: metode, exact: true }).click();
  }

  async pilihProvinsi(provinsi) {
    await this.page.locator('#Provinsi').click();
    await this.page.getByRole('option', { name: provinsi, exact: true }).click();
  }

  async klikTerapkan() {
    await this.page.getByRole('button', { name: 'Terapkan' }).click();
  }
}