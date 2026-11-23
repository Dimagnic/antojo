import { PHOTOS } from "@/lib/site";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  cover: keyof typeof PHOTOS;
  coverTitle: string;
  date: string;
  body: { h?: string; p?: string; list?: string[] }[];
};

export const POSTS: Post[] = [
  {
    slug: "como-crear-una-carta-qr",
    title: "Cómo crear una carta QR para tu restaurante (guía paso a paso)",
    excerpt: "Qué es una carta QR, cómo hacerla en minutos y los errores que hacen que tu menú digital venda menos.",
    cover: "pizzaBoard",
    coverTitle: "Crea tu carta QR.",
    date: "2026-11-21",
    body: [
      { p: "Una carta QR es tu menú en el celular del cliente: escanea un código en la mesa y ve tus platillos al instante, sin descargar nada. Bien hecha, no solo sustituye al papel: vende más." },
      { h: "1. Prepara tus platillos" },
      { p: "Empieza con tus 10 más vendidos. Para cada uno necesitas nombre, precio, una descripción corta que antoje y una foto vertical bien iluminada." },
      { h: "2. Agrúpalos en pocas categorías" },
      { p: "Entre 4 y 8 categorías es lo ideal: Entradas, Tacos, Bebidas, Postres. Si el cliente tiene que pensar dónde buscar, pide menos." },
      { h: "3. Crea tu carta y descarga el QR" },
      { p: "En Antojo registras tu negocio, subes tus platillos y descargas el QR en PNG o SVG. El QR no cambia aunque cambies precios, así que lo imprimes una sola vez." },
      { h: "Errores que bajan las ventas" },
      { list: ["Subir un PDF: se ve diminuto en el celular y nadie hace zoom.", "Fotos oscuras o tomadas desde lejos.", "Precios desactualizados: generan desconfianza en la mesa.", "QR pequeño o escondido: ponlo visible en cada mesa y en el mostrador."] },
    ],
  },
  {
    slug: "mas-resenas-en-google-maps",
    title: "Cómo conseguir más reseñas en Google Maps para tu restaurante",
    excerpt: "Pedir la reseña en el momento justo multiplica las opiniones. Te explicamos cómo hacerlo sin incomodar y sin romper las reglas de Google.",
    cover: "steak",
    coverTitle: "Más reseñas. Más visitas.",
    date: "2026-11-21",
    body: [
      { p: "Las reseñas son lo primero que ve un cliente nuevo antes de elegir dónde comer. Más reseñas recientes = más confianza y mejor posición en Google Maps." },
      { h: "Pide en el momento justo" },
      { p: "El mejor momento es cuando el cliente acaba de disfrutar: al terminar de ver la carta o después de hacer su pedido. Antojo muestra una invitación con un botón que lleva directo a tu perfil de Google." },
      { h: "Hazlo fácil" },
      { p: "Un toque y listo. Si el cliente tiene que buscar tu negocio en Google, no lo hará. Usa el enlace directo de reseña (con tu Place ID)." },
      { h: "Lo que no debes hacer" },
      { list: ["No regales premios, descuentos ni puntos a cambio de reseñas: Google lo prohíbe y puede borrar tus opiniones.", "No pidas solo a los clientes contentos: invita a todos por igual.", "No escribas reseñas falsas ni pidas a tu equipo que las haga."] },
      { h: "Responde siempre" },
      { p: "Agradece las buenas y responde con calma las malas. Los clientes nuevos leen tus respuestas tanto como las reseñas." },
    ],
  },
  {
    slug: "carta-qr-vs-pdf",
    title: "Carta QR interactiva vs. menú en PDF: cuál vende más",
    excerpt: "Un PDF es una foto de tu menú de papel. Una carta interactiva es un vendedor que trabaja en cada mesa.",
    cover: "burgerDouble",
    coverTitle: "Gestión o experiencia.",
    date: "2026-11-21",
    body: [
      { p: "Muchos negocios pusieron un QR que abre un PDF y sienten que ya son digitales. El problema: el PDF se ve pequeño, carga lento y no se puede cambiar sin volver a subirlo." },
      { h: "Qué gana tu negocio con una carta interactiva" },
      { list: ["Fotos y videos grandes que abren el apetito.", "Precios que cambias en segundos desde el celular.", "Pedidos por WhatsApp con el carrito ya armado.", "Invitación a reseñar en Google al terminar.", "Datos: qué platillos se ven más y a qué hora llega la gente."] },
      { h: "¿Y si ya tengo punto de venta?" },
      { p: "No compiten: tu punto de venta cobra y lleva la caja; la carta interactiva vende y atrae clientes. Se complementan." },
    ],
  },
];
