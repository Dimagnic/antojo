export type Restaurant = {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  country: string;
  currency: string;
  whatsapp: string | null;
  maps_url: string | null;
  google_place_id: string | null;
  logo_url: string | null;
  is_open: boolean;
  review_prompt: boolean;
  instagram_url: string | null;
  game_enabled: boolean;
  created_at: string;
};

export type Category = {
  id: string;
  restaurant_id: string;
  name: string;
  name_en?: string | null;
  position: number;
};

export type Product = {
  id: string;
  restaurant_id: string;
  category_id: string | null;
  name: string;
  name_en?: string | null;
  description: string | null;
  description_en?: string | null;
  price: number;
  media_url: string | null;
  media_type: "image" | "video" | null;
  tags: string[];
  is_available: boolean;
  position: number;
  likes: number;
};
