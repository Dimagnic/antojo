# Antojo · Carta QR que vende sola

Plataforma SaaS de cartas digitales con QR para restaurantes en México.
Stack: **Next.js 16 (App Router) + Tailwind 4 + Supabase + Vercel**.

## Qué incluye este MVP

| Área | Funciones |
|---|---|
| Sitio público `/` | Landing, funciones, cómo funciona, precios en MXN, preguntas frecuentes |
| Cuenta `/registro` `/entrar` | Correo y contraseña o Google (Supabase Auth) |
| Alta guiada `/onboarding` | 1) Datos del negocio, 2) Platillos, 3) QR |
| Carta pública `/m/[slug]` | Pantalla de entrada, scroll vertical tipo TikTok con fotos y videos animados, categorías, vista en cuadrícula, menú lateral con idiomas ES/EN, ruleta "Juega y gana" con puntos, me gusta, preguntar por WhatsApp, compartir, carrito y pedido por WhatsApp, invitación a reseñar en Google, aviso de "cerrado" |
| Panel `/panel` | Resumen (visitas, QR PNG/SVG, abierto/cerrado, checklist), Platillos (categorías, fotos y videos, etiquetas, agotado), Métricas (visitas por día, horas pico, platillos más vistos), Ajustes |

Pestañas **Lealtad** y **Pedidos** aparecen como "Pronto" (fase 2).

---

## 1. Crear la base de datos en Supabase

1. Entra a <https://supabase.com> y crea un proyecto nuevo (región: `us-east-1` o la más cercana).
2. Ve a **SQL Editor → New query**, pega todo el contenido de `supabase/schema.sql` y presiona **Run**.
   Esto crea las tablas, la seguridad (RLS) y el bucket `media` para fotos y videos.
   Si ya habías corrido `schema.sql` antes, corre también `supabase/002_carta.sql` (agrega Juega y gana e Instagram).
3. Ve a **Authentication → URL Configuration**:
   - **Site URL**: `http://localhost:3000` (luego cámbialo por tu dominio de Vercel).
   - **Redirect URLs**: agrega `http://localhost:3000/auth/callback` y `https://TU-DOMINIO/auth/callback`.
4. (Opcional) **Authentication → Providers → Google** para el botón "Continuar con Google".
5. (Recomendado para pruebas) En **Authentication → Providers → Email** puedes desactivar "Confirm email" para entrar sin confirmar el correo.

## 2. Correr en tu computadora

```bash
npm install
cp .env.example .env.local   # en Windows: copy .env.example .env.local
# llena NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY
# (Supabase > Project Settings > API)
npm run dev
```

Abre <http://localhost:3000>, crea una cuenta y sigue el alta.

## 3. Subir a GitHub

```bash
git add .
git commit -m "Antojo MVP"
git branch -M main
git remote add origin https://github.com/Dimagnic/antojo.git
git push -u origin main
```

(Primero crea el repositorio vacío `antojo` en GitHub.)

## 4. Publicar en Vercel

1. En Vercel: **Add New → Project →** importa el repo `antojo`.
2. En **Environment Variables** agrega:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` = `https://tu-dominio.com` (sin `/` al final; es la URL que lleva el QR)
3. **Deploy**. Después actualiza el Site URL y Redirect URLs en Supabase con tu dominio.

> Importante: define `NEXT_PUBLIC_SITE_URL` **antes** de imprimir QRs. Si después cambias de dominio, los QR impresos dejan de apuntar a la carta.

---

## Estructura

```
src/
  app/
    page.tsx                 Landing
    (auth)/entrar|registro   Inicio de sesión y registro
    auth/callback/route.ts   Regreso de Google / confirmación de correo
    onboarding/              Alta guiada
    panel/                   Panel del restaurante
    m/[slug]/page.tsx        Carta pública
    actions.ts               Server Actions (guardar negocio, platillos, categorías)
  components/                MenuFeed, ProductManager, QrCard, BusinessForm, etc.
  lib/                       Supabase (cliente/servidor), datos, métricas, utilidades
  proxy.ts                   Protege /panel y /onboarding y refresca la sesión
supabase/schema.sql          Base de datos completa
public/brand/                Logo de Antojo (SVG/PNG)
```

## Siguientes fases (roadmap)

- **Fase 2 · Lealtad:** registro del cliente (nombre + WhatsApp), puntos por visita, ruleta "Juega y gana" con probabilidades calculadas en el servidor, cupones.
- **Fase 3 · Pedidos:** pedidos guardados en el panel, estados (pendiente → entregado), envíos con costo, impresión de comandas, pagos con Mercado Pago o Stripe en MXN.
- **Fase 4 · Marketing:** campañas por correo (Resend) y WhatsApp Business API para clientes que dejaron de venir.
- **Planes y cobro:** suscripciones con Stripe/Mercado Pago y límites por plan (el Básico promete hasta 15 platillos; aún no se aplica en el código).

---

Diseñado por **Cero+**
