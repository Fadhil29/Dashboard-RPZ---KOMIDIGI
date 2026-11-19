export class LoginPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/login');
  }

  async isiEmail(email) {
    await this.page.getByRole('textbox', { name: 'nama@komdigi.go.id' }).fill(email);
  }

  async isiPassword(password) {
    await this.page.getByRole('textbox', { name: '••••••••' }).fill(password);
  }

  async klikMasuk() {
    await this.page.getByRole('button', { name: 'Masuk' }).click();
  }

  // Pakai sesi dari globalSetup (.auth). Login lewat UI hanya bila sesi tidak valid.
  async pastikanMasuk(email, password) {
    await this.page.goto('/dashboard');
    const dashboard = this.page.getByRole('heading', { name: 'Dashboard', exact: true });
    const formLogin = this.page.getByRole('textbox', { name: 'nama@komdigi.go.id' });
    await dashboard.or(formLogin).waitFor({ timeout: 30_000 });
    if (await formLogin.isVisible()) {
      await this.masukDenganUlang(email, password);
    }
  }

  // Login dengan ulang otomatis bila server menolak (mis. too many requests)
  async masukDenganUlang(email, password, { percobaan = 3 } = {}) {
    for (let i = 1; i <= percobaan; i++) {
      await this.goto();
      await this.isiEmail(email);
      await this.isiPassword(password);
      await this.klikMasuk();
      try {
        await this.page.waitForURL(/\/dashboard/, { timeout: 15_000 });
        return;
      } catch {
        // jeda bertahap sebelum mencoba lagi agar tidak kena rate limit
        await new Promise((selesai) => setTimeout(selesai, 5_000 * i));
      }
    }
  }
}