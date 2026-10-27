// API de Conversão do Meta (Grupo de Espera). A página manda o evento pra cá e esta função repassa ao Meta.
// O token NÃO fica no código: variável META_CAPI_TOKEN na Netlify (Site configuration > Environment variables).
// O event_id é o mesmo que a página manda pro Pixel, então o Meta junta os dois e conta uma vez só.
import { createHash } from 'node:crypto';

const PIXEL = '1142202521589184';
const VERSAO = 'v21.0';
const EVENTOS = new Set(['PageView', 'Lead']);

const sha = (v) => createHash('sha256').update(v).digest('hex');
const texto = (v, max) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : '');

// WhatsApp como a página grava: Brasil sem 55 (DDD + número); outros países com +DDI.
function telefone(w) {
  const s = texto(w, 20);
  if (!s) return '';
  const d = s.replace(/\D/g, '');
  if (s.startsWith('+')) return d;
  return d.length >= 10 && d.length <= 11 ? '55' + d : '';
}

export default async (req, context) => {
  if (req.method !== 'POST') return new Response('', { status: 405 });
  const token = Netlify.env.get('META_CAPI_TOKEN');
  if (!token) return Response.json({ ok: false, erro: 'sem token' }, { status: 500 });

  let b;
  try { b = await req.json(); } catch { return Response.json({ ok: false, erro: 'json' }, { status: 400 }); }
  if (!b || !EVENTOS.has(b.event_name)) return Response.json({ ok: false, erro: 'evento' }, { status: 400 });

  const user = {
    client_ip_address: context.ip || undefined,
    client_user_agent: texto(req.headers.get('user-agent'), 500) || undefined,
    fbc: texto(b.fbc, 600) || undefined,
    fbp: texto(b.fbp, 200) || undefined,
  };
  const visitante = texto(b.visitante, 80);
  if (visitante) user.external_id = [sha(visitante)];
  const email = texto(b.email, 200).toLowerCase();
  if (email.includes('@')) user.em = [sha(email)];
  const ph = telefone(b.whatsapp);
  if (ph) {
    user.ph = [sha(ph)];
    if (ph.startsWith('55') && !texto(b.whatsapp, 20).startsWith('+')) user.country = [sha('br')];
  }
  const nome = texto(b.nome, 120).toLowerCase().split(/\s+/)[0];
  if (nome) user.fn = [sha(nome)];

  const evento = {
    event_name: b.event_name,
    event_time: Math.floor(Date.now() / 1000),
    event_id: texto(b.event_id, 100) || undefined,
    action_source: 'website',
    event_source_url: texto(b.event_source_url, 1000) || undefined,
    user_data: user,
  };
  if (b.event_name === 'Lead') evento.custom_data = { content_name: 'Grupo de Espera Asfit' };

  const corpo = { data: [evento] };
  const teste = texto(b.test_event_code, 40);
  if (teste) corpo.test_event_code = teste;

  try {
    const r = await fetch(`https://graph.facebook.com/${VERSAO}/${PIXEL}/events?access_token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) console.log('meta erro', r.status, JSON.stringify(j).slice(0, 500));
    return Response.json({ ok: r.ok, recebidos: j.events_received || 0 }, { status: r.ok ? 200 : 502 });
  } catch (e) {
    console.log('meta falhou', String(e));
    return Response.json({ ok: false }, { status: 502 });
  }
};

export const config = { path: '/api/meta' };
