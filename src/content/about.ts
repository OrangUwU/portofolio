export const ABOUT_ME = {
  name: "Achmad Taufiqur Rachman",
  nickname: "Taufiq / Opek",
  role: "Full Stack Engineer & Tech Researcher",
  location: "Banyuwangi, East Java",
  bio: "Siswa SMAN 1 Giri (XI-2 Arcanova) yang berfokus pada pengembangan perangkat lunak, GIS (Geographic Information System), dan riset data. Menggabungkan arsitektur kode modern dengan solusi empiris untuk masalah nyata, mulai dari logistik pintar, pariwisata, hingga intervensi perilaku.",
  interests: ["Mobile Dev", "Data Research", "UI/UX Design", "Trading XAU/USD", "Gemology"],
} as const;

export const SKILLS = {
  frontend: ["React Native", "Expo", "Tailwind CSS", "Framer Motion"],
  backend: ["Node.js", "Express", "TypeScript", "Socket.io"],
  database: ["SQLite", "3-house cluster schema"],
  tools_and_gis: ["Mapbox GL", "WhatsApp Cloud API", "MetaTrader 5"],
} as const;

export type AboutMe = typeof ABOUT_ME;
export type Skills = typeof SKILLS;
