export class FilterRtbhProvinsiPage {
  constructor(page) {
    this.page = page;
  }

  judul(nama) {
    return this.page.getByRole('heading', { name: nama });
  }

  tabel() {
    return this.page.getByRole('table');
  }

  provinsiTerpilih(provinsi) {
    return this.page.getByRole('combobox', { name: provinsi, exact: true });
  }

  async bukaRtbh() {
    await this.page.getByRole('link', { name: 'RTBH', exact: true }).click();
  }

  async pilihProvinsi(provinsi) {
    // Provinsi adalah combobox "Semua" terakhir di baris filter (Status juga bernama "Semua")
    await this.page.getByRole('combobox', { name: 'Semua', exact: true }).last().click();
    const kolomCari = this.page.getByRole('searchbox', { name: 'Cari...' });
    await kolomCari.fill(provinsi);
    await this.page.getByRole('option', { name: provinsi, exact: true }).click();
    // Tunggu dropdown benar-benar tertutup sebelum lanjut
    await kolomCari.waitFor({ state: 'hidden' });
  }

  async klikTerapkan() {
    // Daftarkan penunggu respons sebelum klik supaya tidak terlewat
    const responsData = this.page.waitForResponse((r) => {
      const tipe = r.request().resourceType();
      return (tipe === 'fetch' || tipe === 'xhr') && r.ok();
    });
    await this.page.getByRole('button', { name: 'Terapkan' }).click();
    await responsData;
  }
}