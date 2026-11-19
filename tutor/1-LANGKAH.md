# Cara Membuat Test dari Rekaman

Ikuti urutan ini dari atas ke bawah. Setiap langkah ada contohnya.

---

## A. PERSIAPAN (sekali di awal project)

### Langkah 1: Buka project di VS Code
Project sudah dibuat oleh `npx pwunictive nama-project`. Buka foldernya di VS Code.
Kalau muncul tawaran "install extension Playwright", klik **Install**.

### Langkah 2: Isi file `.env`
Buka file `.env`, isi bagian yang kosong.

Contoh (aplikasi punya 2 role: admin dan user):
```
WEB_URL=https://staging.tokokita.com
ENV=dev
ROLES=admin,user

ADMIN_USERNAME=admin
ADMIN_PASSWORD=rahasia123
USER_USERNAME=budi
USER_PASSWORD=rahasia456
```

Penjelasan:
| Baris | Artinya | Cara tahu isinya |
|---|---|---|
| WEB_URL | alamat halaman login aplikasi | alamat di browser saat di halaman login |
| ENV | environment yang dites: `dev` atau `qa` | menentukan folder `data/dev` atau `data/qa` |
| ROLES | daftar role | huruf kecil, dipisah koma |
| NAMAROLE_USERNAME / _PASSWORD | akun tiap role | nama role HURUF BESAR |
| TOKEN_REPORTPORTAL dkk | ReportPortal (opsional) | kosongkan kalau tidak dipakai |

Mau tambah role "manager"? Ubah jadi `ROLES=admin,user,manager`, lalu tambahkan:
```
MANAGER_USERNAME=manager
MANAGER_PASSWORD=rahasia789
```
dan buat folder `tests/manager/`.

Aplikasi tanpa role? Tulis `ROLES=` (kosong), hapus folder contoh `tests/admin`, `tests/user`, `tests/public`, `tests/login-check`, lalu taruh test langsung di folder `tests/`.

### Langkah 3: Sesuaikan selector login
Buka `config/globalSetup.js`. Ada 4 bagian yang perlu disesuaikan dengan halaman login aplikasimu (ditandai komentar "Sesuaikan"): kolom username, kolom password, tombol login, dan teks yang muncul setelah login berhasil.

Cara paling mudah (pakai **Pick locator**):
1. Klik ikon labu (Testing) di sisi kiri VS Code.
2. Di panel **Playwright**, klik **Pick locator**.
3. Browser terbuka. Buka halaman login aplikasimu.
4. Arahkan mouse ke kolom username lalu klik. Hasilnya muncul di VS Code, misalnya `getByLabel('Email')`.
5. Copy hasilnya, ganti baris yang sesuai di `globalSetup.js`.
6. Ulangi untuk kolom password, tombol login, dan judul halaman setelah login.

Contoh sebelum (bawaan template):
```js
await page.getByRole('textbox', { name: 'Username' }).fill(username);
await page.getByRole('textbox', { name: 'Password' }).fill(password);
await page.getByRole('button', { name: 'Login' }).click();
await expect(page.getByRole('heading')).toContainText('Dashboard');
```
Contoh sesudah (kalau hasil Pick locator-nya `getByLabel('Email')`, `getByLabel('Kata sandi')`, tombol `Masuk`, dan judul halaman `Beranda`):
```js
await page.getByLabel('Email').fill(username);
await page.getByLabel('Kata sandi').fill(password);
await page.getByRole('button', { name: 'Masuk' }).click();
await expect(page.getByRole('heading')).toContainText('Beranda');
```
Yang diganti hanya bagian selector di depan dan teks di baris terakhir. `.fill(username)`, `.fill(password)`, dan `.click()` tetap di belakangnya.

Alternatif tanpa Pick locator: klik **Record new**, login sekali, lalu kirim hasil rekaman ke project AI dengan pesan: "Ganti 4 selector di config/globalSetup.js dengan selector dari rekaman ini. Nilai username dan password tetap pakai variabel username dan password."

### Langkah 4: Jalankan login (login-check)
1. Buka panel Testing (ikon labu).
2. Cari project `login-check`, klik tombol Play di sebelahnya.
Atau lewat terminal:
```
npm run setup
```
Berhasil kalau folder `.auth/` berisi file .json (contoh: `admin.json`, `user.json`) dan test `login-check` lolos.

Kalau gagal:
| Pesan | Artinya |
|---|---|
| `Login role "admin" gagal: ... waiting for locator` | Selector di `globalSetup.js` salah, ulangi Langkah 3 untuk elemen yang disebut |
| `Isi ADMIN_USERNAME dan ADMIN_PASSWORD` | Ada isi `.env` yang kosong |
| `expect(locator).toContainText(...) failed` | Login belum berhasil (akun salah) atau teks di baris terakhir tidak cocok dengan halaman setelah login |

Setiap login gagal menyimpan screenshot di `test-results/login-gagal-<role>.png`, buka untuk melihat halaman saat gagal.

