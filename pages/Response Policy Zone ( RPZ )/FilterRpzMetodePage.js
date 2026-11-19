export class FilterRpzMetodePage {
  constructor(page) {
    this.page = page;
  }

  judul(nama) {
    return this.page.getByRole('heading', { name: nama });
  }

  tabel() {
    return this.page.getByRole('table');
  }

  kolomMetode() {
    return this.page
      .getByText('Metode', { exact: true })
      .locator('xpath=following::*[@role="combobox"][1]');
  }

  async pilihMetode(metode) {
    await this.kolomMetode().click();
    await this.page.getByRole('option', { name: metode, exact: true }).click();
  }

  async klikTerapkan() {
    await this.page.getByRole('button', { name: 'Terapkan' }).click();
  }
}