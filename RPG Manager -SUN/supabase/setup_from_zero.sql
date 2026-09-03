-- RPG Manager - recriacao completa do banco Supabase/PostgreSQL
-- ATENCAO: este arquivo APAGA todas as tabelas, funcoes, policies e dados
-- existentes no schema public antes de recriar a estrutura do RPG Manager.
-- Os usuarios de Authentication (auth.users) nao sao apagados.
-- Execute o arquivo inteiro, uma unica vez, no SQL Editor do Supabase.

begin;

drop schema if exists public cascade;
create schema public;

grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on schema public to postgres, service_role;

create extension if not exists pgcrypto;

create type public.campaign_role as enum ('mestre', 'jogador');
create type public.entity_visibility as enum ('campanha', 'proprietario', 'mestre', 'restrita');
create type public.entity_type as enum ('personagem', 'npc', 'adversario', 'monstro', 'auxiliar');
create type public.hissatsu_availability as enum ('liberada', 'bloqueada', 'oculta');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  username_normalized text generated always as (lower(trim(username))) stored,
  display_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_length check (char_length(username) between 2 and 50),
  constraint profiles_display_name_length check (char_length(display_name) between 1 and 100)
);
create unique index profiles_username_unique_ci on public.profiles (username_normalized);

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references public.profiles(id) on delete restrict default auth.uid(),
  name text not null,
  description text not null default '',
  system_key text,
  invite_code text not null default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10)),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint campaigns_name_length check (char_length(name) between 1 and 120),
  constraint campaigns_data_object check (jsonb_typeof(data) = 'object')
);
create index campaigns_owner_idx on public.campaigns(owner_user_id);
create unique index campaigns_invite_code_unique on public.campaigns(invite_code);

create table public.campaign_members (
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.campaign_role not null default 'jogador',
  permissions jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (campaign_id, user_id),
  constraint campaign_members_permissions_object check (jsonb_typeof(permissions) = 'object')
);
create index campaign_members_user_idx on public.campaign_members(user_id) where active;

create table public.entities (
  id text primary key default gen_random_uuid()::text,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  owner_user_id uuid references public.profiles(id) on delete set null,
  entity_type public.entity_type not null,
  visibility public.entity_visibility not null default 'campanha',
  allowed_user_ids uuid[] not null default '{}',
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint entities_data_object check (jsonb_typeof(data) = 'object')
);
create index entities_campaign_idx on public.entities(campaign_id);
create index entities_owner_idx on public.entities(owner_user_id);
create index entities_allowed_users_gin on public.entities using gin(allowed_user_ids);

create table public.campaign_notes (
  id text primary key default gen_random_uuid()::text,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  owner_user_id uuid not null references public.profiles(id) on delete cascade default auth.uid(),
  visibility public.entity_visibility not null default 'proprietario',
  allowed_user_ids uuid[] not null default '{}',
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint campaign_notes_data_object check (jsonb_typeof(data) = 'object')
);
create index campaign_notes_campaign_idx on public.campaign_notes(campaign_id);
create index campaign_notes_owner_idx on public.campaign_notes(owner_user_id);

create table public.campaign_hissatsu (
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  template_id text not null,
  availability public.hissatsu_availability not null default 'bloqueada',
  published_data jsonb,
  draft_data jsonb,
  presentation jsonb not null default '{}'::jsonb,
  mechanical_version integer not null default 0 check (mechanical_version >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (campaign_id, template_id),
  constraint campaign_hissatsu_template_length check (char_length(template_id) between 1 and 160),
  constraint campaign_hissatsu_published_object check (published_data is null or jsonb_typeof(published_data) = 'object'),
  constraint campaign_hissatsu_draft_object check (draft_data is null or jsonb_typeof(draft_data) = 'object'),
  constraint campaign_hissatsu_presentation_object check (jsonb_typeof(presentation) = 'object')
);

-- Funcoes SECURITY DEFINER evitam recursao nas policies de campaign_members.
create or replace function public.is_campaign_member(target_campaign uuid, target_user uuid default auth.uid())
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.campaign_members cm
    where cm.campaign_id = target_campaign and cm.user_id = target_user and cm.active
  );
$$;

create or replace function public.is_campaign_master(target_campaign uuid, target_user uuid default auth.uid())
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.campaign_members cm
    where cm.campaign_id = target_campaign and cm.user_id = target_user and cm.active and cm.role = 'mestre'
  );
$$;

