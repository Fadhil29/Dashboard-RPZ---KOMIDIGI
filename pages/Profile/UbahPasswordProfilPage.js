export class UbahPasswordProfilPage {
  constructor(page) {
    this.page = page;
  }

  judul(teks) {
    return this.page.getByRole('heading', { name: teks });
  }

  // Label tidak terhubung ke input, jadi kolom dicari lewat komponen input-text yang memuat teks label
  kolom(label) {
    return this.page.locator('input-text').filter({ hasText: label }).getByRole('textbox');
  }

  // fill() tidak terbaca oleh komponen, jadi diketik lewat event keyboard
  async isiKolom(label, nilai) {
    const kolom = this.kolom(label);
    await kolom.click();
    await kolom.pressSequentially(nilai);
    await kolom.press('Tab');
  }

  async bukaProfil() {
    await this.page.getByRole('link', { name: 'Profil' }).click();
  }

  async isiPasswordSaatIni(password) {
    await this.isiKolom('Password saat ini', password);
  }

  async isiPasswordBaru(password) {
    await this.isiKolom('Password baru', password);
  }

  async isiKonfirmasiPassword(password) {
    await this.isiKolom('Konfirmasi password', password);
  }

  async klikPerbaruiPassword() {
    await this.page.getByRole('button', { name: 'Perbarui Password' }).click();
  }

  // Setelah password diubah aplikasi menampilkan dialog dan meminta login ulang
  async klikMasukKembali() {
    await this.page.getByRole('dialog').getByRole('button', { name: 'Masuk Kembali' }).click();
  }

  async keluar() {
    await this.page.getByRole('button', { name: 'Keluar' }).click();
    await this.page.getByRole('dialog').getByRole('button', { name: 'Keluar' }).click();
  }
}