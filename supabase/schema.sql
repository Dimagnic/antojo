-- =========================================================
-- Antojo · Esquema de base de datos (Supabase / Postgres)
-- Ejecuta este archivo completo en Supabase > SQL Editor.
-- =========================================================

create extension if not exists "pgcrypto";

-- ---------- Restaurantes ----------
create table if not exists public.restaurants (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null references auth.users(id) on delete cascade,
  name            text not null,
  slug            text not null unique,
  country         text not null default 'MX',
  currency        text not null default 'MXN',
  whatsapp        text,                 -- solo dígitos con lada, ej. 5212291234567
  maps_url        text,                 -- enlace de Google Maps del negocio
  google_place_id text,                 -- para el enlace directo de reseña
  logo_url        text,
  is_open         boolean not null default true,
  review_prompt   boolean not null default true,
  instagram_url   text,
  game_enabled    boolean not null default true,
  created_at      timestamptz not null default now()
);
create index if not exists restaurants_owner_idx on public.restaurants(owner_id);

-- ---------- Categorías ----------
create table if not exists public.categories (
  id            uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name          text not null,
  name_en       text,
  position      int  not null default 0,
  created_at    timestamptz not null default now()
);
create index if not exists categories_restaurant_idx on public.categories(restaurant_id);

-- ---------- Productos ----------
create table if not exists public.products (
  id            uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  category_id   uuid references public.categories(id) on delete set null,
  name          text not null,
  name_en       text,
  description   text,
  description_en text,
  price         numeric(10,2) not null default 0,
  media_url     text,
  media_type    text check (media_type in ('image','video')),
  tags          text[] not null default '{}',
  is_available  boolean not null default true,
  position      int  not null default 0,
  likes         int  not null default 0,
  created_at    timestamptz not null default now()
);
create index if not exists products_restaurant_idx on public.products(restaurant_id);

-- ---------- Eventos (métricas) ----------
create table if not exists public.events (
  id            bigint generated always as identity primary key,
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  product_id    uuid references public.products(id) on delete set null,
  type          text not null check (type in ('visit','view','add_cart','whatsapp_order','review_click','like','spin','share','comment')),
  created_at    timestamptz not null default now()
);
create index if not exists events_restaurant_time_idx on public.events(restaurant_id, created_at desc);

-- ---------- Seguridad (RLS) ----------
alter table public.restaurants enable row level security;
alter table public.categories  enable row level security;
alter table public.products    enable row level security;
alter table public.events      enable row level security;

-- Lectura pública de la carta
drop policy if exists "carta publica restaurantes" on public.restaurants;
create policy "carta publica restaurantes" on public.restaurants for select using (true);
drop policy if exists "carta publica categorias" on public.categories;
create policy "carta publica categorias" on public.categories for select using (true);
drop policy if exists "carta publica productos" on public.products;
create policy "carta publica productos" on public.products for select using (true);

-- El dueño administra lo suyo
drop policy if exists "dueno restaurantes" on public.restaurants;
create policy "dueno restaurantes" on public.restaurants for all
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "dueno categorias" on public.categories;
create policy "dueno categorias" on public.categories for all
  using (exists (select 1 from public.restaurants r where r.id = restaurant_id and r.owner_id = auth.uid()))
  with check (exists (select 1 from public.restaurants r where r.id = restaurant_id and r.owner_id = auth.uid()));

drop policy if exists "dueno productos" on public.products;
create policy "dueno productos" on public.products for all
  using (exists (select 1 from public.restaurants r where r.id = restaurant_id and r.owner_id = auth.uid()))
  with check (exists (select 1 from public.restaurants r where r.id = restaurant_id and r.owner_id = auth.uid()));

-- Eventos: cualquiera los registra (desde la carta), solo el dueño los lee
drop policy if exists "registrar eventos" on public.events;
create policy "registrar eventos" on public.events for insert with check (true);
drop policy if exists "dueno lee eventos" on public.events;
create policy "dueno lee eventos" on public.events for select
  using (exists (select 1 from public.restaurants r where r.id = restaurant_id and r.owner_id = auth.uid()));

-- Like público sin exponer UPDATE a anónimos
create or replace function public.like_product(p_id uuid)
returns int language sql security definer set search_path = public as $$
  update public.products set likes = likes + 1 where id = p_id returning likes;
$$;
grant execute on function public.like_product(uuid) to anon, authenticated;

-- ---------- Almacenamiento de fotos y videos ----------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Cada usuario sube solo dentro de su carpeta: media/<user_id>/...
drop policy if exists "media lectura publica" on storage.objects;
create policy "media lectura publica" on storage.objects for select using (bucket_id = 'media');
drop policy if exists "media subir propio" on storage.objects;
create policy "media subir propio" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "media borrar propio" on storage.objects;
create policy "media borrar propio" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);

-- Premios de la ruleta: ver 003_ingles_y_premios.sql (también aplica en instalaciones nuevas)
