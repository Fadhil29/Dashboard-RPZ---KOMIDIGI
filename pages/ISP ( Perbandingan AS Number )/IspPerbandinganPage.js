import { expect } from '@playwright/test';
import { IspBasePage } from '../ISP/IspBasePage.js';

// Dugaan urutan kolom (belum diverifikasi dari tampilan): No, AS Penapisan, ISP Penapisan,
// AS RTBH, ISP RTBH, IP RTBH, Status. Sesuaikan KOLOM bila hasil run menunjukkan lain.
const KOLOM = { asnPenapisan: 1, ispPenapisan: 2, asnRtbh: 3, ispRtbh: 4, ipRtbh: 5, status: 6 };

export class IspPerbandinganPage extends IspBasePage {
  async bukaPerbandingan() {
    await this.bukaMenuIsp('Perbandingan AS Number', /\/isp\/perbandingan-as-number/);
  }

  kolomCariAsnIsp() {
    return this.page.getByRole('textbox', { name: /ISP \/ ASN \/ IP Address/ });
  }

  // Filter IP Address sudah digabung ke kolom Cari (ISP / ASN / IP Address)
  kolomIpAddress() {
    return this.kolomCariAsnIsp();
  }

  dropdownStatus() {
    return this.dropdown('Status Kecocokan');
  }

  async isiCariAsnIsp(nilai) {
    await this.isiTeks(this.kolomCariAsnIsp(), nilai);
  }

  async isiIpAddress(nilai) {
    await this.isiTeks(this.kolomIpAddress(), nilai);
  }

  async pilihStatus(status) {
    await this.pilihOpsi('Status Kecocokan', status);
  }

  async opsiStatus() {
    return this.teksOpsiDropdown('Status Kecocokan');
  }

  // Angka pada kartu ringkasan (Cocok, Tidak Cocok, Tidak Ditemukan)
  async nilaiKartu(label) {
    // label ada di dalam paragraf, angkanya di paragraf berikutnya
    const angka = this.page.getByText(label, { exact: true }).first().locator('xpath=../following-sibling::p[1]');
    return Number((await angka.innerText()).replace(/\D/g, ''));
  }

  async jumlahKartu() {
    const cocok = await this.nilaiKartu('Cocok');
    const tidakCocok = await this.nilaiKartu('Tidak Cocok');
    const tidakDitemukan = await this.nilaiKartu('Tidak Ditemukan');
    const tidakTerdaftar = await this.nilaiKartu('Tidak Terdaftar');
    return cocok + tidakCocok + tidakDitemukan + tidakTerdaftar;
  }

  // Angka kartu berjalan naik saat halaman dimuat, jadi ditunggu sampai sama dengan total tabel
  async pastikanKartuSamaDenganTotal() {
    const total = await this.totalData();
    await expect.poll(() => this.jumlahKartu(), { timeout: 15_000 }).toBe(total);
  }

  // nama kolom: asnPenapisan, ispPenapisan, asnRtbh, ispRtbh, ipRtbh, status
  async isiKolom(nama) {
    return this.isiSel(KOLOM[nama]);
  }

  baris(teks) {
    return this.barisData().filter({ hasText: teks });
  }
}
