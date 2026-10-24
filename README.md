# 💰 Uang Jajan Pintar 2

**Aplikasi pencatatan dan pengelolaan uang jajan untuk membantu pelajar belajar mengatur keuangan sejak dini.**

## 📌 Deskripsi Produk

Uang Jajan Pintar 2 adalah aplikasi web yang dirancang untuk membantu pelajar mengelola uang jajan dengan lebih mudah, teratur, dan bertanggung jawab.

Aplikasi ini membantu pengguna mencatat pemasukan dan pengeluaran, membagi uang berdasarkan kebutuhan, memantau saldo, membuat target tabungan, serta membangun kebiasaan keuangan yang baik melalui fitur tantangan dan lencana.

Proyek ini dikembangkan sebagai media pembelajaran literasi keuangan dan teknologi digital bagi pelajar.

### 🎯 Tujuan Produk

- Membiasakan pelajar mencatat pemasukan dan pengeluaran.
- Membantu pengguna mengetahui sisa uang jajan.
- Mendorong kebiasaan menabung secara rutin.
- Mengajarkan pengelolaan uang berdasarkan kebutuhan dan prioritas.
- Memanfaatkan teknologi untuk mendukung literasi keuangan.
- Mengembangkan aplikasi web yang mudah digunakan melalui HP maupun komputer.

## ✨ Fitur Aplikasi

### 1. Beranda
Menampilkan ringkasan kondisi keuangan pengguna, termasuk saldo dan informasi pengelolaan uang.

### 2. Pencatatan Transaksi
Pengguna dapat mencatat uang masuk dan pengeluaran berdasarkan kategori, seperti:
- Jajan
- Transportasi
- Keperluan sekolah
- Berbagi
- Lainnya

### 3. Pembagian Uang
Membantu pengguna membagi uang ke dalam pos jajan, tabungan, dan berbagi sesuai persentase yang ditentukan.

### 4. Target Tabungan
Pengguna dapat membuat target tabungan, menentukan nominal yang dibutuhkan, melakukan setoran, dan memantau kemajuan target.

### 5. Kalkulator Tabungan
Membantu memperkirakan waktu yang diperlukan untuk mencapai target berdasarkan jumlah tabungan per hari.

### 6. Riwayat dan Grafik
Membantu pengguna melihat catatan keuangan dan memahami kebiasaan pengeluaran.

### 7. Poin, Streak, Tantangan, dan Lencana
Mendorong pengguna untuk rutin mencatat transaksi dan membangun kebiasaan mengatur uang.

### 8. Penyimpanan Data
Data aplikasi disimpan menggunakan `localStorage` pada browser sehingga data dapat tetap tersedia ketika halaman dimuat ulang pada browser dan perangkat yang sama.

### 9. AI Logbook — Pengembangan Fitur
AI Logbook direncanakan sebagai fitur pendamping yang membantu pengguna memahami kebiasaan keuangan melalui ringkasan transaksi, refleksi harian, dan saran penghematan.

Integrasi AI memerlukan backend yang aman untuk menghubungkan aplikasi dengan layanan model AI. Fitur ini tidak boleh dianggap sudah aktif sebelum backend selesai dipasang dan diuji.

## 🛠️ Teknologi yang Digunakan

| Teknologi | Pemanfaatan |
|---|---|
| HTML5 | Membuat struktur halaman dan komponen aplikasi. |
| CSS3 | Mengatur desain, warna, tata letak, dan tampilan responsif. |
| JavaScript | Mengelola transaksi, perhitungan saldo, navigasi, validasi, dan interaksi. |
| LocalStorage | Menyimpan data aplikasi di browser. |
| Git dan GitHub | Mengelola versi kode dan menyimpan repository proyek. |
| GitHub Pages (jika diaktifkan) | Mempublikasikan aplikasi web statis. |
| Backend API (untuk integrasi AI) | Menghubungkan frontend dengan layanan AI secara aman. |

## 🤖 Pemanfaatan Kecerdasan Buatan (AI)

AI direncanakan untuk mendukung pengembangan fitur **AI Logbook**, yaitu pendamping refleksi keuangan bagi pelajar.

### Manfaat AI Logbook

- Membuat ringkasan kebiasaan pengeluaran berdasarkan data yang diberikan.
- Membantu pengguna mengevaluasi keputusan membeli sesuatu.
- Memberikan saran penghematan yang sederhana dan realistis.
- Membantu menyusun refleksi harian tentang pengelolaan uang.
- Memberikan ide untuk mencapai target tabungan.

### Contoh Hasil AI Logbook

**Ringkasan:** Pengeluaran hari ini sebesar Rp12.000.

**Refleksi:** Coba periksa apakah pengeluaran tersebut sudah sesuai dengan kebutuhanmu.

**Saran:** Tentukan batas uang jajan untuk besok dan sisihkan uang tabungan terlebih dahulu.

Contoh tersebut hanya ilustrasi. Hasil sebenarnya bergantung pada data yang diberikan dan integrasi AI yang digunakan.

### Arsitektur Integrasi AI

1. Pengguna membuka halaman AI Logbook.
2. Aplikasi menyiapkan ringkasan transaksi yang relevan.
3. Frontend mengirim ringkasan ke backend melalui API.
4. Backend memvalidasi permintaan dan meneruskannya ke layanan AI.
5. Backend mengirim hasil analisis kembali ke aplikasi.
6. Pengguna membaca refleksi dan saran yang dihasilkan.

