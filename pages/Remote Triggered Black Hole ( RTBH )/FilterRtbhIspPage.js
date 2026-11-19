export class FilterRtbhIspPage {
  constructor(page) {
    this.page = page;
  }

  judul(nama) {
    return this.page.getByRole('heading', { name: nama });
  }

  tabel() {
    return this.page.getByRole('table');
  }

  async bukaRtbh() {
    await this.page.getByRole('link', { name: 'RTBH', exact: true }).click();
  }

    async pilihIsp(namaIsp) {
    await this.page.getByRole('combobox', { name: 'ISP' }).click();
    await this.page.getByRole('searchbox', { name: 'Cari...' }).fill(namaIsp);
    await this.page.getByRole('option', { name: namaIsp, exact: true }).click();
  }

  async klikTerapkan() {
    await this.page.getByRole('button', { name: 'Terapkan' }).click();
  }
}