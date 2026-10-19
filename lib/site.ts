/**
 * Static restaurant data shared by every locale.
 * Photos are hot-linked from Unsplash (free licence) for the portfolio demo —
 * swap them for the restaurant's own photography before going live.
 */

const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

export const photos = {
  hero: unsplash("1617196034796-73dfa7b1fd56", 2400), // nigiri on black slate
  counter: unsplash("1736773223073-da05038222c2"), // hinoki counter & stools
  chef: unsplash("1681270543584-8e541a1bb056"), // chef at work
  chefSushi: unsplash("1522701025355-3b334358d451"), // shaping nigiri
  knife: unsplash("1583394293211-45718f7eb6b0"), // knife work
  dashi: unsplash("1652088079703-38f4a8d6b981"), // clear broth
  fish: unsplash("1726452842860-e7e8066f3341"), // whole fish dish
  sake: unsplash("1561535893-bb7a98c7ee45"), // sake bottles & cups
  sakePour: unsplash("1664477407933-dd42ed0c6c62"),
  omakase: unsplash("1617196905100-216ffe128142"),
  sushi: unsplash("1667992852518-515da0acfae6"),
  sushi2: unsplash("1617196034738-26c5f7c977ce"),
  tempura: unsplash("1617196034564-65baf56380ab"),
  chopsticks: unsplash("1681270496598-13c5365730c8"),
} as const;

export const site = {
  name: "Tomoe",
  kanji: "巴",
  phone: "+34 900 000 000",
  phoneHref: "tel:+34900000000",
  email: "reserves@tomoe-bcn.example",
  address: {
    line1: "Carrer de València, 262",
    line2: "L'Eixample, 08007 Barcelona",
    country: "Spain",
  },
  mapsQuery: "Carrer de València 262, 08007 Barcelona",
  instagram: "https://www.instagram.com/",
  tripadvisor: "https://www.tripadvisor.com/",
  timeZone: "Europe/Madrid",
} as const;

export const mapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
  site.mapsQuery,
)}&z=16&output=embed`;

export const mapsOpenUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  site.mapsQuery,
)}`;

/* ---------- Opening hours (Barcelona dining rhythm) ---------- */

export type Service = { open: string; close: string };
/** 0 = Sunday … 6 = Saturday */
export const schedule: Record<number, { lunch?: Service; dinner?: Service }> = {
  0: { lunch: { open: "13:00", close: "16:00" } },
  1: {},
  2: { lunch: { open: "13:00", close: "16:00" }, dinner: { open: "20:00", close: "23:30" } },
  3: { lunch: { open: "13:00", close: "16:00" }, dinner: { open: "20:00", close: "23:30" } },
  4: { lunch: { open: "13:00", close: "16:00" }, dinner: { open: "20:00", close: "23:30" } },
  5: { lunch: { open: "13:00", close: "16:00" }, dinner: { open: "20:00", close: "23:30" } },
  6: { lunch: { open: "13:00", close: "16:00" }, dinner: { open: "20:00", close: "23:30" } },
};

export const lunchSlots = ["13:00", "13:30", "14:00"] as const;
export const dinnerSlots = ["20:00", "20:30", "21:00", "21:30", "22:00"] as const;

/* ---------- Menu ---------- */

export type MenuTag =
  | "vegetarian"
  | "vegetarianOption"
  | "glutenFree"
  | "fish"
  | "crustacean"
  | "mollusc"
  | "soy"
  | "gluten"
  | "sesame"
  | "egg"
  | "sulphites";

export type MenuItem = {
  id: string;
  jp: string;
  price: string;
  tags: MenuTag[];
};

export type MenuCategory = {
  id: "omakase" | "sushi" | "tempura" | "sake";
  photo: string;
  items: MenuItem[];
};

export const menu: MenuCategory[] = [
  {
    id: "omakase",
    photo: photos.omakase,
    items: [
      { id: "kiwami", jp: "極 おまかせ", price: "€145", tags: ["fish", "crustacean", "mollusc", "soy", "gluten", "sesame", "egg"] },
      { id: "shun", jp: "旬 おまかせ", price: "€98", tags: ["fish", "crustacean", "soy", "gluten", "sesame"] },
      { id: "lunch", jp: "昼の握り", price: "€55", tags: ["fish", "soy", "gluten"] },
      { id: "shojin", jp: "精進コース", price: "€85", tags: ["vegetarian", "soy", "sesame", "gluten"] },
    ],
  },
  {
    id: "sushi",
    photo: photos.sushi,
    items: [
      { id: "otoro", jp: "大トロ", price: "€12", tags: ["fish", "soy", "glutenFree"] },
      { id: "gamba", jp: "パラモスの赤海老", price: "€11", tags: ["crustacean", "soy"] },
      { id: "kinmedai", jp: "金目鯛 炙り", price: "€9", tags: ["fish", "soy"] },
      { id: "moriawase", jp: "刺身盛り合わせ", price: "€38", tags: ["fish", "mollusc", "soy", "glutenFree"] },
      { id: "nasu", jp: "茄子 握り", price: "€6", tags: ["vegetarian", "soy", "sesame"] },
    ],
  },
  {
    id: "tempura",
    photo: photos.tempura,
    items: [
      { id: "ebi", jp: "車海老 天ぷら", price: "€16", tags: ["crustacean", "gluten", "egg"] },
      { id: "yasai", jp: "季節の野菜天", price: "€14", tags: ["vegetarian", "gluten", "egg"] },
      { id: "anago", jp: "穴子 一本揚げ", price: "€19", tags: ["fish", "gluten", "egg", "soy"] },
      { id: "tendon", jp: "天丼（昼のみ）", price: "€24", tags: ["crustacean", "fish", "gluten", "egg", "soy", "vegetarianOption"] },
    ],
  },
  {
    id: "sake",
    photo: photos.sake,
    items: [
      { id: "dassai", jp: "獺祭 純米大吟醸 45", price: "€14 / €78", tags: ["sulphites"] },
      { id: "kokuryu", jp: "黒龍 吟醸", price: "€12 / €66", tags: [] },
      { id: "nabeshima", jp: "鍋島 特別純米", price: "€11 / €62", tags: [] },
      { id: "pairing", jp: "利き酒ペアリング", price: "€55", tags: ["sulphites"] },
    ],
  },
];
