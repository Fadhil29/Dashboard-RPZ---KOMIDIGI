export class FilterRpzProvinsiPage {
  constructor(page) {
    this.page = page;
  }

  judul(nama) {
    return this.page.getByRole('heading', { name: nama });
  }

  tabel() {
    return this.page.getByRole('table');
  }

  async pilihProvinsi(provinsi) {
    await this.page.locator('#Provinsi').click();
    await this.page.getByRole('option', { name: provinsi, exact: true }).click();
  }

  async klikTerapkan() {
    await this.page.getByRole('button', { name: 'Terapkan' }).click();
  }
}