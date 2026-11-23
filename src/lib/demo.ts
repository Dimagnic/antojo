import type { Category, Product } from "@/lib/types";
import { PHOTOS, photo } from "@/lib/site";

// Carta de ejemplo para /demo y la página principal. Fotos: Unsplash (licencia gratuita).

const cat = (id: string, name: string, name_en: string, position: number): Category => ({
  id,
  restaurant_id: "demo",
  name,
  name_en,
  position,
});

export const DEMO_CATEGORIES: Category[] = [
  cat("principales", "Principales", "Mains", 0),
  cat("hamburguesas", "Hamburguesas", "Burgers", 1),
  cat("pizzas", "Pizzas", "Pizzas", 2),
  cat("mexicano", "Mexicano", "Mexican", 3),
  cat("sushi", "Sushi", "Sushi", 4),
  cat("pastas", "Pastas", "Pasta", 5),
  cat("bowls", "Bowls", "Bowls", 6),
  cat("postres", "Postres", "Desserts", 7),
  cat("cafe", "Café", "Coffee", 8),
  cat("bebidas", "Bebidas", "Drinks", 9),
];

type P = [
  id: string,
  category: string,
  name: string,
  name_en: string,
  description: string,
  description_en: string,
  price: number,
  img: keyof typeof PHOTOS,
  tags?: string[],
  likes?: number,
];

const rows: P[] = [
  ["corte-fuego", "principales", "Corte al fuego", "Flame-grilled steak", "Corte de res a la parrilla, término a tu gusto, con cebollitas y chiles toreados.", "Grilled beef steak cooked to order, with charred onions and blistered chiles.", 289, "steak", ["Picante"], 340],
  ["arrachera", "principales", "Arrachera con ensalada", "Skirt steak with salad", "Arrachera marinada sellada a la plancha sobre hojas verdes y vinagreta de la casa.", "Marinated skirt steak seared on the griddle over greens and house vinaigrette.", 249, "steakSalad", ["Recomendado"], 212],
  ["parrillada", "principales", "Parrillada para dos", "Grill platter for two", "Selección de carnes a la parrilla con guarniciones para compartir.", "A selection of grilled meats with sides to share.", 459, "steakTray", [], 98],
  ["burger-antojo", "hamburguesas", "Burger Antojo", "Antojo Burger", "Carne de res de 180 g, queso cheddar, lechuga, jitomate y salsa de la casa en pan brioche.", "180 g beef patty, cheddar, lettuce, tomato and house sauce on a brioche bun.", 169, "burger", ["Recomendado"], 187],
  ["burger-doble", "hamburguesas", "Doble cheddar", "Double cheddar", "Doble carne, doble queso cheddar fundido y pepinillos.", "Double patty, double melted cheddar and pickles.", 199, "burgerDouble", [], 154],
  ["burger-clasica", "hamburguesas", "Clásica a la parrilla", "Classic grilled burger", "Carne a la parrilla, cebolla morada, jitomate y lechuga fresca.", "Grilled patty, red onion, tomato and fresh lettuce.", 149, "burgerDark", [], 76],
  ["pizza-margarita", "pizzas", "Pizza margarita", "Margherita pizza", "Masa de fermentación lenta, jitomate, mozzarella fresca y albahaca.", "Slow-fermented dough, tomato, fresh mozzarella and basil.", 189, "pizzaBoard", ["Vegetariano"], 133],
  ["pizza-pepperoni", "pizzas", "Pizza pepperoni", "Pepperoni pizza", "Mozzarella gratinada y pepperoni crujiente. La que nunca falla.", "Melted mozzarella and crispy pepperoni. Never fails.", 199, "pizzaPepperoni", [], 121],
  ["pizza-rustica", "pizzas", "Pizza rústica", "Rustic pizza", "Jitomates cherry, queso y romero sobre masa delgada.", "Cherry tomatoes, cheese and rosemary on a thin crust.", 209, "pizza", [], 64],
  ["tacos-asada", "mexicano", "Tacos de asada (3)", "Carne asada tacos (3)", "Tortilla de maíz, carne asada, cebolla, cilantro y salsa verde.", "Corn tortillas, grilled beef, onion, cilantro and green salsa.", 89, "tacos", ["Picante", "Recomendado"], 402],
  ["tacos-casa", "mexicano", "Tacos de la casa (3)", "House tacos (3)", "Guisado del día con pico de gallo y limón.", "Daily stew with pico de gallo and lime.", 95, "tacosPlate", [], 118],
  ["burrito", "mexicano", "Burrito de res", "Beef burrito", "Tortilla de harina rellena de res deshebrada, arroz, frijoles y queso.", "Flour tortilla filled with shredded beef, rice, beans and cheese.", 129, "burrito", [], 87],
  ["sushi-salmon", "sushi", "Roll de salmón y aguacate", "Salmon avocado roll", "8 piezas con salmón fresco, aguacate y salsa de soya.", "8 pieces with fresh salmon, avocado and soy sauce.", 169, "sushi", [], 95],
  ["sushi-philly", "sushi", "Roll philadelphia", "Philadelphia roll", "Salmón, queso crema y cebollín.", "Salmon, cream cheese and chives.", 159, "sushiRolls", [], 71],
  ["pasta-bolo", "pastas", "Penne a la boloñesa", "Penne bolognese", "Penne con salsa de carne cocinada lento y queso parmesano.", "Penne with slow-cooked meat sauce and parmesan.", 159, "pasta", [], 66],
  ["poke", "bowls", "Poke de pollo", "Chicken poke bowl", "Arroz, pollo, aguacate, verduras frescas y aderezo de ajonjolí.", "Rice, chicken, avocado, fresh vegetables and sesame dressing.", 149, "poke", ["Sin gluten"], 59],
  ["pastel", "postres", "Pastel de chocolate", "Chocolate cake", "Tres capas de chocolate con crema y cerezas.", "Three chocolate layers with cream and cherries.", 89, "cake", ["Nuevo"], 48],
  ["donas", "postres", "Donas glaseadas", "Glazed donuts", "Donas recién hechas con glaseado y chispas de colores.", "Freshly made donuts with glaze and sprinkles.", 59, "donut", [], 33],
  ["latte", "cafe", "Latte", "Latte", "Espresso doble con leche texturizada y arte latte.", "Double espresso with steamed milk and latte art.", 55, "latte", [], 41],
  ["coctel", "bebidas", "Mezcalita de la casa", "House mezcal cocktail", "Mezcal, limón, jarabe natural y sal de gusano.", "Mezcal, lime, natural syrup and worm salt.", 129, "cocktail", [], 52],
  ["cerveza", "bebidas", "Cerveza de barril", "Draft beer", "Clara u oscura, 500 ml bien fría.", "Lager or dark, 500 ml ice cold.", 69, "beer", [], 37],
];

export const DEMO_PRODUCTS: Product[] = rows.map(([id, category_id, name, name_en, description, description_en, price, img, tags = [], likes = 0], i) => ({
  id,
  restaurant_id: "demo",
  category_id,
  name,
  name_en,
  description,
  description_en,
  price,
  media_url: photo(PHOTOS[img], 1080, 1920),
  media_type: "image",
  tags,
  is_available: true,
  position: i,
  likes,
}));
