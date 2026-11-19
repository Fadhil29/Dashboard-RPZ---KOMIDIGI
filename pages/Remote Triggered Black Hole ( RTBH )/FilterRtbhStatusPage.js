export class FilterRtbhStatusPage {
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

  async pilihStatus(status) {
    // Nama combobox berubah mengikuti pilihan (Semua / Established / Passive)
    await this.page.getByRole('combobox', { name: /^(Semua|Established|Passive)$/ }).first().click();
    await this.page.getByRole('option', { name: status, exact: true }).click();
  }

  async klikTerapkan() {
    await this.page.getByRole('button', { name: 'Terapkan' }).click();
  }
}