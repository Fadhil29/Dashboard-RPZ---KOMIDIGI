export class FilterRpzIpPage {
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

  async isiIpAddress(ip) {
    await this.kolomIp().click();
    await this.kolomIp().clear();
    await this.kolomIp().pressSequentially(ip);
  }

  async klikTerapkan() {
    await this.page.getByRole('button', { name: 'Terapkan' }).click();
  }
}