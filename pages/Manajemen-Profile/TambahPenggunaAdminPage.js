export class TambahPenggunaAdminPage {
  constructor(page) {
    this.page = page;
  }

  judul(nama) {
    return this.page.getByRole('heading', { name: nama });
  }

  selTabel(nama) {
    return this.page.getByRole('cell', { name: nama });
  }

  barisTabel(nama) {
    return this.page.getByRole('row', { name: nama });
  }

  async bukaMenuManajemenPengguna() {
    await this.page.getByRole('link', { name: 'Manajemen Pengguna' }).click();
  }

  async bukaFormTambah() {
    await this.page.getByRole('button', { name: 'Tambah Pengguna' }).click();
  }

  async isiFormPengguna({ nama, email, password }) {
    await this.page.getByRole('textbox', { name: 'Masukkan nama lengkap' }).fill(nama);
    await this.page.getByRole('textbox', { name: 'Masukkan email aktif' }).fill(email);
    await this.page.getByRole('textbox', { name: 'Masukkan password' }).fill(password);
    await this.page.getByRole('textbox', { name: 'Ulangi password' }).fill(password);
  }

  async pilihRole(role) {
    await this.page.getByRole('combobox', { name: 'Guest' }).click();
    await this.page.getByRole('option', { name: role }).click();
  }

  async klikSimpan() {
    await this.page.getByRole('button', { name: 'Simpan' }).click();
  }

  async klikMengerti() {
    await this.page.getByRole('dialog').getByRole('button', { name: 'Mengerti' }).click();
  }

  async konfirmasiSimpan() {
    await this.page.getByRole('dialog').getByRole('button', { name: 'Simpan' }).click();
  }
}