-- Execute em projetos que ja receberam supabase/schema.sql anteriormente.

drop policy if exists campaigns_update_admin on public.campaigns;
create policy campaigns_update_admin on public.campaigns for update to authenticated
using (
  owner_user_id = auth.uid()
  or public.has_campaign_permission(id, 'administrarCampanha')
  or public.has_campaign_permission(id, 'editarConfiguracao')
)
with check (
  owner_user_id = auth.uid()
  or public.has_campaign_permission(id, 'administrarCampanha')
  or public.has_campaign_permission(id, 'editarConfiguracao')
);

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
