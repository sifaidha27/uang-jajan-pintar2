/* ==========================================================
   JajanPintar – script.js
   Hanya JavaScript murni. Data tersimpan di localStorage.
   ========================================================== */
(() => {
  'use strict';

  const KUNCI = 'jajanpintar:v1';
  const $ = (id) => document.getElementById(id);
  const formatAngka = new Intl.NumberFormat('id-ID');
  const rp = (n) => 'Rp' + formatAngka.format(Math.round(n));

  /* ---------- Data tetap ---------- */
  const KATEGORI = {
    jajan:     { ikon: '🍡', nama: 'Jajan' },
    transport: { ikon: '🚌', nama: 'Transport' },
    sekolah:   { ikon: '✏️', nama: 'Keperluan sekolah' },
    berbagi:   { ikon: '🤝', nama: 'Berbagi' },
    lainnya:   { ikon: '🧩', nama: 'Lainnya' },
    tabungan:  { ikon: '🐼', nama: 'Setoran tabungan' },
    pemasukan: { ikon: '💰', nama: 'Uang masuk' }
  };
  const KATEGORI_KELUAR = ['jajan', 'transport', 'sekolah', 'berbagi', 'lainnya'];
  const NAMA_HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const MAKS_JUMLAH = 100000000;

  const TIPS = [
    'Catat jajanmu segera setelah membeli, supaya tidak lupa.',
    'Tanya dirimu dulu: aku butuh ini, atau cuma ingin?',
    'Bawa botol minum dari rumah. Uangnya bisa masuk celengan.',
    'Menabung sedikit tapi rutin lebih kuat daripada sekali banyak.',
    'Tunggu satu hari sebelum membeli barang yang mahal.',
    'Bandingkan harga di dua tempat sebelum membeli.',
    'Berbagi juga bagian dari mengatur uang. Sisihkan sedikit untuk orang lain.',
    'Bawa bekal dari rumah dua kali seminggu, hematnya terasa di akhir bulan.',
    'Tulis target tabunganmu supaya semangat menabung tetap menyala.',
    'Cek saldo pos Jajan sebelum ke kantin, bukan sesudahnya.'
  ];

  /* ---------- Status aplikasi ---------- */
  function stateBaru() {
    return {
      siap: false,
      nama: '',
      uangMingguan: 0,
      hariJajan: 5,
      persen: { jajan: 50, tabung: 30, berbagi: 20 },
      pos: { jajan: 0, tabung: 0, berbagi: 0 },
      transaksi: [],
      target: null,
      targetSelesai: 0,
      lencana: [],
      poin: 0,
      streak: 0,
      terakhirCatat: '',
      tantangan: { minggu: '', selesai: [] }
    };
  }

  function bersihkan(s) {
    const dasar = stateBaru();
    const hasil = Object.assign(dasar, s);
    hasil.persen = Object.assign(dasar.persen, s.persen || {});
    hasil.pos = Object.assign(stateBaru().pos, s.pos || {});
    hasil.tantangan = Object.assign({ minggu: '', selesai: [] }, s.tantangan || {});
    if (!Array.isArray(hasil.transaksi)) hasil.transaksi = [];
    if (!Array.isArray(hasil.lencana)) hasil.lencana = [];
    if (!Array.isArray(hasil.tantangan.selesai)) hasil.tantangan.selesai = [];
    return hasil;
  }

  function muat() {
    try {
      const mentah = localStorage.getItem(KUNCI);
      if (!mentah) return stateBaru();
      return bersihkan(JSON.parse(mentah));
    } catch (err) {
      return stateBaru();
    }
  }

  function simpan() {
    try {
      localStorage.setItem(KUNCI, JSON.stringify(state));
    } catch (err) {
      /* Penyimpanan penuh atau diblokir: aplikasi tetap jalan tanpa menyimpan. */
    }
  }

  let state = muat();
  let rayakan = false;
  const baruLencana = new Set();

  /* ---------- Bantuan tanggal ---------- */
  const pad = (n) => String(n).padStart(2, '0');
  const kunciHari = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const hariIni = () => kunciHari(new Date());
  const geserHari = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const senin = (d) => geserHari(d, -((d.getDay() + 6) % 7));

  function hariMingguIni() {
    const hasil = [];
    const akhir = kunciHari(new Date());
    let d = senin(new Date());
    while (kunciHari(d) <= akhir) {
      hasil.push(kunciHari(d));
      d = geserHari(d, 1);
    }
    return hasil;
  }

  /* ---------- Bantuan DOM ---------- */
  function el(tag, kelas, teks) {
    const e = document.createElement(tag);
    if (kelas) e.className = kelas;
    if (teks !== undefined) e.textContent = teks;
    return e;
  }

  function tampilPesan(elemen, teks) {
    elemen.textContent = teks || '';
    elemen.hidden = !teks;
  }

  function bukaDialog(d) {
    if (typeof d.showModal === 'function') {
      if (!d.open) d.showModal();
    } else {
      d.setAttribute('open', '');
    }
  }

  function tutupDialog(d) {
    if (typeof d.close === 'function') d.close();
    else d.removeAttribute('open');
  }

  /* ---------- Toast berantai ---------- */
  const antrianKabar = [];
  let kabarJalan = false;

  function kabar(teks) {
    antrianKabar.push(teks);
    if (!kabarJalan) tampilKabarBerikut();
  }

  function tampilKabarBerikut() {
    const toast = $('toast');
    const teks = antrianKabar.shift();
    if (!teks) {
      kabarJalan = false;
      toast.hidden = true;
      return;
    }
    kabarJalan = true;
    toast.hidden = true;
    void toast.offsetWidth;
    toast.textContent = teks;
    toast.hidden = false;
    setTimeout(tampilKabarBerikut, 2600);
  }

  /* ---------- Konfeti ---------- */
  let konfetiJalan = false;

  function konfeti() {
    if (konfetiJalan) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    konfetiJalan = true;

    const kanvas = $('konfeti');
    const ctx = kanvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const lebar = window.innerWidth;
    const tinggi = window.innerHeight;
    kanvas.width = lebar * dpr;
    kanvas.height = tinggi * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const warna = ['#7b9cf0', '#a8e6c3', '#4fbf9a', '#f38ba0', '#a9bff7'];
    const bagian = Array.from({ length: 110 }, () => ({
      x: lebar / 2 + (Math.random() - 0.5) * 80,
      y: tinggi * 0.35,
      vx: (Math.random() - 0.5) * 10,
      vy: -Math.random() * 9 - 3,
      w: 6 + Math.random() * 6,
      h: 8 + Math.random() * 8,
      r: Math.random() * 6.28,
      vr: (Math.random() - 0.5) * 0.4,
      c: warna[Math.floor(Math.random() * warna.length)]
    }));

    const mulai = performance.now();
    function bingkai(t) {
      ctx.clearRect(0, 0, lebar, tinggi);
      bagian.forEach((p) => {
        p.vy += 0.25;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.r += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (t - mulai < 2600) {
        requestAnimationFrame(bingkai);
      } else {
        ctx.clearRect(0, 0, lebar, tinggi);
        konfetiJalan = false;
      }
    }
    requestAnimationFrame(bingkai);
  }

  /* ---------- Perhitungan inti ---------- */
  const level = () => Math.floor(state.poin / 100) + 1;

  const batasHarian = () =>
    state.persen.jajan > 0 && state.hariJajan > 0
      ? Math.round((state.uangMingguan * state.persen.jajan) / 100 / state.hariJajan)
      : 0;

  const pakaiPadaHari = (kunci) =>
    state.transaksi
      .filter((t) => t.tipe === 'keluar' && t.pos === 'jajan' && t.hari === kunci)
      .reduce((a, t) => a + t.jumlah, 0);

  const adaCatatan = (kunci) => state.transaksi.some((t) => t.hari === kunci && !t.otomatis);
  const hariHemat = (kunci) => adaCatatan(kunci) && pakaiPadaHari(kunci) <= batasHarian();

  function hematBerturut() {
    let n = 0;
    let d = new Date();
    if (!adaCatatan(kunciHari(d))) d = geserHari(d, -1);
    for (let i = 0; i < 365; i++) {
      if (!hariHemat(kunciHari(d))) break;
      n++;
      d = geserHari(d, -1);
    }
    return n;
  }

  function streakAktif() {
    const kemarin = kunciHari(geserHari(new Date(), -1));
    return state.terakhirCatat === hariIni() || state.terakhirCatat === kemarin ? state.streak : 0;
  }

  function pecahMasuk(jumlah) {
    const tabung = Math.floor((jumlah * state.persen.tabung) / 100);
    const berbagi = Math.floor((jumlah * state.persen.berbagi) / 100);
    return { jajan: jumlah - tabung - berbagi, tabung, berbagi };
  }

  function tambahPoin(n) {
    const sebelum = level();
    state.poin += n;
    const sesudah = level();
    if (sesudah > sebelum) {
      kabar(`Naik ke level ${sesudah}!`);
      rayakan = true;
    }
  }

  function catatAktivitas() {
    const h = hariIni();
    if (state.terakhirCatat === h) return;
    const kemarin = kunciHari(geserHari(new Date(), -1));
    state.streak = state.terakhirCatat === kemarin ? state.streak + 1 : 1;
    state.terakhirCatat = h;
    tambahPoin(5);
  }

  function tambahTransaksi(data) {
    const sekarang = new Date();
    const efek = Object.assign({ jajan: 0, tabung: 0, berbagi: 0 }, data.efek);
    const t = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      tipe: data.tipe,
      kategori: data.kategori,
      jumlah: data.jumlah,
      catatan: data.catatan || '',
      tanggal: sekarang.toISOString(),
      hari: kunciHari(sekarang),
      pos: data.pos || 'semua',
      efek,
      otomatis: !!data.otomatis,
      kunci: !!data.kunci,
      targetId: data.targetId || ''
    };
    state.pos.jajan += efek.jajan;
    state.pos.tabung += efek.tabung;
    state.pos.berbagi += efek.berbagi;
    state.transaksi.push(t);
    return t;
  }

  function bisaHapus(t) {
    if (t.kunci) return false;
    if (t.kategori === 'tabungan') {
      return !!state.target && state.target.id === t.targetId && state.target.terkumpul < state.target.nominal;
    }
    return true;
  }

  /* ---------- Tantangan dan lencana ---------- */
  function pastikanMingguan() {
    const minggu = kunciHari(senin(new Date()));
    if (state.tantangan.minggu !== minggu) state.tantangan = { minggu, selesai: [] };
  }

  const TANTANGAN = [
    {
      id: 'catat5', ikon: '✍️', judul: 'Catat uang 5 hari', hadiah: 50, target: 5,
      hitung: () => hariMingguIni().filter(adaCatatan).length,
      progres: (n) => `${Math.min(n, 5)} dari 5 hari`
    },
    {
      id: 'hemat3', ikon: '🪙', judul: 'Jajan di bawah batas 3 hari', hadiah: 50, target: 3,
      hitung: () => hariMingguIni().filter(hariHemat).length,
      progres: (n) => `${Math.min(n, 3)} dari 3 hari`
    },
    {
      id: 'setor', ikon: '🐼', judul: 'Setor ke target tabungan', hadiah: 50, target: 1,
      hitung: () => {
        const hari = hariMingguIni();
        return state.transaksi.filter((t) => t.kategori === 'tabungan' && hari.includes(t.hari)).length;
      },
      progres: (n) => (n >= 1 ? 'Sudah menyetor minggu ini' : 'Belum ada setoran')
    }
  ];

  const LENCANA = [
    { id: 'pertama', ikon: '🌱', nama: 'Langkah pertama', info: 'Catat uang untuk pertama kali',
      cek: () => state.transaksi.some((t) => !t.otomatis) },
    { id: 'streak3', ikon: '🔥', nama: 'Rajin 3 hari', info: 'Mencatat 3 hari berturut-turut',
      cek: () => streakAktif() >= 3 },
    { id: 'streak7', ikon: '⚡', nama: 'Rajin 7 hari', info: 'Mencatat 7 hari berturut-turut',
      cek: () => streakAktif() >= 7 },
    { id: 'hemat3', ikon: '🪙', nama: 'Hemat 3 hari', info: 'Jajan di bawah batas 3 hari berturut-turut',
      cek: () => hematBerturut() >= 3 },
    { id: 'hemat7', ikon: '🏆', nama: 'Hemat 7 hari!', info: 'Jajan di bawah batas 7 hari berturut-turut',
      cek: () => hematBerturut() >= 7 },
    { id: 'penabung', ikon: '🐼', nama: 'Penabung cilik', info: 'Setor ke target tabungan',
      cek: () => state.transaksi.some((t) => t.kategori === 'tabungan') },
    { id: 'dermawan', ikon: '🤝', nama: 'Hati dermawan', info: 'Catat pengeluaran untuk berbagi',
      cek: () => state.transaksi.some((t) => t.tipe === 'keluar' && t.kategori === 'berbagi') },
    { id: 'target', ikon: '🎯', nama: 'Target tercapai', info: 'Selesaikan satu target tabungan',
      cek: () => state.targetSelesai > 0 },
    { id: 'level5', ikon: '⭐', nama: 'Level 5', info: 'Kumpulkan poin sampai level 5',
      cek: () => level() >= 5 }
  ];

  function periksaPencapaian() {
    let berubah;
    let putaran = 0;
    do {
      berubah = false;
      pastikanMingguan();

      TANTANGAN.forEach((t) => {
        if (!state.tantangan.selesai.includes(t.id) && t.hitung() >= t.target) {
          state.tantangan.selesai.push(t.id);
          tambahPoin(t.hadiah);
          kabar(`Tantangan selesai: ${t.judul}. +${t.hadiah} poin`);
          rayakan = true;
          berubah = true;
        }
      });

      LENCANA.forEach((l) => {
        if (!state.lencana.includes(l.id) && l.cek()) {
          state.lencana.push(l.id);
          baruLencana.add(l.id);
          tambahPoin(20);
          kabar(`Lencana baru: ${l.nama}`);
          rayakan = true;
          berubah = true;
        }
      });

      putaran++;
    } while (berubah && putaran < 4);
  }

  function selesaiAksi() {
    periksaPencapaian();
    simpan();
    renderSemua();
    if (rayakan) {
      rayakan = false;
      konfeti();
    }
  }

  /* ---------- Render ---------- */
  function renderKepala() {
    $('namaPengguna').textContent = state.nama || 'Teman';

    const batas = batasHarian();
    const pakai = pakaiPadaHari(hariIni());
    let semangat = 'Yuk, atur jajanmu hari ini.';
    if (batas > 0 && pakai > batas) semangat = 'Batas hari ini terlewat. Besok coba lagi, ya.';
    else if (batas > 0 && pakai / batas >= 0.8) semangat = 'Hati-hati, batas hari ini hampir habis.';
    else if (pakai > 0) semangat = 'Mantap, jajanmu masih aman.';
    $('kalimatSemangat').textContent = semangat;

    $('teksLevel').textContent = String(level());
    $('teksPoin').textContent = `${state.poin} poin`;
    $('barLevel').style.width = `${state.poin % 100}%`;
    $('teksStreak').textContent = String(streakAktif());
  }

  function renderBeranda() {
    const batas = batasHarian();
    const pakai = pakaiPadaHari(hariIni());
    const pct = batas > 0 ? pakai / batas : pakai > 0 ? 1 : 0;

    $('teksSaldo').textContent = rp(state.pos.jajan);
    $('teksBatasHarian').textContent = rp(batas);
    $('teksPakaiHariIni').textContent = rp(pakai);

    const bar = $('barHarian');
    bar.setAttribute('aria-valuenow', String(Math.round(Math.min(100, pct * 100))));
    const isi = $('barHarianIsi');
    isi.style.width = `${Math.min(100, pct * 100)}%`;
    isi.className = 'bar-isi' + (pct >= 1 ? ' bahaya' : pct >= 0.8 ? ' waspada' : '');

    const p = $('peringatan');
    let teks = '';
    let kelas = 'peringatan';
    if (batas > 0 && pakai > batas) {
      teks = `Kamu melewati batas hari ini sebesar ${rp(pakai - batas)}. Besok coba lebih hemat, ya.`;
    } else if (batas > 0 && pct >= 0.8) {
      teks = `Batas hari ini tinggal ${rp(batas - pakai)}. Pikir dulu sebelum jajan lagi.`;
      kelas += ' waspada';
    } else if (batas > 0 && state.pos.jajan <= 0) {
      teks = 'Saldo jajanmu sudah habis. Tunggu uang jajan berikutnya, ya.';
      kelas += ' waspada';
    } else if (batas > 0 && state.pos.jajan < batas) {
      teks = `Saldo jajanmu (${rp(state.pos.jajan)}) lebih kecil dari batas harian. Jajan seperlunya saja.`;
      kelas += ' waspada';
    }
    p.className = kelas;
    tampilPesan(p, teks);

    $('posJajan').textContent = rp(state.pos.jajan);
    $('posTabung').textContent = rp(state.pos.tabung);
    $('posBerbagi').textContent = rp(state.pos.berbagi);
    $('labelPersenJajan').textContent = `${state.persen.jajan}%`;
    $('labelPersenTabung').textContent = `${state.persen.tabung}%`;
    $('labelPersenBerbagi').textContent = `${state.persen.berbagi}%`;

    gambarGrafik();
    renderTantangan();

    const hariKe = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 864e5);
    $('teksTips').textContent = TIPS[hariKe % TIPS.length];
  }

  function renderTantangan() {
    const ul = $('daftarTantangan');
    ul.replaceChildren();
    let selesai = 0;
    TANTANGAN.forEach((t) => {
      const sudah = state.tantangan.selesai.includes(t.id);
      if (sudah) selesai++;
      const li = el('li', 'tantangan-item' + (sudah ? ' selesai' : ''));
      const info = el('div', 'tantangan-info');
      info.append(el('strong', '', t.judul), el('span', '', t.progres(t.hitung())));
      li.append(el('div', 'tantangan-ikon', sudah ? '✓' : t.ikon), info, el('span', 'tantangan-hadiah', `+${t.hadiah}`));
      ul.append(li);
    });
    $('sisaTantangan').textContent = `${selesai} dari ${TANTANGAN.length} selesai`;
  }

  function dataGrafik() {
    const hasil = [];
    for (let i = 6; i >= 0; i--) {
      const d = geserHari(new Date(), -i);
      const kunci = kunciHari(d);
      hasil.push({ label: NAMA_HARI[d.getDay()], nilai: pakaiPadaHari(kunci), hariIni: i === 0 });
    }
    return hasil;
  }

  function singkat(n) {
    if (n < 1000) return String(n);
    const k = n / 1000;
    return (Number.isInteger(k) ? String(k) : k.toFixed(1).replace('.', ',')) + 'rb';
  }

  function batang(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h);
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x, y + rr);
    ctx.arcTo(x, y, x + rr, y, rr);
    ctx.lineTo(x + w - rr, y);
    ctx.arcTo(x + w, y, x + w, y + rr, rr);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
  }

  function gambarGrafik() {
    const kanvas = $('grafikMingguan');
    const ctx = kanvas.getContext('2d');
    const W = 600;
    const H = 280;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    kanvas.width = W * dpr;
    kanvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const css = getComputedStyle(document.documentElement);
    const warna = (nama) => css.getPropertyValue(nama).trim() || '#000';
    const data = dataGrafik();
    const batas = batasHarian();
    const maks = Math.max(batas * 1.25, ...data.map((d) => d.nilai), 1000);

    const kiri = 16;
    const atas = 30;
    const bawah = 38;
    const areaTinggi = H - atas - bawah;
    const slot = (W - kiri * 2) / data.length;
    const lebar = slot * 0.58;

    if (batas > 0) {
      const yBatas = atas + areaTinggi - (batas / maks) * areaTinggi;
      ctx.save();
      ctx.setLineDash([6, 5]);
      ctx.strokeStyle = warna('--jambu');
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(kiri, yBatas);
      ctx.lineTo(W - kiri, yBatas);
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = warna('--jambu');
      ctx.font = '700 12px Nunito, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('batas', W - kiri, yBatas - 6);
    }

    data.forEach((d, i) => {
      const x = kiri + i * slot + (slot - lebar) / 2;
      const tinggi = d.nilai > 0 ? Math.max(6, (d.nilai / maks) * areaTinggi) : 4;
      const y = atas + areaTinggi - tinggi;

      let isi = warna('--biru');
      if (d.nilai === 0) isi = warna('--garis');
      else if (batas > 0 && d.nilai > batas) isi = warna('--jambu');

      batang(ctx, x, y, lebar, tinggi, 8);
      ctx.fillStyle = isi;
      ctx.fill();
      if (d.hariIni) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = warna('--koin-tua');
        ctx.stroke();
      }

      ctx.fillStyle = warna('--tinta');
      ctx.textAlign = 'center';
      ctx.font = `${d.hariIni ? 800 : 600} 14px Nunito, sans-serif`;
      ctx.fillText(d.label, x + lebar / 2, H - 14);

      if (d.nilai > 0) {
        ctx.font = '700 13px Nunito, sans-serif';
        ctx.fillText(singkat(d.nilai), x + lebar / 2, Math.max(16, y - 7));
      }
    });

    const total = data.reduce((a, d) => a + d.nilai, 0);
    $('totalMingguan').textContent = rp(total);
    $('deskripsiGrafik').textContent =
      'Pengeluaran 7 hari terakhir: ' + data.map((d) => `${d.label} ${rp(d.nilai)}`).join(', ') + '.';
  }

  function renderRiwayat() {
    const filter = $('filterRiwayat').value;
    const daftar = state.transaksi
      .filter((t) => filter === 'semua' || t.tipe === filter)
      .sort((a, b) => b.tanggal.localeCompare(a.tanggal))
      .slice(0, 100);

    const ul = $('daftarRiwayat');
    ul.replaceChildren();
    $('riwayatKosong').hidden = daftar.length > 0;

    daftar.forEach((t) => {
      const kat = KATEGORI[t.kategori] || KATEGORI.lainnya;
      const waktu = new Date(t.tanggal).toLocaleString('id-ID', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
      });
      const li = el('li', 'riwayat-item');
      const info = el('div', 'riwayat-info');
      info.append(el('strong', '', t.catatan || kat.nama), el('span', '', `${kat.nama}, ${waktu}`));
      li.append(
        el('div', 'riwayat-ikon', kat.ikon),
        info,
        el('span', `riwayat-jumlah ${t.tipe}`, `${t.tipe === 'masuk' ? '+' : '-'}${rp(t.jumlah)}`)
      );
      if (bisaHapus(t)) {
        const tombol = el('button', 'riwayat-hapus', '✕');
        tombol.type = 'button';
        tombol.dataset.id = t.id;
        tombol.setAttribute('aria-label', 'Hapus catatan ini');
        li.append(tombol);
      }
      ul.append(li);
    });
  }

  function renderTarget() {
    const t = state.target;
    $('kartuTarget').hidden = !t;
    $('formTarget').hidden = !!t;
    if (!t) return;

    const pct = Math.min(100, Math.round((t.terkumpul / t.nominal) * 100));
    const selesai = t.terkumpul >= t.nominal;

    $('namaTarget').textContent = t.nama;
    $('terkumpulTarget').textContent = rp(t.terkumpul);
    $('nominalTarget').textContent = rp(t.nominal);
    $('barTargetIsi').style.width = `${pct}%`;
    $('barTarget').setAttribute('aria-valuenow', String(pct));
    $('sisaTarget').textContent = selesai
      ? 'Target tercapai! Kamu hebat.'
      : `Kurang ${rp(t.nominal - t.terkumpul)} lagi (${pct}%). Saldo pos Tabungan: ${rp(state.pos.tabung)}.`;
    $('formSetor').hidden = selesai;
    $('tombolHapusTarget').textContent = selesai ? 'Buat target baru' : 'Ganti target';
  }

  function renderLencana() {
    const ul = $('gridLencana');
    ul.replaceChildren();
    LENCANA.forEach((l) => {
      const dapat = state.lencana.includes(l.id);
      const li = el('li', 'lencana-kartu' + (dapat ? '' : ' terkunci') + (baruLencana.has(l.id) ? ' baru' : ''));
      li.append(
        el('div', 'lencana-ikon', l.ikon),
        el('strong', '', l.nama),
        el('span', '', l.info),
        el('span', 'sr-only', dapat ? 'Sudah didapat' : 'Belum didapat')
      );
      ul.append(li);
    });
    $('jumlahLencana').textContent = String(state.lencana.length);
    $('totalLencana').textContent = String(LENCANA.length);
  }

  function renderSemua() {
    pastikanMingguan();
    renderKepala();
    renderBeranda();
    renderRiwayat();
    renderTarget();
    renderLencana();
  }

  /* ---------- Navigasi tab ---------- */
  function pindahTab(nama) {
    document.querySelectorAll('.panel').forEach((p) => {
      p.hidden = p.id !== `tab-${nama}`;
    });
    document.querySelectorAll('.nav-tombol').forEach((b) => {
      const aktif = b.dataset.tab === nama;
      b.classList.toggle('aktif', aktif);
      if (aktif) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });
    if (nama === 'beranda') gambarGrafik();
    if (nama === 'lencana') {
      renderLencana();
      baruLencana.clear();
    }
    window.scrollTo({ top: 0 });
  }

  /* ---------- Aksi pengguna ---------- */
  function tampilkanAplikasi() {
    $('aplikasi').hidden = false;
    renderSemua();
  }

  function kirimAwal(e) {
    e.preventDefault();
    const nama = $('inputNama').value.trim().slice(0, 20);
    const uang = parseInt($('inputUangMingguan').value, 10);
    const hari = parseInt($('inputHariJajan').value, 10) || 5;
    if (!nama || !(uang >= 1000) || uang > MAKS_JUMLAH) return;

    state = stateBaru();
    Object.assign(state, { siap: true, nama, uangMingguan: uang, hariJajan: hari });
    pastikanMingguan();
    tambahTransaksi({
      tipe: 'masuk', kategori: 'pemasukan', jumlah: uang, catatan: 'Uang jajan awal',
      efek: pecahMasuk(uang), otomatis: true
    });
    simpan();
    tutupDialog($('dialogAwal'));
    tampilkanAplikasi();
    pindahTab('beranda');
    kabar(`Selamat datang, ${nama}!`);
  }

  function kirimTransaksi(e) {
    e.preventDefault();
    const pesan = $('pesanForm');
    const masuk = $('tipeMasuk').checked;
    const jumlah = parseInt($('inputJumlah').value, 10);
    const catatan = $('inputCatatan').value.trim().slice(0, 40);

    if (!Number.isFinite(jumlah) || jumlah < 100) return tampilPesan(pesan, 'Isi jumlah minimal Rp100.');
    if (jumlah > MAKS_JUMLAH) return tampilPesan(pesan, 'Jumlahnya terlalu besar. Periksa lagi angkanya.');

    if (masuk) {
      tambahTransaksi({
        tipe: 'masuk', kategori: 'pemasukan', jumlah, catatan, efek: pecahMasuk(jumlah)
      });
      kabar('Uang masuk dibagi ke pos Jajan, Tabungan, dan Berbagi.');
    } else {
      const kategori = $('inputKategori').value;
      if (!KATEGORI_KELUAR.includes(kategori)) return tampilPesan(pesan, 'Pilih kategori dulu.');
      const pos = kategori === 'berbagi' ? 'berbagi' : 'jajan';
      if (state.pos[pos] < jumlah) {
        return tampilPesan(pesan, `Saldo pos ${pos === 'jajan' ? 'Jajan' : 'Berbagi'} hanya ${rp(state.pos[pos])}.`);
      }
      tambahTransaksi({
        tipe: 'keluar', kategori, jumlah, catatan, pos, efek: { [pos]: -jumlah }
      });
      if (pos === 'jajan') {
        const sisa = batasHarian() - pakaiPadaHari(hariIni());
        kabar(sisa >= 0 ? `Tercatat. Sisa batas hari ini ${rp(sisa)}.` : 'Tercatat. Kamu melewati batas hari ini.');
      } else {
        kabar('Tercatat. Terima kasih sudah berbagi!');
      }
    }

    tampilPesan(pesan, '');
    catatAktivitas();
    $('inputJumlah').value = '';
    $('inputCatatan').value = '';
    selesaiAksi();
    $('inputJumlah').focus();
  }

  function hapusTransaksi(id) {
    const t = state.transaksi.find((x) => x.id === id);
    if (!t || !bisaHapus(t)) return;

    const baru = {
      jajan: state.pos.jajan - t.efek.jajan,
      tabung: state.pos.tabung - t.efek.tabung,
      berbagi: state.pos.berbagi - t.efek.berbagi
    };
    if (baru.jajan < 0 || baru.tabung < 0 || baru.berbagi < 0) {
      kabar('Catatan ini belum bisa dihapus karena uangnya sudah terpakai.');
      return;
    }
    if (!window.confirm('Hapus catatan ini?')) return;

    state.pos = baru;
    if (t.kategori === 'tabungan' && state.target) {
      state.target.terkumpul = Math.max(0, state.target.terkumpul - t.jumlah);
    }
    state.transaksi = state.transaksi.filter((x) => x.id !== id);
    simpan();
    renderSemua();
    kabar('Catatan dihapus.');
  }

  function kirimTarget(e) {
    e.preventDefault();
    const pesan = $('pesanTarget');
    const nama = $('inputNamaTarget').value.trim().slice(0, 30);
    const nominal = parseInt($('inputNominalTarget').value, 10);

    if (!nama) return tampilPesan(pesan, 'Tulis dulu kamu mau membeli apa.');
    if (!Number.isFinite(nominal) || nominal < 1000) return tampilPesan(pesan, 'Isi harga minimal Rp1.000.');
    if (nominal > MAKS_JUMLAH) return tampilPesan(pesan, 'Harganya terlalu besar. Periksa lagi angkanya.');

    state.target = { id: Date.now().toString(36), nama, nominal, terkumpul: 0 };
    tampilPesan(pesan, '');
    $('inputNamaTarget').value = '';
    $('inputNominalTarget').value = '';
    kabar(`Target "${nama}" tersimpan. Semangat menabung!`);
    selesaiAksi();
  }

  function kirimSetor(e) {
    e.preventDefault();
    const pesan = $('pesanSetor');
    const t = state.target;
    if (!t) return;

    const jumlah = parseInt($('inputSetor').value, 10);
    const sisa = t.nominal - t.terkumpul;
    if (!Number.isFinite(jumlah) || jumlah < 100) return tampilPesan(pesan, 'Isi setoran minimal Rp100.');
    if (jumlah > state.pos.tabung) return tampilPesan(pesan, `Saldo pos Tabungan hanya ${rp(state.pos.tabung)}.`);
    if (jumlah > sisa) return tampilPesan(pesan, `Setoran melebihi kebutuhan. Maksimal ${rp(sisa)}.`);

    tambahTransaksi({
      tipe: 'keluar', kategori: 'tabungan', jumlah, catatan: `Setor ke ${t.nama}`,
      pos: 'tabung', efek: { tabung: -jumlah }, targetId: t.id
    });
    t.terkumpul += jumlah;
    tampilPesan(pesan, '');
    $('inputSetor').value = '';

    catatAktivitas();
    tambahPoin(10);
    if (t.terkumpul >= t.nominal) {
      state.targetSelesai += 1;
      tambahPoin(100);
      kabar(`Target "${t.nama}" tercapai! +100 poin`);
      rayakan = true;
    } else {
      kabar(`Setoran tersimpan. ${rp(sisa - jumlah)} lagi sampai target.`);
    }
    selesaiAksi();
  }

  function gantiTarget() {
    const t = state.target;
    if (!t) return;
    const selesai = t.terkumpul >= t.nominal;

    if (!selesai) {
      const ok = window.confirm(`Ganti target "${t.nama}"? Uang ${rp(t.terkumpul)} akan kembali ke pos Tabungan.`);
      if (!ok) return;
      if (t.terkumpul > 0) {
        tambahTransaksi({
          tipe: 'masuk', kategori: 'pemasukan', jumlah: t.terkumpul,
          catatan: `Kembali dari target ${t.nama}`, efek: { tabung: t.terkumpul },
          otomatis: true, kunci: true
        });
      }
    }
    state.target = null;
    simpan();
    renderSemua();
  }

  function hitungKalkulator() {
    const target = parseInt($('kalkTarget').value, 10);
    const perHari = parseInt($('kalkPerHari').value, 10);
    const keluar = $('hasilKalkulator');
    if (!(target > 0) || !(perHari > 0)) {
      keluar.textContent = 'Isi dua kolom di atas untuk melihat hasilnya.';
      return;
    }
    const hari = Math.ceil(target / perHari);
    const minggu = Math.ceil(hari / 7);
    keluar.textContent =
      `Kalau menabung ${rp(perHari)} per hari, target ${rp(target)} tercapai dalam ${formatAngka.format(hari)} hari (sekitar ${formatAngka.format(minggu)} minggu).`;
  }

  /* ---------- Pengaturan ---------- */
  function bacaPersen() {
    return {
      jajan: parseInt($('persenJajan').value, 10) || 0,
      tabung: parseInt($('persenTabung').value, 10) || 0,
      berbagi: parseInt($('persenBerbagi').value, 10) || 0
    };
  }

  function periksaPersen() {
    const p = bacaPersen();
    const total = p.jajan + p.tabung + p.berbagi;
    const info = $('infoPersen');
    const salah = total !== 100 || p.jajan < 0 || p.tabung < 0 || p.berbagi < 0;
    info.textContent = salah ? `Total harus 100%. Sekarang ${total}%.` : 'Total 100%. Pas!';
    info.classList.toggle('salah', salah);
    return !salah;
  }

  function bukaPengaturan() {
    $('persenJajan').value = state.persen.jajan;
    $('persenTabung').value = state.persen.tabung;
    $('persenBerbagi').value = state.persen.berbagi;
    $('inputUangMingguanUbah').value = state.uangMingguan;
    periksaPersen();
    bukaDialog($('dialogPengaturan'));
  }

  function kirimPengaturan(e) {
    e.preventDefault();
    if (!periksaPersen()) return;
    const uang = parseInt($('inputUangMingguanUbah').value, 10);
    if (!(uang >= 1000) || uang > MAKS_JUMLAH) {
      const info = $('infoPersen');
      info.textContent = 'Uang jajan per minggu minimal Rp1.000.';
      info.classList.add('salah');
      return;
    }
    state.persen = bacaPersen();
    state.uangMingguan = uang;
    simpan();
    renderSemua();
    tutupDialog($('dialogPengaturan'));
    kabar('Pengaturan tersimpan.');
  }

  function selCsv(nilai) {
    let s = String(nilai);
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    return '"' + s.replace(/"/g, '""') + '"';
  }

  function ekspor() {
    const baris = [['Tanggal', 'Jenis', 'Kategori', 'Jumlah', 'Catatan']];
    [...state.transaksi]
      .sort((a, b) => a.tanggal.localeCompare(b.tanggal))
      .forEach((t) => {
        const kat = KATEGORI[t.kategori] || KATEGORI.lainnya;
        baris.push([t.hari, t.tipe === 'masuk' ? 'Masuk' : 'Keluar', kat.nama, t.jumlah, t.catatan]);
      });
    const csv = baris.map((r) => r.map(selCsv).join(',')).join('\r\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'riwayat-jajanpintar.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function resetSemua() {
    const ok = window.confirm('Semua data akan dihapus dan tidak bisa dikembalikan. Lanjutkan?');
    if (!ok) return;
    try {
      localStorage.removeItem(KUNCI);
    } catch (err) {
      /* diabaikan */
    }
    state = stateBaru();
    tutupDialog($('dialogPengaturan'));
    $('aplikasi').hidden = true;
    ['formAwal', 'formTransaksi', 'formTarget', 'formSetor'].forEach((id) => $(id).reset());
    pindahTab('beranda');
    bukaDialog($('dialogAwal'));
  }

  /* ---------- Tema ---------- */
  function temaSekarang() {
    return document.documentElement.dataset.tema === 'gelap' ? 'gelap' : 'terang';
  }

  function setTema(t, simpanPilihan) {
    document.documentElement.dataset.tema = t;
    if (simpanPilihan) {
      try { localStorage.setItem('tema', t); } catch (err) { /* diabaikan */ }
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'gelap' ? '#151a2e' : '#f8f9fd');

    const tombol = $('tombolTema');
    tombol.textContent = t === 'gelap' ? '☀️' : '🌙';
    tombol.setAttribute('aria-pressed', String(t === 'gelap'));

    gambarGrafik();
  }

  /* ---------- Pasang semua pendengar ---------- */
  function pasangEvent() {
    $('formAwal').addEventListener('submit', kirimAwal);
    $('dialogAwal').addEventListener('cancel', (e) => {
      if (!state.siap) e.preventDefault();
    });

    document.querySelectorAll('.nav-tombol').forEach((b) => {
      b.addEventListener('click', () => pindahTab(b.dataset.tab));
    });

    document.querySelectorAll('input[name="tipe"]').forEach((r) => {
      r.addEventListener('change', () => {
        $('grupKategori').hidden = $('tipeMasuk').checked;
        tampilPesan($('pesanForm'), '');
      });
    });
    $('formTransaksi').addEventListener('submit', kirimTransaksi);
    $('filterRiwayat').addEventListener('change', renderRiwayat);
    $('daftarRiwayat').addEventListener('click', (e) => {
      const tombol = e.target.closest('.riwayat-hapus');
      if (tombol) hapusTransaksi(tombol.dataset.id);
    });

    $('formTarget').addEventListener('submit', kirimTarget);
    $('formSetor').addEventListener('submit', kirimSetor);
    $('tombolHapusTarget').addEventListener('click', gantiTarget);
    $('kalkTarget').addEventListener('input', hitungKalkulator);
    $('kalkPerHari').addEventListener('input', hitungKalkulator);

    $('tombolTema').addEventListener('click', () => {
      setTema(temaSekarang() === 'gelap' ? 'terang' : 'gelap', true);
    });
    $('tombolPengaturan').addEventListener('click', bukaPengaturan);
    $('tombolBatalPengaturan').addEventListener('click', () => tutupDialog($('dialogPengaturan')));
    $('formPengaturan').addEventListener('submit', kirimPengaturan);
    ['persenJajan', 'persenTabung', 'persenBerbagi'].forEach((id) => {
      $(id).addEventListener('input', periksaPersen);
    });
    $('dialogPengaturan').addEventListener('click', (e) => {
      if (e.target === $('dialogPengaturan')) tutupDialog($('dialogPengaturan'));
    });
    $('tombolEkspor').addEventListener('click', ekspor);
    $('tombolReset').addEventListener('click', resetSemua);

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && state.siap) renderSemua();
    });
  }

  /* ---------- Mulai ---------- */
  pasangEvent();
  setTema(temaSekarang(), false);

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    let sudahPilih = false;
    try { sudahPilih = !!localStorage.getItem('tema'); } catch (err) { /* diabaikan */ }
    if (!sudahPilih) setTema(e.matches ? 'gelap' : 'terang', false);
  });

  if (state.siap) {
    tampilkanAplikasi();
  } else {
    bukaDialog($('dialogAwal'));
  }
})();
