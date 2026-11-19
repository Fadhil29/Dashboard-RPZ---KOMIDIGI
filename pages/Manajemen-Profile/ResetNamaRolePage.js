export class ResetNamaRolePage {
  constructor(page) {
    this.page = page;
  }

  judul(nama) {
    return this.page.getByRole('heading', { name: nama });
  }

  kolomCari() {
    return this.page.getByRole('textbox', { name: 'Nama / email...' });
  }

  filterRole() {
    return this.page.getByRole('combobox', { name: 'Semua' });
  }

  selTabel(nama) {
    return this.page.getByRole('cell', { name: nama, exact: true });
  }

  async bukaMenuManajemenPengguna() {
    await this.page.getByRole('link', { name: 'Manajemen Pengguna' }).click();
  }

  async isiPencarian(teks) {
    const kolom = this.kolomCari();
    await kolom.click();
    await kolom.press('ControlOrMeta+a');
    await kolom.pressSequentially(teks);
  }

  async pilihRole(role) {
    await this.filterRole().click();
    await this.page.getByRole('option', { name: role, exact: true }).click();
  }

  async klikTerapkan() {
    await this.page.getByRole('button', { name: 'Terapkan' }).click();
  }

  async klikReset() {
    await this.page.getByRole('button', { name: 'Reset' }).click();
  }
}