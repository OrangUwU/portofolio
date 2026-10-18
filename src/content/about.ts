export const ABOUT_ME = {
  name: "Achmad Taufiqur Rachman",
  nickname: "Taufiq / Opek",
  role: "Mobile & Full-Stack Builder · Geotourism & Spatial Systems",
  tagline:
    "Mobile & Full-Stack Builder specializing in Geotourism & Spatial Systems. Rapid prototyping, clean architecture, and shipping fast.",
  location: "Banyuwangi, East Java",
  bio: "Siswa SMAN 1 Giri (XI-2 Arcanova) yang berfokus pada pengembangan perangkat lunak mobile & full-stack, GIS (Geographic Information System), dan riset data. Menggabungkan rapid prototyping, clean architecture, dan solusi empiris untuk masalah nyata — mulai dari ride-hailing geowisata Kawah Ijen hingga logistik pintar DVRP.",
  interests: ["Mobile Dev", "Spatial GIS", "Data Research", "UI/UX Design", "Rapid Prototyping"],
} as const;

export const SKILLS = {
  mobile: ["React Native", "Expo"],
  spatial_gis: ["Mapbox GL", "Geospatial Routing"],
  backend: ["Node.js", "Express.js", "Socket.io", "SQLite"],
  languages: ["TypeScript", "JavaScript"],
  tools: ["VS Code", "Cursor", "Git", "Figma"],
  // Backwards-compatible aliases
  frontend: ["React Native", "Expo", "TypeScript", "JavaScript"],
  database: ["SQLite"],
  tools_and_gis: ["Mapbox GL", "Geospatial Routing", "VS Code", "Cursor", "Git", "Figma"],
} as const;

export type AboutMe = typeof ABOUT_ME;
export type Skills = typeof SKILLS;
