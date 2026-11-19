export class PaginationPenggunaPage {
  constructor(page) {
    this.page = page;
  }

  judul(nama, { exact = false } = {}) {
    return this.page.getByRole('heading', { name: nama, exact });
  }

  infoData(awal, akhir) {
    return this.page.getByText(new RegExp('Menampilkan ' + awal + ' sampai ' + akhir + ' dari'));
  }

  paginasi() {
    return this.page.getByRole('navigation', { name: 'Pagination' });
  }

  async bukaMenuManajemenPengguna() {
    await this.page.getByRole('link', { name: 'Manajemen Pengguna', exact: true }).click();
  }

  async klikHalaman(nomor) {
    await this.paginasi().getByRole('button', { name: String(nomor), exact: true }).click();
  }

  async klikSebelumnya() {
    await this.paginasi().getByRole('button', { name: 'Halaman sebelumnya' }).click();
  }

  async klikBerikutnya() {
    await this.paginasi().getByRole('button', { name: 'Halaman berikutnya' }).click();
  }

  async klikPertama() {
    await this.paginasi().getByRole('button', { name: 'Halaman pertama' }).click();
  }
}