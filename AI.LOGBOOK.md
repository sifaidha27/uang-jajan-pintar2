# AI Usage Logbook

- Nama proyek: Uang Jajan Pintar
- Jenis proyek: Website uang jajan pintar
- Anggota tim: Syah Irfan Gaotama dan Sifa Nur Idha
- AI yang digunakan: ChatGPT, Claude
- Platform publikasi: GitHub Pages

## Tahap 1: Eksplorasi Ide & Perancangan Solusi

- Masalah yang ingin diselesaikan:
  Pelajar sering sulit mengatur uang jajan: lupa mencatat pengeluaran, tidak tahu batas jajan yang aman setiap hari, jarang menabung, dan belum punya target yang jelas. **[ISI: sesuaikan dengan kata-kata tim sendiri]**
- Ide solusi yang dipilih:
  Website "JajanPintar" dengan maskot panda bernama Pijan sebagai pelatih uang jajan. Fitur utama:
  - uang masuk otomatis dibagi ke tiga pos: Jajan 50%, Tabungan 30%, Berbagi 20% (persentase bisa diubah di Pengaturan)
  - batas jajan harian, peringatan saat hampir habis atau terlewat, dan grafik pengeluaran 7 hari terakhir
  - target tabungan dengan setoran dan kalkulator waktu menabung
  - tantangan mingguan (3 tantangan), poin, level, streak, dan 9 lencana
  - mode terang dan gelap, serta unduh riwayat dalam bentuk CSV
  - seluruh data tersimpan di localStorage perangkat, tanpa backend
  Alasan memilih ide ini: membantu pengguna mencatat pemasukan dan pengeluaran, membagi uang berdasarkan kebutuhan, memantau saldo, membuat target tabungan, serta membangun kebiasaan keuangan yang baik melalui fitur tantangan dan lencana.

## Tahap 2: Penyusunan Kerangka Kode (Scaffolding)

- Bagian yang dikembangkan:
  - `index.html`: dialog sapaan awal, dialog pengaturan, header, bar level dan streak, empat panel (Beranda, Catat, Target, Lencana), navigasi bawah, toast, dan kanvas konfeti. Setelah itu ditambah panel AI Logbook.
  - `style.css`: variabel warna tema terang dan gelap, kartu, progress bar, navigasi bawah, dialog, dan gaya form.
  - `script.js`: state aplikasi yang disimpan di localStorage, fungsi render untuk setiap panel, serta pendengar event untuk form dan tombol.
- AI yang digunakan: Claude (Anthropic)
- Prompt yang digunakan:
  - Meminta kode `index.html` lebih dulu, lalu `style.css`, lalu `script.js`.
  - "menambahkan ai.loogbook di respository github"
  - "setelah itu untuk index.html bagaimana"
  - "setelah itu bagian style.css ditambahkan apa"
  - "setelah itu untuk script.js bagaimana"
- Saran struktur atau kode dari AI:
  - Memastikan nama file ditulis dengan benar, yaitu index.html, style.css, dan script.js.
  - Memeriksa kembali penulisan kode HTML, CSS, dan JavaScript agar tidak ada kesalahan sintaks.
  - Memastikan pengaturan GitHub Pages menggunakan branch main dan folder / (root), lalu menunggu proses penyimpanan selesai sebelum memeriksa hasil publikasi
- Validasi & Modifikasi Mandiri:
   Tim memeriksa kembali nama file dan penulisan kode. Pada pengaturan GitHub Pages, tim memilih branch main dan folder / (root), kemudian menyimpan pengaturan dan memeriksa apakah website berhasil dipublikasikan. Tim perlu memastikan setiap perbaikan dengan menguji website secara langsung.

## Tahap 3: Pemecahan Masalah & Penanganan Galat (Debugging)

- Masalah atau error yang ditemukan:
  - Salah ketik harusnya  `index.html`, bukan `index.httml`
  - Terjadi kesalahan mengetik dalam `index.html`, `style.css`, dan `script.js`,
  - Pada bagian Branch, ubah menu drop-down menjadi main , lalu folder di sebelahnya diatur ke /root. Klik Save tidak menunggu proses selesai dan akhirnya ngebug
