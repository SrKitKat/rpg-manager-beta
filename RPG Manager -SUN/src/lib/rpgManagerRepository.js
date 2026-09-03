import { supabase } from "./supabase.js";

const PREFIXO_BANCO_HISSATSU = "rpg-manager-banco-hissatsu-campanha";

function removerCamposRelacionados(campanha) {
  const dados = { ...campanha };
  delete dados.participantes;
  delete dados.entidades;
  delete dados.anotacoes;
  delete dados.acesso;
  delete dados.usuarioAtualId;
  return dados;
}

function adaptarCampanha(row, membros, entidades, anotacoes, usuarioId) {
  const participantes = membros.map(m => ({
    id: m.user_id,
    nome: m.profiles?.display_name || m.profiles?.username || "Participante",
    ativo: m.active,
    permissoesExtras: m.permissions || {},
    acesso: { papel: m.role, permissoes: m.effective_permissions || m.permissions || {} },
    criadoEm: Date.parse(m.created_at),
    atualizadoEm: Date.parse(m.updated_at)
  }));
  const atual = participantes.find(p => p.id === usuarioId);
  return {
    ...row.data,
    id: row.id,
    nome: row.name,
    descricao: row.description || "",
    configuracaoId: row.system_key || "",
    inviteCode: row.invite_code,
    ownerUserId: row.owner_user_id,
    usuarioAtualId: usuarioId,
    participantes,
    acesso: atual?.acesso,
    entidades: entidades.map(e => ({ ...e.data, id: e.id, proprietarioId: e.owner_user_id, visibilidade: e.visibility, participantesPermitidos: e.allowed_user_ids || [] })),
    anotacoes: anotacoes.map(n => ({ ...n.data, id: n.id, proprietarioId: n.owner_user_id, visibilidade: n.visibility, participantesPermitidos: n.allowed_user_ids || [] })),
    criadaEm: Date.parse(row.created_at),
    atualizadaEm: Date.parse(row.updated_at)
  };
}

export async function carregarCampanhasRemotas(usuarioId) {
  const { error: erroPerfil } = await supabase.rpc("ensure_own_profile");
  if (erroPerfil) throw erroPerfil;

  const { data: associacoes, error } = await supabase.from("campaign_members").select("campaign_id").eq("user_id", usuarioId).eq("active", true);
  if (error) throw error;
  const ids = (associacoes || []).map(item => item.campaign_id);
  if (!ids.length) return [];

  const [campanhas, membros, entidades, anotacoes] = await Promise.all([
    supabase.from("campaigns").select("*").in("id", ids),
    supabase.from("campaign_members").select("*, profiles(display_name, username)").in("campaign_id", ids),
    supabase.from("entities").select("*").in("campaign_id", ids),
    supabase.from("campaign_notes").select("*").in("campaign_id", ids)
  ]);
  for (const resultado of [campanhas, membros, entidades, anotacoes]) if (resultado.error) throw resultado.error;
  return campanhas.data.map(c => adaptarCampanha(
    c,
    membros.data.filter(m => m.campaign_id === c.id),
    entidades.data.filter(e => e.campaign_id === c.id),
    anotacoes.data.filter(n => n.campaign_id === c.id),
    usuarioId
  ));
}

export async function hidratarBancosHissatsu(campanhaIds) {
  if (!campanhaIds.length) return;
  const { data, error } = await supabase.from("campaign_hissatsu").select("*").in("campaign_id", campanhaIds);
  if (error) throw error;
  for (const campanhaId of campanhaIds) {
    const templates = {};
    for (const item of data.filter(row => row.campaign_id === campanhaId)) {
      templates[item.template_id] = {
        templateId: item.template_id,
        publicada: item.published_data,
        rascunho: item.draft_data,
        disponibilidade: { estado: item.availability, atualizadoEm: item.updated_at },
        apresentacao: item.presentation || {}
      };
    }
    if (Object.keys(templates).length) {
      localStorage.setItem(`${PREFIXO_BANCO_HISSATSU}:${campanhaId}`, JSON.stringify({
        versaoEstrutura: 3,
        campanhaId,
        templates,
        atualizadoEm: new Date().toISOString()
      }));
    }
  }
}

export async function migrarBancosHissatsuLocais(campanhaIds) {
  const registros = [];
  for (const campanhaId of campanhaIds) {
    const bruto = localStorage.getItem(`${PREFIXO_BANCO_HISSATSU}:${campanhaId}`);
    if (!bruto) continue;
    try {
      const estado = JSON.parse(bruto);
      for (const item of Object.values(estado.templates || {})) {
        registros.push({
          campaign_id: campanhaId,
          template_id: item.templateId,
          availability: item.disponibilidade?.estado || "bloqueada",
          published_data: item.publicada || null,
          draft_data: item.rascunho || null,
          presentation: item.apresentacao || {},
          mechanical_version: Number(item.publicada?.versaoMecanica) || 0
        });
      }
    } catch (erro) {
      console.error("Banco Hissatsu local inválido; migração ignorada:", erro);
    }
  }
  if (registros.length) {
    const { error } = await supabase.from("campaign_hissatsu").upsert(registros);
    if (error) throw error;
  }
}

