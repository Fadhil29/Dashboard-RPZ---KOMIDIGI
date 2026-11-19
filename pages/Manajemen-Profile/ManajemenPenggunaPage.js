export class ManajemenPenggunaPage {
  constructor(page) {
    this.page = page;
  }

  menuLink(nama) {
    return this.page.getByRole('link', { name: nama });
  }

  async bukaMenu(nama) {
    await this.menuLink(nama).click();
  }

  judul(nama) {
    return this.page.getByRole('heading', { name: nama });
  }
}