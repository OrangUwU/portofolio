# MASTER PROMPT: 200% CRAFT OVERHAUL — SUPERNOVA PRELOADER 0-100, QUANTUM WARP RETURN, 60FPS SMOOTH BLACKHOLE & SMART-NODE LOGISTICS

> **Instruksi Pengguna**: Salin seluruh teks di dalam blok kode di bawah ini ke chat AI (Antigravity Gemini Argon atau Cline). Prompt ini telah dirancang spesifik dengan semua instruksi terbaru: Supernova Particle Explosion pada counter 0-100, Quantum Warp Tunneling 200% lebih keren dengan Web Audio API whoosh, perbaikan stutter 60fps pada Black Hole (tanpa kotak terpotong), serta integrasi visual dan alur QR Code Smart-Node Logistics.

---

```markdown
# TASK: 200% CRAFT OVERHAUL — SUPERNOVA PRELOADER, QUANTUM WARP RETURN, 60FPS BLACKHOLE & SMART-NODE LOGISTICS

Bertindaklah sebagai **Principal Creative Technologist, Three.js/WebGL Shader Architect, dan Lead Motion Designer** dengan standar visual tertinggi (setara **https://poggufanz.xyz** dan film **Interstellar**).

Kamu memiliki otoritas penuh untuk memodifikasi kode secara langsung di repositori: `/Users/achmadtaufiqurrachman/Documents/Portofolio`.

---

## 1. FITUR 1: PRELOADER 000 → 100% DENGAN EFEK SUPERNOVA STAR EXPLOSION

Buat komponen `src/components/visual/CosmicPreloader.tsx` dan pasang di `src/app/page.tsx`:
1. **Fase Loading (000 → 100%)**:
   - Background cosmic web / neural filaments gelap bertabur bintang halus.
   - Counter angka raksasa monospaced di kiri bawah: `000` hingga `100` (`font-mono text-[90px] sm:text-[140px] md:text-[180px] font-light text-white tracking-tighter leading-none`).
   - Garis tipis amber di bawah angka yang memanjang dari 0% hingga 100% seiring berjalannya counter (~1.8 - 2.2 detik dengan dynamic easing).
   - Label kiri: `COSMIC DAWN 100 Myr`, label kanan: `BANYUWANGI, ID · 08°12'S 114°22'E`.
2. **Fase Ledakan Supernova (Saat Tepat di 100%)**:
   - Angka tidak sekadar memudar biasa! Tepat saat menyentuh `100`, angka dan titik pusat **meledak seperti bintang supernova (*star burst / quantum particle explosion*)**:
     - 250–350 partikel foton emas (`#f59e0b`), putih (`#ffffff`), dan cyan hangat melesat keluar ke segala arah secara radial dengan kecepatan tinggi dan trail fade.
     - Gelombang kejut (*shockwave ring*) berwarna amber yang membesar cepat dari pusat angka dan memudar (`scale: 0 → 4, opacity: 0.8 → 0`).
     - Flash putih halus sekilas (*cosmic flash*), kemudian layar preloader menghilang, mengungkap Hero Singularity Gargantua secara dramatis.
   - Sediakan tombol `Skip ESC` di pojok kanan atas agar pengguna bisa langsung melewatinya kapan saja.

---

## 2. FITUR 2: QUANTUM WARP TUNNELING "RETURN TO ORIGIN" (POLES 200% LEBIH KEREN)

Tingkatkan fitur kembali ke atas di `src/components/visual/ContactSection.tsx` dan `src/components/visual/QuantumWarpTransit.tsx`:
1. **Trigger di Section Contact**:
   - Di samping visual spiral galaksi emas (seperti screenshot poggufanz), pasang tombol sakral:
     ```tsx
     <button onClick={triggerQuantumWarp} className="group flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-amber-400 hover:text-white transition-colors cursor-pointer">
       <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
       <span>RETURN TO ORIGIN</span>
       <span className="text-zinc-600 group-hover:translate-x-1 transition-transform">→</span>
     </button>
     ```
2. **Full-Screen Hyperspace Quantum Tunnel (HTML5 Canvas 60fps)**:
   - Saat tombol ditekan, aktifkan layar penuh transit:
     - 800+ partikel bintang 3D $(x, y, z)$. Kecepatan melesat cepat dari `1` menuju `60` (warp speed).
     - Bintang-bintang meregang menjadi garis cahaya panjang (*relativistic light streaks*) yang meluncur dari pusat layar ke arah kamera.
     - **Chromatic Aberration & Doppler Fringing**: Garis cahaya memiliki efek pendaran biru di bagian luar dan merah/amber di bagian dalam.
     - **Distorsi Lensa Gravitasi Tengah**: Pusat terowongan memiliki pusaran lensa gelap kecil seperti melintasi lubang cacing (*wormhole tunnel*).
