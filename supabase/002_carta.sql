-- =========================================================
-- Antojo · Migración 002: carta completa
-- (Juega y gana, Instagram, nuevos eventos)
-- Ejecuta este archivo en Supabase > SQL Editor DESPUÉS de schema.sql
-- =========================================================

alter table public.restaurants add column if not exists instagram_url text;
alter table public.restaurants add column if not exists game_enabled boolean not null default true;

alter table public.events drop constraint if exists events_type_check;
alter table public.events add constraint events_type_check
  check (type in ('visit','view','add_cart','whatsapp_order','review_click','like','spin','share','comment'));
