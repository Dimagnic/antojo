// ── Datos de contacto de Antojo (edítalos aquí; se usan en todo el sitio) ──
export const SITE = {
  whatsapp: "522224903701", // solo dígitos, con lada de país (52 = México)
  email: "", // ej. "hola@antojo.mx"
  instagram: "", // ej. "https://instagram.com/antojo.mx"
  facebook: "",
  tiktok: "",
};

export const waLink = (text: string) =>
  SITE.whatsapp ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}` : "/onboarding";

/** Foto de Unsplash (licencia gratuita) en la resolución pedida. */
export const photo = (id: string, w = 1080, h?: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ""}&q=80`;

export const PHOTOS = {
  burger: "1568901346375-23c9450c58cd",
  burgerDouble: "1572802419224-296b0aeee0d9",
  burgerDark: "1571091718767-18b5b1457add",
  burgerHand: "1550547660-d9450f859349",
  tacos: "1599974579688-8dbdd335c77f",
  tacosPlate: "1565299585323-38d6b0865b47",
  tacosBoard: "1551504734-5ee1c4a1479b",
  taco: "1545093149-618ce3bcf49d",
  pizza: "1513104890138-7c749659a591",
  pizzaBoard: "1565299624946-b28f40a0ae38",
  pizzaPepperoni: "1534308983496-4fabb1a015ee",
  pizzaCheese: "1593504049359-74330189a345",
  steak: "1600891964092-4316c288032e",
  steakSalad: "1588168333986-5078d3ae3976",
  steakTray: "1546964124-0cce460f38ef",
  grill: "1558030089-02acba3c214e",
  sushi: "1579584425555-c3ce17fd4351",
  sushiRolls: "1579871494447-9811cf80d66c",
  sushiVariety: "1553621042-f6e147245754",
  sushiBlack: "1611143669185-af224c5e3252",
  latte: "1541167760496-1628856ab772",
  latteTop: "1529892485617-25f63cd7b1e9",
  coffee: "1593443320739-77f74939d0da",
  burrito: "1626700051175-6818013e1d4f",
  burritoWrap: "1562059390-a761a084768e",
  poke: "1546069901-ba9599a7e63c",
  bowl: "1597958792579-bd3517df6399",
  pasta: "1621996346565-e3dbc646d9a9",
  pastaBlack: "1611270629569-8b357cb88da9",
  spaghetti: "1556761223-4c4282c73f77",
  cocktail: "1514362545857-3bc16c4c7d1b",
  cocktailLime: "1609951651556-5334e2706168",
  juice: "1551024709-8f23befc6f87",
  beer: "1608270586620-248524c67de9",
  beerGlass: "1566633806327-68e152aaf26d",
  donut: "1551024601-bec78aea704b",
  cake: "1606890737304-57a1ca8a5b62",
  cupcake: "1563729784474-d77dbb933a9e",
  oreo: "1563805042-7684c019e1cb",
} as const;