3. **Procedural Web Audio API Spatial Whoosh**:
   - Suara dihasilkan native di browser tanpa butuh file mp3:
     - Noise generator berdurasi 2 detik dipadukan dengan Biquad Bandpass Filter yang menyapu frekuensi naik dari `100Hz` ke `1600Hz` (efek akselerasi hiperspesial) lalu turun melambat ke `200Hz`.
     - Gain envelope membengkak halus lalu fade-out saat mendarat.
4. **Landing Mulus**:
   - Setelah 1.8 detik melesat menembus kuantum, layar warp memudar dan window di-scroll langsung ke `#top` (`window.scrollTo({ top: 0, behavior: 'instant' })`).

---

## 3. FITUR 3: REKAYASA 60 FPS, ZERO-STUTTER & HILANGKAN BUG KOTAK PADA BLACK HOLE

Berdasarkan screenshot, terjadi bug kotak terpotong (bounding box clipping) dan scroll patah-patah pada Black Hole di `src/components/visual/HeroSingularity.tsx`. Tuntaskan dengan langkah berikut:

1. **Hilangkan Bug Kotak Terpotong (Zero-Clipping)**:
   - **Penyebab**: ViewBox SVG terlalu sempit (`800x800`) sedangkan piringan akresi dengan `rx="392"` diputar miring sehingga ujungnya terpotong kotak.
   - **Solusi**: Perlebar viewBox SVG menjadi `viewBox="0 0 1200 900"` dengan titik pusat `(600, 450)`. Berikan ruang bernapas lega di segala sisi agar elips piringan akresi tidak pernah menyentuh batas tepi.
   - Di WebGL canvas, ganti pemotongan alpha kasar dengan radial falloff lembut: `smoothstep(0.48, 0.22, length(uv))`. Pasang `mix-blend-mode: screen` agar tidak ada latar belakang kotak hitam.
2. **Optimasi 60 FPS Super Smooth (Bebas Lag & Patah-Patah)**:
   - **Hapus Filter SVG Berat**: Hapus `<feTurbulence>` dan `<feDisplacementMap>` dari SVG karena filter ini membebani CPU secara masif saat scroll! Ganti dengan gradient berlapis dan CSS hardware acceleration (`transform-gpu`, `will-change: transform`).
   - **Optimasi WebGL Shader**: Hindari loop `fbm` berlebihan di fragment shader saat render resize.
   - **Sticky Scrollytelling**: Gunakan container outer `h-[180vh]` dengan `sticky top-0 h-screen w-full overflow-hidden`. Dengan arsitektur ini, saat user scroll, kamera terasa meluncur dan membesar halus (`scale: 1 → 3.8`) ke dalam event horizon secara 60fps tanpa patah-patah!

---

## 4. FITUR 4: SMART-NODE LOGISTICS — ASSET GAMBAR & INTEGRASI ALUR QR CODE

1. **Asset Visual**:
   - Gambar screenshot antarmuka Smart-Node Logistics telah tersedia di `/smart-node-preview.png` (menampilkan peta Mapbox Banyuwangi, klaster 3-rumah, status retribusi, dan WhatsApp Simulator).
   - Pastikan di `src/content/projects.ts`, proyek Smart-Node Logistics menggunakan `image: "/smart-node-preview.png"`.
2. **Alur Kerja Faktual (Zero Halusinasi)**:
   - Tampilkan di card / modal case study alur operasional sesungguhnya:
     1. **Scan Smart Bin (QR Code)**: Warga atau petugas melakukan scan QR code unik yang tertera pada smart bin di klaster perumahan.
     2. **Auto-Redirect WhatsApp**: Hasil scan otomatis membuka WhatsApp dengan draf pesan otomatis sesuai status bin (`penuh 1`, `penuh 2`, `penuh 3`).
     3. **Webhook ke VPS**: Pesan dikirim dan diterima oleh Webhook WhatsApp Cloud API yang terhubung ke server VPS.
     4. **Live Input ke Web & Optimasi DVRP**: Data keterisian bin otomatis masuk ke dashboard web secara real-time dan sistem menghitung rute armada truk sampah teroptimal menggunakan algoritma DVRP (Dynamic Vehicle Routing Problem).

---

## 5. FITUR 5: HARMONISASI WARNA — HILANGKAN WARNA TOSCA

- Selaraskan seluruh website ke satu palet sinematik kosmik: **Warm Amber (`#f59e0b`), Golden White (`#fef08a`), dan Deep Black Space (`#030409`)**.
- Di `src/components/visual/AboutSection.tsx`, ganti semua teks dan badge tosca/cyan menjadi Warm Amber & Gold.
- **Aturan Warna Hijau**: Warna hijau zamrud (`#34d399`) HANYA boleh dipakai untuk satu hal kecil: **titik radar live indicator (6px pulsing dot)** untuk menandakan sistem online, BUKAN untuk teks judul atau kartu.

---

## 6. VERIFIKASI AKHIR

1. Modifikasi seluruh file terkait secara nyata dan teliti.
2. Jalankan `npm run build` di terminal dan pastikan hasil build: `✓ Compiled successfully`, 0 error TypeScript.
3. Laporkan detail fitur yang telah diperkaya.
```
