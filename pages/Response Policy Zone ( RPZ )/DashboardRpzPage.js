export class DashboardRpzPage {
  constructor(page) {
    this.page = page;
  }

  judul(nama, { exact = false } = {}) {
    return this.page.getByRole('heading', { name: nama, exact });
  }

  teks(isi) {
    return this.page.getByText(isi);
  }

  async bukaRpz() {
    await this.page.getByRole('link', { name: 'RPZ', exact: true }).click();
  }
}