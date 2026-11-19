export class EditPasswordBaruPage {
  constructor(page) {
    this.page = page;
  }

  judul(nama) {
    return this.page.getByRole('heading', { name: nama });
  }

  barisTabel(nama) {
    return this.page.getByRole('row', { name: nama });
  }

  kolomPasswordBaru() {
    return this.page
      .locator('input-text')
      .filter({ hasText: /^\s*Password Baru/ })
      .getByRole('textbox');
  }

  kolomKonfirmasiPassword() {
    return this.page
      .locator('input-text')
      .filter({ hasText: 'Konfirmasi Password Baru' })
      .getByRole('textbox');
  }

  async bukaMenuManajemenPengguna() {
    await this.page.getByRole('link', { name: 'Manajemen Pengguna' }).click();
  }

  async klikEdit(nama) {
    await this.barisTabel(nama).getByRole('button', { name: 'Edit' }).click();
  }

  async isiPasswordBaru(password) {
    const kolomPassword = this.kolomPasswordBaru();
    await kolomPassword.click();
    await kolomPassword.pressSequentially(password);

    const kolomKonfirmasi = this.kolomKonfirmasiPassword();
    await kolomKonfirmasi.click();
    await kolomKonfirmasi.pressSequentially(password);
  }

  async klikSimpan() {
    await this.page.getByRole('button', { name: 'Simpan' }).click();
  }

  async konfirmasiSimpan() {
    await this.page.getByRole('dialog').getByRole('button', { name: 'Simpan' }).click();
  }

  async klikMengerti() {
    await this.page.getByRole('dialog').getByRole('button', { name: 'Mengerti' }).click();
  }

  async klikKeluar() {
    await this.page.getByRole('button', { name: 'Keluar' }).click();
  }

  async konfirmasiKeluar() {
    await this.page.getByRole('dialog').getByRole('button', { name: 'Keluar' }).click();
  }
}