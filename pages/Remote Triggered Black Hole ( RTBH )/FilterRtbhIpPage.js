export class FilterRtbhIpPage {
  constructor(page) {
    this.page = page;
  }

  judul(nama) {
    return this.page.getByRole('heading', { name: nama });
  }

  tabel() {
    return this.page.getByRole('table');
  }

  kolomIp() {
    return this.page.getByRole('textbox', { name: '103.x.x.x' });
  }

  // Penanda data awal tabel sudah termuat
  infoData() {
    return this.page.getByText(/Menampilkan 1 sampai/);
  }

  async bukaRtbh() {
    await this.page.getByRole('link', { name: 'RTBH', exact: true }).click();
  }

  async isiIpAddress(ip) {
    await this.kolomIp().click();
    await this.kolomIp().clear();
    await this.kolomIp().pressSequentially(ip);
  }

  async klikTerapkan() {
    await this.page.getByRole('button', { name: 'Terapkan' }).click();
  }
}