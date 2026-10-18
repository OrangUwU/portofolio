export type ProjectCategory = "Product" | "Research" | "Film" | "Branding";

export type WorkflowStep = {
  step: string;
  title: string;
  desc: string;
};

export type CaseStudyDetail = {
  role: string;
  timeline: string;
  problem: string;
  solution: string;
  workflowSteps?: WorkflowStep[];
  metrics?: string[];
  deliverables: string[];
  externalUrl?: string;
};

export type LookbookItem = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  category: string;
  spec: string;
  description: string;
  philosophy?: string;
};

export type Project = {
  id: string;
  title: string;
  category: ProjectCategory;
  year: string;
  summary: string;
  description: string;
  stack: string[];
  highlight: string;
  highlights?: string[];
  role?: string;
  context?: string;
  image?: string;
  status?: string;
  signal?: string;
  codeUrl?: string;
  demoUrl?: string;
  videoUrl?: string;
  links?: { label: string; href: string }[];
  caseStudy?: CaseStudyDetail;
  lookbook?: LookbookItem[];
};

export const projects: Project[] = [
  {
    id: "ijen-care",
    title: "IJEN-CARE: Geotourism Ride-Hailing",
    category: "Product",
    year: "2025 — 2026",
    summary: "Aplikasi ride-hailing geowisata real-time untuk wilayah Kawah Ijen & Banyuwangi.",
    description:
      "Aplikasi ride-hailing geowisata real-time untuk wilayah Banyuwangi. Melibatkan wawancara stakeholder pariwisata lokal untuk membangun ekosistem digital yang tepat sasaran.",
    stack: ["React Native", "Expo", "Mapbox GL", "Node.js Express", "Socket.io", "SQLite"],
    highlight: "Sistem tracking real-time",
    highlights: ["Sistem tracking real-time", "Integrasi peta interaktif", "Riset stakeholder empiris"],
    role: "Lead Developer & Researcher",
    context: "OPSI & IMPACT 2026",
    image: "/ijen-care-preview.jpg",
    status: "Active · Live Case",
    signal: "30+ Drivers Onboarded · <2s Realtime Latency",
    codeUrl: "https://github.com/achmadtaufiqurrachman",
    demoUrl: "#",
    links: [{ label: "Case Study", href: "#" }],
    caseStudy: {
      role: "Lead Developer & Researcher — OPSI & IMPACT 2026",
      timeline: "Aug 2025 — Feb 2026 (6 bulan)",
      problem:
        "Akses Kawah Ijen belum terintegrasi. Wisatawan kesulitan menemukan driver lokal terpercaya; pemesanan masih manual via WhatsApp tanpa tracking realtime.",
      solution:
        "Membangun ride-hailing geotourism dengan live tracking Mapbox GL, order flow realtime Socket.io, dan dashboard monitoring trip. Riset OPSI & IMPACT jadi fondasi validasi stakeholder.",
      metrics: ["30+ driver lokal ter-onboarding (simulasi)", "Order flow < 2s latency (realtime)", "80+ responden wisatawan & pelaku wisata"],
      deliverables: ["Mobile App (React Native + Expo)", "Backend API (Express + SQLite)", "Realtime Service (Socket.io)", "Laporan OPSI & Poster IMPACT 2026"],
      externalUrl: "#",
    },
  },
  {
    id: "smart-node-logistics",
    title: "Smart-Node Logistics (IEFC ITB)",
    category: "Product",
    year: "2025",
    summary: "Sistem logistik pintar berbasis QR Smart Bin, WhatsApp Webhook VPS & optimasi rute DVRP.",
    description:
      "Sistem logistik pintar (Human-as-a-Sensor) untuk DLH Banyuwangi: warga scan QR code pada smart bin klaster 3-rumah, auto-redirect ke WhatsApp ('penuh 1', 'penuh 2', 'penuh 3'), diproses oleh Webhook di VPS, lalu masuk real-time ke dashboard web untuk optimasi rute armada truk sampah (DVRP).",
    stack: ["TypeScript", "Node.js VPS", "Mapbox GL", "WhatsApp Cloud API", "QR Smart Bin", "DVRP 2-Opt"],
    highlight: "Scan QR Bin → Auto WA ('penuh 1/2/3') → Webhook VPS → Live DVRP",
    highlights: [
      "Scan Smart Bin (QR Code) klaster 3-rumah",
      "Auto-Redirect WhatsApp draf pesan ('penuh 1', 'penuh 2', 'penuh 3')",
      "Webhook WhatsApp Cloud API terhubung ke server VPS",
      "Live Input ke Web GIS & optimasi rute DVRP (Nearest Neighbor + 2-Opt)",
    ],
    role: "System Architect",
    context: "IEFC ITB · DLH Banyuwangi",
    image: "/smart-node-preview.png",
    status: "Active · Live Sync",
    signal: "QR Smart Bin → WA Webhook VPS · -21.5% DVRP Route",
    codeUrl: "https://github.com/achmadtaufiqurrachman",
    demoUrl: "https://ijencare.my.id",
    links: [{ label: "Case Study", href: "#" }],
    caseStudy: {
      role: "System Architect — IEFC ITB Prototype (DLH Banyuwangi)",
      timeline: "2025",
      problem:
        "Pelaporan keterisian tempat sampah warga di klaster perumahan belum terintegrasi secara real-time dengan penjadwalan armada, menyebabkan truk sampah harus menyisir seluruh titik secara tidak efisien.",
      solution:
        "Merancang ekosistem Human-as-a-Sensor berbasis QR Code Smart Bin pada klaster 3-rumah (Micro-Hub) yang terhubung ke WhatsApp Webhook di VPS dan engine optimasi rute dinamis DVRP (Nearest Neighbor + 2-Opt).",
      workflowSteps: [
        {
          step: "01",
          title: "Scan Smart Bin (QR Code)",
          desc: "Warga atau petugas melakukan scan QR code unik yang tertera pada smart bin di klaster perumahan (Micro-Hub 3 rumah).",
        },
        {
          step: "02",
          title: "Auto-Redirect WhatsApp",
          desc: "Hasil scan otomatis membuka aplikasi WhatsApp dengan draf pesan otomatis sesuai lokasi & status bin ('penuh 1', 'penuh 2', 'penuh 3').",
        },
        {
          step: "03",
          title: "Webhook ke Server VPS",
          desc: "Pesan dikirim dan diterima secara instan oleh endpoint Webhook WhatsApp Cloud API (POST /webhook/whatsapp) yang berjalan di server VPS.",
        },
        {
          step: "04",
          title: "Live Input ke Web & Optimasi DVRP",
          desc: "Data keterisian bin otomatis ter-update secara real-time di dashboard Web GIS dan sistem menghitung rute truk sampah teroptimal dengan algoritma DVRP.",
        },
      ],
      metrics: [
        "66.7% Stop Density Reduction (Konsolidasi 3 rumah → 1 Micro-Hub komunal)",
        "-21.5% s/d -30% Route & Fuel Efficiency (Nearest Neighbor + 2-Opt DVRP)",
        "< 24 Jam Anaerobic Window Guard (Bypass organik langsung ke Maggot BSF)",
      ],
      deliverables: [
        "Web GIS Dashboard (Mapbox GL)",
        "QR Code Smart Bin Generator",
        "WhatsApp Cloud API Webhook (VPS)",
        "DVRP 2-Opt Dynamic Routing Engine",
        "Status & Retribution Ledger (3-House Cluster)",
      ],
      externalUrl: "https://ijencare.my.id",
    },
  },
  {
    id: "student-behavior-research",
    title: "Intervensi Digital & Analisis Perilaku Siswa",
    category: "Research",
    year: "2025",
    summary: "Analisis penyebab perilaku siswa membolos ke area foodcourt.",
    description:
      "Penelitian pengolahan data berjudul 'Analisis Penyebab Perilaku Siswa Membolos ke Area Foodcourt Saat Jam Pembelajaran'.",
    stack: ["Data Analysis", "Likert Scale", "Questionnaire Design"],
    highlight: "Pengumpulan data kuantitatif",
    highlights: ["Pengumpulan data kuantitatif", "Analisis skala Likert", "Penyusunan struktur laporan empiris"],
    role: "Co-Researcher (bersama Arya Bagus Pratama)",
    context: "SMAN 1 Giri Academic Research",
    status: "Completed · Research",
    signal: "Likert Scale Instrument · Empirical Modeling",
    links: [{ label: "Case Study", href: "#" }],
    caseStudy: {
      role: "Co-Researcher (bersama Arya Bagus Pratama)",
      timeline: "Jan — Mar 2025",
      problem:
        "Perilaku membolos siswa ke area foodcourt saat jam pembelajaran belum terpetakan dengan instrumen yang terstruktur.",
      solution:
        "Merancang kuesioner skala Likert, pengumpulan data kuantitatif, dan analisis deskriptif untuk menyusun laporan empiris dan rekomendasi intervensi.",
      metrics: ["Instrumen Likert terstruktur", "Pengumpulan data kuantitatif lapangan", "Laporan empiris terstruktur"],
      deliverables: ["Instrumen Kuesioner", "Dataset & Analisis Likert", "Laporan Penelitian"],
    },
  },
  {
    id: "kampung-bethek-doc",
    title: "Kampung Bethek Documentary",
    category: "Film",
    year: "2025",
    summary: "News-vlog 5 menit — ekosistem warung dekat De Djawatan.",
    description:
      "News-vlog dokumenter pendek berdurasi 5 menit yang mengangkat ekosistem warung kuliner di area Kampung Bethek, dekat De Djawatan.",
    stack: ["Video Editing", "Scriptwriting", "Voiceover"],
    highlight: "Manajemen workflow editing",
    highlights: ["Manajemen workflow editing", "Storyboarding", "Dokumentasi lokal"],
    role: "Director & Scriptwriter",
    context: "Multimedia Project",
    status: "Published · Live Stream",
    signal: "5′26″ Short News-Vlog · De Djawatan Corridor",
    links: [{ label: "Watch Video", href: "#" }],
    videoUrl: "/kampung-bethek.mov",
    caseStudy: {
      role: "Director & Scriptwriter",
      timeline: "Apr — Mei 2025 (3 minggu produksi)",
      problem:
        "Ekosistem warung kuliner Kampung Bethek dekat De Djawatan belum terdokumentasi sebagai narasi ekonomi lokal yang hidup.",
      solution:
        "Produksi news-vlog 5 menit dengan observasi lapangan, interview pedagang, voiceover naratif, dan editing Premiere Pro dengan sound design ringan.",
      metrics: ["Durasi final 5′ + teaser 30s", "8+ warung terliput", "Workflow: script → VO → cut → mix"],
      deliverables: ["Naskah & Storyboard", "Voiceover Recording", "Final Cut 5′ + Teaser"],
      externalUrl: "#",
    },
  },
  {
    id: "arcanova-branding",
    title: "Arcanova XI-2 Brand Identity",
    category: "Branding",
    year: "2024 — 2025",
    summary: "Workshirt, patch & emblem — visual Yunani klasik.",
    description:
      "Manajemen organisasi kelas dan perancangan identitas visual yang mengusung elemen Yunani klasik dengan slogan 'gnosi ine dynami' dan 'NO TURNING BACK'.",
    stack: ["Vector Design", "Apparel Design", "Project Management"],
    highlight: "Desain custom workshirt & emblem",
    highlights: ["Desain custom workshirt & emblem", "Manajemen order list & absensi", "Koordinasi display Pohon Harapan"],
    role: "Lead Designer & Secretary",
    context: "Class Organization",
    image: "/arcanova-workshirt.jpg",
    status: "Official Release · Archived",
    signal: "Heavyweight Cotton Drill · Merrowed Edge Crest",
    links: [{ label: "Lookbook", href: "#" }],
    lookbook: [
      {
        id: "workshirt",
        title: "Custom Workshirt XI-2",
        subtitle: "Official Class Apparel · Heavyweight Cotton Drill",
        image: "/arcanova-workshirt.jpg",
        category: "Apparel & Silhouette",
        spec: "Heavyweight Cotton Drill · Twin Utility Pockets · Embroidered 'gnosi ine dynami' Chest Tag",
        description:
          "Seragam identitas kelas dengan siluet modern streetwear taktikal. Dilengkapi saku ganda fungsional, kancing resin hitam doff, bordir presisi di dada kanan, serta patch velcro di lengan kiri.",
        philosophy:
          "Didesain sebagai seragam kebersamaan yang tangguh, fungsional, dan dapat dikenakan sehari-hari (wearable pride).",
      },
      {
        id: "patch",
        title: "Embroidered Patch — 'NO TURNING BACK'",
        subtitle: "High-Density Merrowed Edge Patch",
        image: "/arcanova-patch.jpg",
        category: "Patch & Insignia",
        spec: "High-density woven twill · 8.5 × 4.0 cm · Merrowed border · Iron-on & sew backing",
        description:
          "Patch bordir densitas tinggi dengan tipografi sans-serif kontras monokrom. Dirancang untuk dipasang pada bagian lengan atau panel belakang jaket.",
        philosophy:
          "'NO TURNING BACK' merepresentasikan komitmen tak kenal surut para siswa XI-2 dalam menempuh jenjang akademik dan tantangan masa depan.",
      },
      {
        id: "emblem",
        title: "Circular Crest — 'gnosi ine dynami'",
        subtitle: "Greek Laurel Wreath & Wisdom Torch Emblem",
        image: "/arcanova-emblem.jpg",
        category: "Crest & Emblem",
        spec: "7.5 cm diameter · Silver-grey & white thread · Laurel wreath & Torch of Knowledge",
        description:
          "Lambang kehormatan kelas XI-2 SMAN 1 Giri berbentuk lingkaran simetris dengan karangan daun salam (laurel) klasik dan obor kebijaksanaan.",
        philosophy:
          "'gnosi ine dynami' (γνῶσις εἶνε δύναμις) berasal dari bahasa Yunani kuno yang berarti 'Pengetahuan adalah Kekuatan'.",
      },
    ],
    caseStudy: {
      role: "Lead Designer & Secretary — Arcanova XI-2",
      timeline: "Sep 2024 — Jan 2025",
      problem:
        "Kelas XI-2 membutuhkan identitas kolektif yang kuat dan wearable untuk kebanggaan angkatan.",
      solution:
        "Merancang sistem identitas workshirt, patch bordir, dan emblem dengan referensi Yunani klasik — tipografi gnosi ine dynami dan statement NO TURNING BACK.",
      metrics: ["1 workshirt + 2 patch variants", "Produksi bordir & sablon manual"],
      deliverables: ["Workshirt Design", "Patch & Emblem Set", "Lookbook & Mockup"],
    },
  },
];

export const categories: (ProjectCategory | "All")[] = ["All", "Product", "Research", "Film", "Branding"];
