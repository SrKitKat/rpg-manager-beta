-- Repara contas criadas/confirmadas antes da instalacao do trigger de profiles.
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

-- Reparo imediato das contas que ja existem em auth.users.
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
