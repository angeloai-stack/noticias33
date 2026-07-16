-- Tabla de bitácora para /admin y /publicar
-- Ejecutar en Supabase → SQL Editor → New query → Run

create table if not exists publicaciones_log (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null check (status in ('success', 'error')),
  title text,
  wp_url text,
  error_message text,
  error_step text
);

create index if not exists idx_publicaciones_created_at
  on publicaciones_log (created_at desc);

create index if not exists idx_publicaciones_status
  on publicaciones_log (status);

-- Solo el service role (servidor Astro) accede vía REST.
alter table publicaciones_log enable row level security;
