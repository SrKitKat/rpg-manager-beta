-- Login seguro por username e unicidade normalizada.
alter table public.profiles
  add column if not exists username_normalized text
  generated always as (lower(trim(username))) stored;

drop index if exists public.profiles_username_unique_ci;
create unique index profiles_username_unique_ci
  on public.profiles(username_normalized);

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
