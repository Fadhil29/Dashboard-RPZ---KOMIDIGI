export class FilterRpzIspPage {
  constructor(page) {
    this.page = page;
  }

  judul(nama) {
    return this.page.getByRole('heading', { name: nama });
  }

  tabel() {
    return this.page.getByRole('table');
  }

  async pilihIsp(namaIsp) {
    await this.page.getByRole('combobox', { name: 'ISP' }).click();
    await this.page.getByRole('option', { name: namaIsp }).click();
  }

  async klikTerapkan() {
    await this.page.getByRole('button', { name: 'Terapkan' }).click();
  }
}