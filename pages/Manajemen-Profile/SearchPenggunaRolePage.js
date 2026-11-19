export class SearchPenggunaRolePage {
  constructor(page) {
    this.page = page;
  }

  judul(nama) {
    return this.page.getByRole('heading', { name: nama });
  }

  filterRole() {
    return this.page.getByRole('combobox', { name: 'Semua' });
  }

  selRole(role) {
    return this.page.getByRole('cell', { name: role, exact: true });
  }

  async bukaMenuManajemenPengguna() {
    await this.page.getByRole('link', { name: 'Manajemen Pengguna' }).click();
  }

  async pilihRole(role) {
    await this.filterRole().click();
    await this.page.getByRole('option', { name: role, exact: true }).click();
  }

  async klikTerapkan() {
    await this.page.getByRole('button', { name: 'Terapkan' }).click();
  }
}