**Keamanan:** API key wajib disimpan di lingkungan backend, bukan di HTML, CSS, JavaScript frontend, atau repository publik. AI hanya memberikan analisis dan saran; perhitungan saldo resmi tetap dikendalikan oleh logika aplikasi.

## 📖 Panduan Penggunaan

### 1. Membuka Aplikasi
Buka tautan website yang dipublikasikan oleh pemilik repository. Jika menggunakan GitHub Pages, tautannya biasanya berbentuk:

`https://NAMA-PENGGUNA.github.io/NAMA-REPOSITORY/`

Ganti bagian tersebut dengan alamat website yang sebenarnya.

### 2. Mengisi Informasi Awal
Ikuti formulir awal aplikasi untuk memasukkan nama dan informasi uang jajan sesuai petunjuk yang tersedia.

### 3. Melihat Beranda
Buka menu **Beranda** untuk melihat ringkasan saldo, pembagian uang, dan informasi keuangan lainnya.

### 4. Mencatat Transaksi
Buka menu **Catat**, masukkan informasi transaksi, pilih kategori yang sesuai, lalu simpan catatan.

### 5. Mengelola Target Tabungan
Buka menu **Target**, masukkan nama target dan nominal yang ingin dicapai. Lakukan setoran sesuai kemampuan dan pantau perkembangannya.

### 6. Melihat Lencana
Buka menu **Lencana** untuk melihat pencapaian yang diperoleh dari aktivitas dalam aplikasi.

### 7. Menggunakan AI Logbook
Jika fitur AI Logbook sudah diaktifkan, buka menu tersebut, minta refleksi berdasarkan ringkasan keuangan, lalu baca saran yang diberikan. Periksa kembali saran AI dan gunakan pertimbangan pribadi sebelum mengambil keputusan.

### 8. Menjaga Data
Gunakan browser dan perangkat yang sama untuk mengakses data yang tersimpan secara lokal. Menghapus data situs atau menggunakan browser lain dapat menyebabkan data lokal tidak tersedia. Ekspor atau cadangkan data jika fitur tersebut tersedia.

## 🧪 Pengujian Aplikasi

Pengujian yang disarankan meliputi:

- Memastikan pemasukan dan pengeluaran tercatat dengan benar.
- Memeriksa kesesuaian saldo setelah transaksi ditambahkan atau dihapus.
- Memastikan setoran tabungan mengurangi saldo pos yang benar.
- Memeriksa kemajuan target tabungan.
- Memastikan data tetap tersedia setelah halaman dimuat ulang.
- Memastikan tampilan bekerja di HP dan komputer.
- Memastikan fitur AI menampilkan pesan yang sesuai jika backend tidak tersedia.
- Memastikan API key tidak dapat diakses dari frontend atau repository publik.

Hasil pengujian harus diisi berdasarkan pemeriksaan yang benar-benar dilakukan.

## 🔐 Privasi dan Keamanan

- Data yang tersimpan di `localStorage` berada di browser pengguna.
- Data lokal tidak otomatis tersinkronisasi ke perangkat lain.
- Hindari memasukkan informasi pribadi yang tidak diperlukan.
- Untuk integrasi AI, kirim hanya ringkasan data yang diperlukan.
- Lindungi kredensial backend dan batasi permintaan API.
- Periksa kembali saran AI karena hasilnya dapat kurang tepat.

## 🚀 Pengembangan Selanjutnya

Rencana pengembangan Uang Jajan Pintar 2 meliputi:

1. Integrasi AI Logbook dengan backend yang aman.
2. Riwayat refleksi keuangan harian dan mingguan.
3. Analisis tren pengeluaran.
4. Rekomendasi penghematan berdasarkan kebiasaan pengguna.
5. Peningkatan aksesibilitas dan pengalaman pengguna.
6. Pengujian keamanan dan keandalan aplikasi.

## 👥 Identitas Pengembang / Anggota

**Nama proyek:** Uang Jajan Pintar 2

**Nama repository:** `uang-jajan-pintar2`

**Pemilik repository GitHub:** `sifaidha27`

**Nama anggota/pengembang:** Syah Irfan Gaotama & Sifa Nur Idha 

**Asal sekolah/kelas:** SMA MUHAMMADIYAH 2 SUMBERPUCUNG

**Peran:** Pengembangan aplikasi web, desain antarmuka, pengujian fitur, dan dokumentasi proyek.

Jika proyek dikerjakan secara berkelompok, tambahkan seluruh anggota beserta perannya:

| No. | Nama anggota | Peran |
|---|---|---|
| 1 | Syah Irfan Gaotama | Pengembang   |
| 2 | Sifa Nur Idha | Pengembang  |


## 📂 Struktur Repository

```text
uang-jajan-pintar2/
├── index.html
├── style.css
├── script.js
└── README.md
```

Jika backend AI ditambahkan, struktur repository dapat dikembangkan sesuai kebutuhan dan kebijakan keamanan proyek.

## 📄 Lisensi

Lisensi proyek belum ditentukan. Jika ingin mengizinkan orang lain menggunakan, mempelajari, atau mengembangkan kode, tentukan lisensi yang sesuai dan tambahkan file `LICENSE`.

## 💡 Penutup

Uang Jajan Pintar 2 merupakan proyek pembelajaran yang bertujuan membantu pelajar membangun kebiasaan keuangan yang lebih baik melalui teknologi web.

Dengan pengembangan berkelanjutan dan integrasi AI yang aman, aplikasi ini diharapkan dapat menjadi sarana belajar literasi keuangan yang mudah dipahami, bermanfaat, dan sesuai dengan kebutuhan pelajar.
