export class HapusPenggunaPage {
  constructor(page) {
    this.page = page;
  }

  judul(nama) {
    return this.page.getByRole('heading', { name: nama });
  }

  barisTabel(nama) {
    return this.page.getByRole('row', { name: nama });
  }

  async bukaMenuManajemenPengguna() {
    await this.page.getByRole('link', { name: 'Manajemen Pengguna' }).click();
  }

  async klikHapus(nama) {
    await this.barisTabel(nama).getByRole('button', { name: 'Hapus' }).click();
  }

  async konfirmasiHapus() {
    await this.page.getByRole('dialog').getByRole('button', { name: 'Hapus' }).click();
  }

  async klikMengerti() {
    await this.page.getByRole('button', { name: 'Mengerti' }).click();
  }
}