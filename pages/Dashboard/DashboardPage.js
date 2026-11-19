export class DashboardPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/');
  }

  judul(teks) {
    return this.page.getByRole('heading', { name: teks, exact: true });
  }

  tombolKeluar() {
    return this.page.getByRole('button', { name: 'Keluar' });
  }
}