export class ResetFilterRtbhPage {
  constructor(page) {
    this.page = page;
  }

  judul(nama, opsi = {}) {
    return this.page.getByRole('heading', { name: nama, ...opsi });
  }

  tabel() {
    return this.page.getByRole('table');
  }

  totalIp() {
    return this.page.getByText('Total IP', { exact: true }).locator('..').getByRole('paragraph');
  }

  // Combobox bernama "Semua": Status dan Provinsi (ISP bernama "Semua ISP")
  comboboxSemua() {
    return this.page.getByRole('combobox', { name: 'Semua', exact: true });
  }

  async bukaRtbh() {
    await this.page.getByRole('link', { name: 'RTBH', exact: true }).click();
  }

  async teksTotalIp() {
    return (await this.totalIp().textContent()).trim();
  }

  async pilihProvinsi(provinsi) {
    // Provinsi adalah combobox "Semua" terakhir di baris filter
    await this.comboboxSemua().last().click();
    await this.page.getByRole('searchbox', { name: 'Cari...' }).fill(provinsi);
    await this.page.getByRole('option', { name: provinsi, exact: true }).click();
  }

  async klikTerapkan() {
    await this.page.getByRole('button', { name: 'Terapkan' }).click();
  }

  async klikReset() {
    await this.page.getByRole('button', { name: 'Reset' }).click();
  }
}