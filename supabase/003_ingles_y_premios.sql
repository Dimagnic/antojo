-- =========================================================
-- Antojo · Migración 003: carta en inglés y premios de la ruleta
-- Ejecuta en Supabase > SQL Editor DESPUÉS de 002_carta.sql
-- =========================================================

alter table public.categories add column if not exists name_en text;
alter table public.products   add column if not exists name_en text;
alter table public.products   add column if not exists description_en text;

-- Premios ganados en la ruleta (el cliente deja su correo para guardarlo)
create table if not exists public.prize_claims (
  id            bigint generated always as identity primary key,
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  email         text not null,
  points        int  not null default 0,
  created_at    timestamptz not null default now()
);
create index if not exists prize_claims_restaurant_idx on public.prize_claims(restaurant_id, created_at desc);

alter table public.prize_claims enable row level security;
drop policy if exists "guardar premio" on public.prize_claims;
create policy "guardar premio" on public.prize_claims for insert
  with check (points between 0 and 1000 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$');
drop policy if exists "dueno lee premios" on public.prize_claims;
create policy "dueno lee premios" on public.prize_claims for select
  using (exists (select 1 from public.restaurants r where r.id = restaurant_id and r.owner_id = auth.uid()));