### Langkah 5: Siapkan project AI (sekali saja)
Pakai fitur **Project** di AI yang dipakai tim (misalnya Claude Projects atau ChatGPT Projects), bukan chat biasa, supaya aturan tidak perlu dikirim ulang tiap flow.
1. Buat project baru, beri nama misalnya `Playwright nama-project`.
2. Isi kolom **Instructions** dengan isi file `tutor/2-INSTRUKSI-PROJECT-AI.md`.
3. Tambahkan ke **Knowledge/Files** project: semua file di folder `pages/` yang sudah ada (kalau masih kosong, lewati dulu).

---

## B. MEMBUAT TEST BARU (diulang untuk tiap flow)

### Langkah 6: Pilih project yang mau direkam
Di panel Playwright, bagian **Projects**, centang **satu** project saja, yaitu role + browser.
Contoh: mau merekam sebagai admin → centang `admin-chromium`, hilangkan centang lainnya.

### Langkah 7: Rekam
1. Klik **Record new**.
2. Browser terbuka dalam kondisi sudah login. Lakukan flow yang mau dites.
   Contoh flow "membuat order": buka menu Order → klik Tambah Order → isi nama → klik Simpan.
3. Tutup browser. Hasil rekaman masuk ke file spec baru.
4. Ganti nama file jadi nama flow yang unik dan taruh di folder role:
   `tests/admin/create-order.spec.js`

Kalau browser rekaman muncul di halaman login, berarti Langkah 4 belum berhasil atau project role belum dicentang.

Mau menambah langkah ke test yang sudah ada? Taruh kursor di baris tujuan, klik **Record at cursor**.

### Langkah 8: Kirim rekaman ke project AI
1. Buka project AI dari Langkah 5, buat **chat baru di dalam project itu**.
2. Kirim isi `tutor/3-PESAN-PER-FLOW.md` (isi bagian role dan nama flow).
3. Paste isi file rekaman (`tests/admin/create-order.spec.js`) di bawahnya.

Contoh isian:
```
Role: admin
Nama flow: membuat order
```

### Langkah 9: Taruh hasil AI ke template
AI akan memberi beberapa file, masing-masing dengan path-nya. Taruh sesuai path:

| Dari AI | Taruh di |
|---|---|
| `pages/OrderPage.js` | folder `pages/` |
| `data/dev/order.json` (dan `data/qa/order.json`) | folder `data/dev/` dan `data/qa/` |
| `tests/admin/create-order.spec.js` | timpa file rekaman mentah |

Kalau AI mengubah page object yang sudah ada, bandingkan dulu dengan versi lama sebelum menimpa.
Setelah itu **tambahkan file page baru ke Knowledge project AI**, supaya flow berikutnya memakainya ulang.

### Langkah 10: Jalankan dan review
1. Klik Play di sebelah file spec di panel Testing (pastikan project role yang benar tercentang).
2. Jalankan 2 kali berturut-turut, keduanya harus lolos.
3. Cek checklist di bawah.

---

## CHECKLIST REVIEW
- [ ] Spec tidak ada URL penuh (`https://...`), `nth()`, atau `waitForTimeout`
- [ ] Spec memanggil page object (`orderPage.createOrder(...)`), bukan `page.locator(...)` langsung
- [ ] Tidak ada username, password, atau data yang ditulis langsung di spec (data lewat `getData()`)
- [ ] Ada minimal satu `expect` yang memeriksa hasil
- [ ] Spec ada di folder role yang benar
- [ ] Tidak ada langkah login di dalam spec

Contoh spec yang benar:
```js
import { test, expect } from '@playwright/test';
import { OrderPage } from '../../pages/OrderPage.js';
import { getData } from '../../config/testdata.js';

const order = getData('order');

test('admin bisa membuat order', async ({ page }) => {
  const orderPage = new OrderPage(page);
  await orderPage.goto();
  await orderPage.createOrder(order.name);
  await expect(page.getByText(order.name)).toBeVisible();
});
```

Contoh spec mentah (SALAH, harus dirapikan AI):
```js
await page.goto('https://staging.tokokita.com/orders');
await page.locator('div:nth-child(3) > button').click();
await page.locator('#name').fill('Budi');
await page.waitForTimeout(3000);
```

---

## TROUBLESHOOTING
| Masalah | Cek |
|---|---|
| Login gagal | selector di `config/globalSetup.js`, isi `.env`, screenshot di `test-results/` |
| Rekaman terbuka di halaman login | folder `.auth/` kosong (ulangi Langkah 4) atau project role belum dicentang |
| AI membuat page object duplikat | file di `pages/` belum ditambahkan ke Knowledge project AI |
| Test lolos sekali, gagal berikutnya | data tes bentrok, pakai data unik per jalan |
| Session kedaluwarsa | jalankan ulang `npm run setup` |
| `File data tidak ada: data/qa/...` | file data belum dibuat untuk ENV yang dipakai |