create or replace function public.has_campaign_permission(target_campaign uuid, permission_name text, target_user uuid default auth.uid())
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.campaign_members cm
    where cm.campaign_id = target_campaign and cm.user_id = target_user and cm.active
      and (cm.role = 'mestre' or coalesce((cm.permissions ->> permission_name)::boolean, false))
  );
$$;

revoke all on function public.is_campaign_member(uuid, uuid) from public;
revoke all on function public.is_campaign_master(uuid, uuid) from public;
revoke all on function public.has_campaign_permission(uuid, text, uuid) from public;
grant execute on function public.is_campaign_member(uuid, uuid) to authenticated;
grant execute on function public.is_campaign_master(uuid, uuid) to authenticated;
grant execute on function public.has_campaign_permission(uuid, text, uuid) to authenticated;

create or replace function public.add_campaign_member_by_username(target_campaign uuid, target_username text)
returns void language plpgsql security definer set search_path = '' as $$
declare target_user uuid;
begin
  if not public.has_campaign_permission(target_campaign, 'administrarJogadores', auth.uid()) then
    raise exception 'Sem permissao para adicionar participantes';
  end if;
  select p.id into target_user from public.profiles p where lower(p.username) = lower(trim(target_username));
  if target_user is null then raise exception 'Usuario nao encontrado'; end if;
  insert into public.campaign_members(campaign_id, user_id, role, active)
  values(target_campaign, target_user, 'jogador', true)
  on conflict(campaign_id, user_id) do update set active = true, updated_at = now();
end;
$$;

create or replace function public.remove_campaign_member(target_campaign uuid, target_user uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not public.has_campaign_permission(target_campaign, 'administrarJogadores', auth.uid()) then
    raise exception 'Sem permissao para remover participantes';
  end if;
  if target_user = auth.uid() then raise exception 'Voce nao pode remover a propria participacao'; end if;
  if public.is_campaign_master(target_campaign, target_user) and
     (select count(*) from public.campaign_members where campaign_id=target_campaign and active and role='mestre') <= 1 then
    raise exception 'A campanha precisa manter pelo menos um Mestre';
  end if;
  delete from public.campaign_members where campaign_id=target_campaign and user_id=target_user;
end;
$$;

revoke all on function public.add_campaign_member_by_username(uuid, text) from public;
revoke all on function public.remove_campaign_member(uuid, uuid) from public;
grant execute on function public.add_campaign_member_by_username(uuid, text) to authenticated;
grant execute on function public.remove_campaign_member(uuid, uuid) to authenticated;

create or replace function public.join_campaign_by_code(code text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare target_campaign uuid;
begin
  if auth.uid() is null then raise exception 'Autenticacao necessaria'; end if;
  select c.id into target_campaign from public.campaigns c where c.invite_code = upper(trim(code));
  if target_campaign is null then raise exception 'Codigo de convite invalido'; end if;
  insert into public.campaign_members(campaign_id, user_id, role, active)
  values(target_campaign, auth.uid(), 'jogador', true)
  on conflict(campaign_id, user_id) do update set active = true, updated_at = now();
  return target_campaign;
end;
$$;
revoke all on function public.join_campaign_by_code(text) from public;
grant execute on function public.join_campaign_by_code(text) to authenticated;

create or replace function public.ensure_own_profile()
returns public.profiles language plpgsql security definer set search_path = '' as $$
declare
  result public.profiles;
  base_name text;
begin
  if auth.uid() is null then raise exception 'Autenticacao necessaria'; end if;
  select * into result from public.profiles where id = auth.uid();
  if found then return result; end if;

  base_name := coalesce(
    nullif(trim(auth.jwt() -> 'user_metadata' ->> 'username'), ''),
    nullif(split_part(auth.jwt() ->> 'email', '@', 1), ''),
    'usuario'
  );
  if exists(select 1 from public.profiles where username_normalized = lower(base_name)) then
    base_name := base_name || '-' || left(auth.uid()::text, 8);
  end if;

  insert into public.profiles(id, username, display_name)
  values (
    auth.uid(),
    base_name,
    coalesce(nullif(trim(auth.jwt() -> 'user_metadata' ->> 'display_name'), ''), base_name)
  ) returning * into result;
  return result;
end;
$$;

revoke all on function public.ensure_own_profile() from public;
grant execute on function public.ensure_own_profile() to authenticated;

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;

create or replace function public.protect_campaign_owner()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.owner_user_id <> old.owner_user_id then
    raise exception 'O proprietario da campanha nao pode ser alterado';
  end if;
  return new;
end;
$$;

create or replace function public.protect_entity_scope()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.campaign_id <> old.campaign_id then
    raise exception 'A campanha da entidade nao pode ser alterada';
  end if;
  if new.owner_user_id is distinct from old.owner_user_id
     and not public.is_campaign_master(old.campaign_id, auth.uid()) then
    raise exception 'Somente um Mestre pode transferir a propriedade';
  end if;
  return new;
end;
$$;

create or replace function public.protect_member_role()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.campaign_id <> old.campaign_id or new.user_id <> old.user_id then
    raise exception 'A identidade da participacao nao pode ser alterada';
  end if;
  if new.role <> old.role and not public.is_campaign_master(old.campaign_id, auth.uid()) then
    raise exception 'Somente um Mestre pode alterar papeis';
  end if;
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare base_name text;
begin
  base_name := coalesce(nullif(trim(new.raw_user_meta_data ->> 'username'), ''), split_part(new.email, '@', 1), 'usuario');
  insert into public.profiles(id, username, display_name)
  values (
    new.id,
    base_name,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), base_name)
  );
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- Triggers nao sao retroativos: cria profiles para contas anteriores ao schema.
with candidates as (
  select
    u.id,
    coalesce(nullif(trim(u.raw_user_meta_data ->> 'username'), ''), split_part(u.email, '@', 1), 'usuario') as base_name,
    coalesce(nullif(trim(u.raw_user_meta_data ->> 'display_name'), ''), nullif(trim(u.raw_user_meta_data ->> 'username'), ''), split_part(u.email, '@', 1), 'Usuario') as display_name
  from auth.users u
  left join public.profiles p on p.id = u.id
  where p.id is null
), ranked as (
  select *, row_number() over (partition by lower(base_name) order by id) as position
  from candidates
)
insert into public.profiles(id, username, display_name)
select
  r.id,
  case when r.position > 1 or exists(select 1 from public.profiles p where p.username_normalized = lower(r.base_name))
    then r.base_name || '-' || left(r.id::text, 8)
    else r.base_name
  end,
  r.display_name