export function prepararCampanhasLocais(campanhas, usuario) {
  return campanhas.map(campanha => {
    const idAnterior = campanha.usuarioAtualId;
    const id = crypto.randomUUID();
    const bancoLegado = localStorage.getItem(`${PREFIXO_BANCO_HISSATSU}:${campanha.id}`);
    if (bancoLegado) localStorage.setItem(`${PREFIXO_BANCO_HISSATSU}:${id}`, bancoLegado);
    const nome = usuario.user_metadata?.display_name || usuario.user_metadata?.username || "Você";
    const entidades = (campanha.entidades || []).map(entidade => ({
      ...entidade,
      id: String(entidade.id || crypto.randomUUID()),
      proprietarioId: entidade.proprietarioId === idAnterior ? usuario.id : null
    }));
    const anotacoes = (campanha.anotacoes || []).map(anotacao => ({
      ...anotacao,
      id: String(anotacao.id || crypto.randomUUID()),
      proprietarioId: anotacao.proprietarioId === idAnterior ? usuario.id : null
    }));
    const mestre = campanha.acesso?.papel === "mestre";
    const participante = {
      id: usuario.id,
      nome,
      ativo: true,
      permissoesExtras: campanha.acesso?.permissoes || {},
      acesso: campanha.acesso || { papel: mestre ? "mestre" : "jogador", permissoes: {} }
    };
    return { ...campanha, id, ownerUserId: usuario.id, usuarioAtualId: usuario.id, participantes: [participante], acesso: participante.acesso, entidades, anotacoes };
  });
}

export async function salvarCampanhasRemotas(campanhas, usuarioId) {
  for (const campanha of campanhas) {
    const participanteAtual = (campanha.participantes || []).find(p => p.id === usuarioId);
    const papelMestre = participanteAtual?.acesso?.papel === "mestre";
    const permissoes = participanteAtual?.acesso?.permissoes || {};
    const administraCampanha = papelMestre || permissoes.administrarCampanha || permissoes.editarConfiguracao;
    const dados = removerCamposRelacionados(campanha);
    if (administraCampanha) {
      const { error: erroCampanha } = await supabase.from("campaigns").upsert({
        id: campanha.id,
        owner_user_id: campanha.ownerUserId || usuarioId,
        name: campanha.nome,
        description: campanha.descricao || "",
        system_key: campanha.configuracaoId || null,
        data: dados
      });
      if (erroCampanha) throw erroCampanha;
    }

    if (papelMestre || permissoes.administrarPermissoes) for (const atual of campanha.participantes || []) {
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(atual.id)) continue;
      const { error } = await supabase.from("campaign_members").upsert({
        campaign_id: campanha.id,
        user_id: atual.id,
        role: atual.acesso?.papel || "jogador",
        permissions: atual.permissoesExtras || atual.acesso?.permissoes || {},
        active: atual.ativo !== false
      });
      if (error) throw error;
    }

    const entidadesEditaveis = (campanha.entidades || []).filter(entidade =>
      papelMestre || permissoes.editarQualquerPersonagem ||
      (entidade.proprietarioId === usuarioId && permissoes.editarPropriosPersonagens)
    );
    for (const entidade of entidadesEditaveis) {
      const { error } = await supabase.from("entities").upsert({
        id: entidade.id,
        campaign_id: campanha.id,
        owner_user_id: entidade.proprietarioId || null,
        entity_type: entidade.tipoEntidade || "personagem",
        visibility: entidade.visibilidade || "campanha",
        allowed_user_ids: entidade.participantesPermitidos || [],
        data: entidade
      });
      if (error) throw error;
    }

    const idsEntidades = (campanha.entidades || []).map(item => String(item.id));
    let exclusaoEntidades = supabase.from("entities").delete().eq("campaign_id", campanha.id);
    if (idsEntidades.length) exclusaoEntidades = exclusaoEntidades.not("id", "in", `(${idsEntidades.map(id => `"${id.replaceAll('"', '')}"`).join(',')})`);
    const { error: erroExclusaoEntidades } = await exclusaoEntidades;
    if (erroExclusaoEntidades) throw erroExclusaoEntidades;

    const notasEditaveis = (campanha.anotacoes || []).filter(nota => papelMestre || nota.proprietarioId === usuarioId);
    for (const nota of notasEditaveis) {
      const { error } = await supabase.from("campaign_notes").upsert({
        id: nota.id,
        campaign_id: campanha.id,
        owner_user_id: nota.proprietarioId || usuarioId,
        visibility: nota.visibilidade || "proprietario",
        allowed_user_ids: nota.participantesPermitidos || [],
        data: nota
      });
      if (error) throw error;
    }

    const idsNotas = (campanha.anotacoes || []).map(item => String(item.id));
    let exclusaoNotas = supabase.from("campaign_notes").delete().eq("campaign_id", campanha.id);
    if (idsNotas.length) exclusaoNotas = exclusaoNotas.not("id", "in", `(${idsNotas.map(id => `"${id.replaceAll('"', '')}"`).join(',')})`);
    const { error: erroExclusaoNotas } = await exclusaoNotas;
    if (erroExclusaoNotas) throw erroExclusaoNotas;
  }
}

export async function convidarParticipante(campanhaId, username) {
  const { error } = await supabase.rpc("add_campaign_member_by_username", { target_campaign: campanhaId, target_username: username });
  if (error) throw error;
}

export async function removerParticipante(campanhaId, usuarioId) {
  const { error } = await supabase.rpc("remove_campaign_member", { target_campaign: campanhaId, target_user: usuarioId });
  if (error) throw error;
}

export async function criarCampanhaRemota(nome, usuarioId) {
  const { error } = await supabase.from("campaigns").insert({
    owner_user_id: usuarioId,
    name: nome,
    description: "",
    data: { equipe: null, jornada: null, vinculos: [] }
  });
  if (error) throw error;
  return carregarCampanhasRemotas(usuarioId);
}

export async function entrarEmCampanhaPorCodigo(codigo, usuarioId) {
  const { error } = await supabase.rpc("join_campaign_by_code", { code: codigo });
  if (error) throw error;
  return carregarCampanhasRemotas(usuarioId);
}
