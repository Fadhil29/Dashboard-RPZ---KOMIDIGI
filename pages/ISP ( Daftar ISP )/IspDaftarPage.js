import { IspBasePage } from '../ISP/IspBasePage.js';

// Urutan kolom tabel: No, Nama ISP, AS Number, Kota/Kab, Provinsi, Layanan, Status, IP Address
const KOLOM = { nama: 1, asn: 2, kota: 3, provinsi: 4, layanan: 5, status: 6 };

export class IspDaftarPage extends IspBasePage {
  async bukaDaftarIsp() {
    await this.bukaMenuIsp('Daftar ISP', /\/isp\/daftar-isp/);
  }

  kolomCariNama() {
    return this.page.getByRole('textbox', { name: /ISP \/ ASN \/ IP Address/ });
  }

  async isiCariNama(nilai) {
    await this.isiTeks(this.kolomCariNama(), nilai);
  }

  dropdownProvinsi() {
    return this.dropdown('Provinsi');
  }

  async pilihProvinsi(provinsi) {
    await this.pilihOpsi('Provinsi', provinsi);
  }

  async cariIsp(nilai) {
    await this.isiCariNama(nilai);
    await this.klikTerapkan();
  }

  async opsiProvinsi() {
    return this.teksOpsiDropdown('Provinsi');
  }

  // nama kolom: nama, asn, kota, provinsi, layanan, status
  async isiKolom(nama) {
    return this.isiSel(KOLOM[nama]);
  }
}
