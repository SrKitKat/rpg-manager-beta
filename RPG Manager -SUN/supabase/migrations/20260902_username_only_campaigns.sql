alter table public.campaigns
  add column if not exists invite_code text;

update public.campaigns
set invite_code = upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))
where invite_code is null;

alter table public.campaigns
  alter column invite_code set default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10)),
  alter column invite_code set not null;

create unique index if not exists campaigns_invite_code_unique
  on public.campaigns(invite_code);

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
