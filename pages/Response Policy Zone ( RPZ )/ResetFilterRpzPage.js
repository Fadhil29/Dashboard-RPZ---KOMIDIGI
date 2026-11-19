export class ResetFilterRpzPage {
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
    return this.page.getByText('Total IP', { exact: true }).locator('xpath=following-sibling::*[1]');
  }

  // Combobox filter dengan nama default (Metode dan Provinsi), ISP bernama "Semua ISP"
  comboboxDefault(nama) {
    return this.page.getByRole('combobox', { name: nama, exact: true });
  }

  async teksTotalIp() {
    return (await this.totalIp().textContent()).trim();
  }

  async pilihProvinsi(provinsiDefault, provinsi) {
    // Provinsi adalah combobox default terakhir di baris filter
    await this.comboboxDefault(provinsiDefault).last().click();
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