- AI yang digunakan: Claude (Anthropic)

## Tahap 4: Refleksi & Penjelasan Kode

- Fungsi utama website:
  Membantu pelajar mengatur uang jajan: mencatat uang masuk dan keluar, membagi uang masuk ke tiga pos, memantau batas jajan harian, menabung untuk sebuah target, dan tetap semangat lewat poin, level, streak, tantangan mingguan, dan lencana.
- Bagian kode yang paling penting:
  Semuanya di `script.js`: `pecahMasuk()`, `batasHarian()`, `pakaiPadaHari()`, `tambahTransaksi()` dan `bisaHapus()`, `periksaPencapaian()`, `simpan()` dan `muat()`, serta `gambarGrafik()`.
- Penjelasan cara kerja kode:
  - Seluruh data ada di satu objek `state` yang disimpan ke localStorage dengan kunci `jajanpintar:v1`. `muat()` membacanya saat halaman dibuka dan `simpan()` menulisnya setelah setiap perubahan.
  - `pecahMasuk()` membagi uang masuk sesuai persentase: bagian Tabungan dan Berbagi dihitung dengan `Math.floor`, dan sisanya masuk ke Jajan, jadi tidak ada uang yang hilang karena pembulatan.
  - `batasHarian()` = uang mingguan × persen Jajan ÷ 100 ÷ jumlah hari jajan. `pakaiPadaHari()` menjumlahkan pengeluaran pos Jajan pada hari tertentu, lalu dibandingkan dengan batas itu untuk memunculkan peringatan.
  - Saat form Catat dikirim, `kirimTransaksi()` memeriksa isian dan saldo pos, lalu `tambahTransaksi()` mengubah saldo pos dan menyimpan transaksi. Setelah itu `catatAktivitas()` memperbarui streak, dan `selesaiAksi()` memanggil `periksaPencapaian()`, `simpan()`, dan `renderSemua()`.
  - `periksaPencapaian()` memeriksa tantangan mingguan dan lencana yang baru terpenuhi, menambah poin, dan memicu konfeti. Level dihitung dari poin: `Math.floor(poin / 100) + 1`.
  - `bisaHapus()` mencegah transaksi tertentu dihapus (misalnya yang terkunci atau setoran dari target yang sudah selesai), dan `hapusTransaksi()` menolak penghapusan jika saldo pos akan menjadi negatif.
- AI yang digunakan: Claude (Anthropic)

## Refleksi Tim

- **Hal yang dipelajari:**
  Kami belajar membuat website menggunakan HTML, CSS, dan JavaScript, menyimpan data menggunakan `localStorage`, menghubungkan beberapa fitur aplikasi, serta memublikasikan website melalui GitHub Pages. Kami juga belajar menggunakan AI sebagai alat bantu dan memeriksa kembali hasil kode yang diberikan.

- **Tantangan yang dihadapi:**
  Tantangan kami adalah memahami struktur kode, menghindari kesalahan penulisan, menghubungkan fitur agar berjalan dengan baik, dan mengatur publikasi melalui GitHub Pages. Kami mengatasinya dengan memeriksa kode, memperbaiki kesalahan, dan menguji website.

- **Pembagian tugas antaranggota:**
  Syah Irfan Gaotama: Membantu merancang ide dan fitur website Uang Jajan Pintar,membantu menyusun dan memeriksa kode HTML, CSS, dan JavaScript,menguji fungsi pencatatan uang masuk dan pengeluaran serta perhitungan saldo.
  Sifa Nur Idha: Membantu merancang tampilan website agar mudah digunakan, membantu memeriksa tampilan dan fungsi fitur, seperti target tabungan, lencana, dan navigasi, membantu menyusun dokumentasi proyek, AI Logbook, dan publikasi website melalui GitHub Pages.

- **Rencana pengembangan selanjutnya:**
  Kami berencana menyempurnakan tampilan website, menguji seluruh fitur, memperbaiki kesalahan yang ditemukan, dan mengembangkan fitur AI Logbook agar proses penggunaan AI dapat didokumentasikan dengan lebih teratur.
