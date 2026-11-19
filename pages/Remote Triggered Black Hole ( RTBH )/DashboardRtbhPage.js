export class DashboardRtbhPage {
  constructor(page) {
    this.page = page;
  }

  judul(nama, { exact = false } = {}) {
    return this.page.getByRole('heading', { name: nama, exact });
  }

  teks(isi) {
    return this.page.getByText(isi);
  }

  async bukaRtbh() {
    await this.page.getByRole('link', { name: 'RTBH', exact: true }).click();
  }
}