from ranked r;

create or replace function public.add_campaign_owner_as_member()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.campaign_members(campaign_id, user_id, role)
  values (new.id, new.owner_user_id, 'mestre') on conflict do nothing;
  return new;
end;
$$;
create trigger campaign_owner_membership after insert on public.campaigns
for each row execute function public.add_campaign_owner_as_member();

create trigger campaigns_protect_owner before update on public.campaigns for each row execute function public.protect_campaign_owner();
create trigger entities_protect_scope before update on public.entities for each row execute function public.protect_entity_scope();
create trigger campaign_members_protect_role before update on public.campaign_members for each row execute function public.protect_member_role();

create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger campaigns_updated_at before update on public.campaigns for each row execute function public.set_updated_at();
create trigger campaign_members_updated_at before update on public.campaign_members for each row execute function public.set_updated_at();
create trigger entities_updated_at before update on public.entities for each row execute function public.set_updated_at();
create trigger campaign_notes_updated_at before update on public.campaign_notes for each row execute function public.set_updated_at();
create trigger campaign_hissatsu_updated_at before update on public.campaign_hissatsu for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_members enable row level security;
alter table public.entities enable row level security;
alter table public.campaign_notes enable row level security;
alter table public.campaign_hissatsu enable row level security;

create policy profiles_select_shared_campaign on public.profiles for select to authenticated
using (id = auth.uid() or exists (
  select 1 from public.campaign_members mine
  join public.campaign_members theirs on theirs.campaign_id = mine.campaign_id
  where mine.user_id = auth.uid() and mine.active and theirs.user_id = profiles.id and theirs.active
));
create policy profiles_update_self on public.profiles for update to authenticated
using (id = auth.uid()) with check (id = auth.uid());

create policy campaigns_select_member on public.campaigns for select to authenticated
using (public.is_campaign_member(id));
create policy campaigns_insert_owner on public.campaigns for insert to authenticated
with check (owner_user_id = auth.uid());
create policy campaigns_update_admin on public.campaigns for update to authenticated
using (owner_user_id = auth.uid() or public.has_campaign_permission(id, 'administrarCampanha') or public.has_campaign_permission(id, 'editarConfiguracao'))
with check (owner_user_id = auth.uid() or public.has_campaign_permission(id, 'administrarCampanha') or public.has_campaign_permission(id, 'editarConfiguracao'));
create policy campaigns_delete_owner on public.campaigns for delete to authenticated
using (owner_user_id = auth.uid());

