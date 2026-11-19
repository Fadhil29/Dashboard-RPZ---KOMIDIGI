export class EditPenggunaGuestPage {
  constructor(page) {
    this.page = page;
  }

  judul(nama) {
    return this.page.getByRole('heading', { name: nama });
  }

  kolomNama() {
    return this.page.getByRole('textbox', { name: 'Masukkan nama lengkap' });
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

  async klikEdit(nama) {
    await this.barisTabel(nama).getByRole('button', { name: 'Edit' }).click();
  }

  async ubahNama(namaBaru) {
    const kolom = this.kolomNama();
    await kolom.click();
    await kolom.press('ControlOrMeta+a');
    await kolom.pressSequentially(namaBaru);
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