export class TambahPenggunaPage {
  constructor(page) {
    this.page = page;
  }

  async bukaMenuManajemenPengguna() {
    await this.page.getByRole('link', { name: 'Manajemen Pengguna' }).click();
  }

  judul(nama) {
    return this.page.getByRole('heading', { name: nama });
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

  async klikSimpan() {
    await this.page.getByRole('button', { name: 'Simpan' }).click();
  }

  async klikMengerti() {
    await this.page.getByRole('dialog').getByRole('button', { name: 'Mengerti' }).click();
  }

  async konfirmasiSimpan() {
    await this.page.getByRole('dialog').getByRole('button', { name: 'Simpan' }).click();
  }

  selTabel(nama) {
    return this.page.getByRole('cell', { name: nama });
  }
}