create policy members_select_campaign on public.campaign_members for select to authenticated
using (public.is_campaign_member(campaign_id));
create policy members_insert_admin on public.campaign_members for insert to authenticated
with check (
  exists(select 1 from public.campaigns c where c.id = campaign_id and c.owner_user_id = auth.uid())
  or public.has_campaign_permission(campaign_id, 'administrarJogadores')
);
create policy members_update_permissions_admin on public.campaign_members for update to authenticated
using (public.has_campaign_permission(campaign_id, 'administrarPermissoes'))
with check (public.has_campaign_permission(campaign_id, 'administrarPermissoes'));
create policy members_delete_admin on public.campaign_members for delete to authenticated
using (user_id <> auth.uid() and public.has_campaign_permission(campaign_id, 'administrarJogadores'));

create policy entities_select_authorized on public.entities for select to authenticated using (
  public.is_campaign_member(campaign_id) and (
    public.is_campaign_master(campaign_id) or owner_user_id = auth.uid() or visibility = 'campanha'
    or (visibility = 'restrita' and auth.uid() = any(allowed_user_ids))
  )
);
create policy entities_insert_authorized on public.entities for insert to authenticated with check (
  public.is_campaign_member(campaign_id) and (
    (entity_type = 'personagem' and owner_user_id = auth.uid() and public.has_campaign_permission(campaign_id, 'criarPersonagens'))
    or (entity_type = 'npc' and public.has_campaign_permission(campaign_id, 'criarNPCs'))
    or (entity_type = 'adversario' and public.has_campaign_permission(campaign_id, 'criarAdversarios'))
    or (entity_type = 'monstro' and public.has_campaign_permission(campaign_id, 'criarMonstros'))
    or (entity_type = 'auxiliar' and public.has_campaign_permission(campaign_id, 'criarAuxiliares'))
    or public.is_campaign_master(campaign_id)
  )
);
create policy entities_update_authorized on public.entities for update to authenticated
using (public.is_campaign_master(campaign_id) or public.has_campaign_permission(campaign_id, 'editarQualquerPersonagem') or (owner_user_id = auth.uid() and public.has_campaign_permission(campaign_id, 'editarPropriosPersonagens')))
with check (public.is_campaign_member(campaign_id) and (public.is_campaign_master(campaign_id) or public.has_campaign_permission(campaign_id, 'editarQualquerPersonagem') or owner_user_id = auth.uid()));
create policy entities_delete_authorized on public.entities for delete to authenticated
using (public.is_campaign_master(campaign_id) or public.has_campaign_permission(campaign_id, 'excluirQualquerPersonagem') or (owner_user_id = auth.uid() and public.has_campaign_permission(campaign_id, 'excluirPropriosPersonagens')));

create policy notes_select_authorized on public.campaign_notes for select to authenticated using (
  public.is_campaign_member(campaign_id) and (
    public.is_campaign_master(campaign_id) or owner_user_id = auth.uid() or visibility = 'campanha'
    or (visibility = 'restrita' and auth.uid() = any(allowed_user_ids))
  )
);
create policy notes_insert_owner on public.campaign_notes for insert to authenticated
with check (public.is_campaign_member(campaign_id) and owner_user_id = auth.uid());
create policy notes_update_authorized on public.campaign_notes for update to authenticated
using (owner_user_id = auth.uid() or public.is_campaign_master(campaign_id))
with check (public.is_campaign_member(campaign_id) and (owner_user_id = auth.uid() or public.is_campaign_master(campaign_id)));
create policy notes_delete_authorized on public.campaign_notes for delete to authenticated
using (owner_user_id = auth.uid() or public.is_campaign_master(campaign_id));

create policy hissatsu_select_campaign on public.campaign_hissatsu for select to authenticated
using (public.is_campaign_member(campaign_id) and (availability <> 'oculta' or public.has_campaign_permission(campaign_id, 'visualizarConteudoOculto')));
create policy hissatsu_insert_admin on public.campaign_hissatsu for insert to authenticated
with check (public.has_campaign_permission(campaign_id, 'editarConfiguracao'));
create policy hissatsu_update_admin on public.campaign_hissatsu for update to authenticated
using (public.has_campaign_permission(campaign_id, 'editarConfiguracao'))
with check (public.has_campaign_permission(campaign_id, 'editarConfiguracao'));
create policy hissatsu_delete_admin on public.campaign_hissatsu for delete to authenticated
using (public.has_campaign_permission(campaign_id, 'editarConfiguracao'));

grant usage on schema public to authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.campaigns, public.campaign_members, public.entities, public.campaign_notes, public.campaign_hissatsu to authenticated;
revoke all on all tables in schema public from anon;

commit;
