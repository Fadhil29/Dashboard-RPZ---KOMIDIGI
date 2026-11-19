export class UpdateNamaProfilPage {
  constructor(page) {
    this.page = page;
  }

  judul(nama) {
    return this.page.getByRole('heading', { name: nama });
  }

  kolomNama() {
    return this.page.locator('input[type="text"]');
  }

  async bukaProfil() {
    await this.page.getByRole('link', { name: 'Profil' }).click();
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
    await this.page.getByRole('button', { name: 'Mengerti' }).click();
  }

  async muatUlangProfil() {
    await this.page.goto('/profile');
  }
}