export class ValidasiDataDashboardRtbhPage {
  constructor(page) {
    this.page = page;
  }

  judul(nama, opsi = {}) {
    return this.page.getByRole('heading', { name: nama, ...opsi });
  }

  // Label kartu ringkasan (Total ISP, Total IP, dst.)
  label(nama) {
    return this.page.getByText(nama, { exact: true });
  }

  async bukaRtbh() {
    await this.page.getByRole('link', { name: 'RTBH', exact: true }).click();
  }
}