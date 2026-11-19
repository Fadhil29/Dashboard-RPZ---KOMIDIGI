export class SearchPenggunaNamaPage {
  constructor(page) {
    this.page = page;
  }

  judul(teks) {
    return this.page.getByRole('heading', { name: teks });
  }

 async bukaMenuManajemenPengguna() {
  const menu = this.page.getByRole('link', { name: 'Manajemen Pengguna', exact: true });
  try {
    await menu.waitFor({ state: 'visible', timeout: 15_000 });
  } catch (e) {
    console.log('URL saat gagal:', this.page.url());
    const isi = await this.page.locator('body').innerText();
    console.log('Isi halaman:', isi.slice(0, 500));
    throw e;
  }
  await menu.click();
  await this.page.waitForURL('**/manajemen-pengguna');
}

  kolomCari() {
    return this.page.getByRole('textbox', { name: 'Nama / email...' });
  }

  async isiPencarian(keyword) {
    const kolom = this.kolomCari();
    await kolom.click();
    await kolom.clear();
    await kolom.pressSequentially(keyword);
  }

  async klikTerapkan() {
    // Tunggu request data selesai supaya tabel tidak dibaca saat masih data lama
    const responsData = this.page.waitForResponse((r) => {
      const tipe = r.request().resourceType();
      return (tipe === 'fetch' || tipe === 'xhr') && r.ok();
    });
    await this.page.getByRole('button', { name: 'Terapkan' }).click();
    await responsData;
  }

  selTabel(keyword) {
    return this.page.getByRole('row', { name: keyword });
  }
}