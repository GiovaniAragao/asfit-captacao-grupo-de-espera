# Captação — Grupo de Espera da Asfit

Página de captação do lançamento da Asfit (Agatha Sá). Quem se cadastra entra no Grupo de
Espera e recebe o link das inscrições antes de todo mundo. O lançamento é na live oficial
de 11/11.

No ar: https://asfit-captacao.netlify.app (Netlify, site id `14e57cdd-9043-4403-b1e3-c1b11750685b`, deploy manual:
`npx -y netlify-cli deploy --prod --dir . --site 14e57cdd-9043-4403-b1e3-c1b11750685b`).
Versão anterior de referência: https://nova-asfit.pages.dev (Cloudflare Pages).

- `index.html` — página completa, arquivo único com o CSS e o JS embutidos.
- `img/` — fotos, logo, capas dos vídeos, a imagem de prévia do link (`compartilhar-asfit.jpg`, 1200x630) e
  capa e contracapa dos 3 manuais de receitas do kit (`manual-*.webp`, primeira e última página de cada PDF).
- `video/` — os três vídeos da página (MP4 de 1,7 a 2,9 MB). Só baixam quando aparecem na tela.
- `fonts/` — Figtree embutida (licença OFL), para o texto não pular quando a fonte carrega.
- `_headers` — `noindex` e cache das imagens e da fonte. A Netlify lê esse mesmo formato.

## Para publicar na Netlify

É um site estático, sem build. Na Netlify: **Add new site → Import from GitHub**,
escolher este repositório e deixar os campos assim:

- Build command: *(vazio)*
- Publish directory: `.`

## Antes de rodar tráfego

1. **Formulário.** O cadastro já grava no Supabase (projeto `ewnsttmmbcdzchzpxqjb`, tabela
   `agatha_leads`, `pagina = espera`) com nome, e-mail, WhatsApp e as UTMs da URL. Os números
   aparecem no painel: https://asfit-painel-leads.netlify.app (pasta `../asfit-painel-leads`).
   No fim do `index.html` ainda há duas variáveis:
   - `LINK_DO_GRUPO`: preenchido com o convite atual (https://sndflw.com/i/ilkg19bqb8pl). É o convite do Grupo de Espera no WhatsApp. Com ele,
     a pessoa vai direto para o grupo depois do cadastro; vazio, ela só vê a mensagem de sucesso.
   - `ENVIAR_PARA`: opcional. Um segundo endereço (webhook) que também recebe o cadastro em
     `multipart/form-data`.
2. **Domínio.** O `og:url` e o `og:image` apontam para `https://asfit-captacao.netlify.app`. Se entrar
   domínio próprio, trocar nos dois, no topo do `index.html`. É o que monta a prévia do link no WhatsApp.
3. **Indexação.** A página está com `noindex` (na meta `robots` e no `_headers`). Se ela tiver
   que aparecer no Google, tirar dos dois lugares.

## Como a página se comporta

- Os vídeos tocam sem som quando entram na tela e pausam quando saem. Tocar no vídeo ou no
  botão pausa. No vídeo do app, o botão "Ativar som" liga a música do começo.
- Os blocos surgem ao rolar a página. Com "reduzir movimento" ligado no aparelho, tudo
  aparece direto, sem animação.
- Na dobra do kit, os 3 manuais são um mockup em CSS 3D, sem biblioteca: giram com o dedo ou o
  mouse (com embalo) e com as setas do teclado quando a cena está em foco. Ao aparecer, a fila
  dá uma volta e para de frente; com "reduzir movimento", não dá a volta nem embala.

## Meta Pixel + API de Conversão (desde 26/10)

- Pixel `1142202521589184`. PageView e Lead saem pelo navegador (`fbq`) e pelo servidor (`/api/meta`, função em `netlify/functions/meta.mjs`) com o mesmo `event_id`, então o Meta deduplica.
- O token fica na variável `META_CAPI_TOKEN` da Netlify (escopo functions). Nunca no código. Trocar: `npx netlify-cli env:set META_CAPI_TOKEN <novo> --scope functions` e fazer deploy de novo.
- Testar no Gerenciador de Eventos: abrir a aba Eventos de teste, pegar o código e abrir a página com `?teste_meta=CODIGO`.
- A origem (UTMs, `ad_id`, `adset_id`, `campaign_id`, nomes, `placement`, `site_source_name`, `fbclid`) é guardada 30 dias no navegador e gravada no cadastro (`agatha_leads`). Macro crua (`{{ad.id}}`) é descartada.
- Parâmetros de URL pra colar no anúncio (campo "Parâmetros de URL" do Meta):
  `utm_source=facebook&utm_medium=paid&utm_campaign={{campaign.name}}&utm_term={{adset.name}}&utm_content={{ad.name}}&campaign_id={{campaign.id}}&adset_id={{adset.id}}&ad_id={{ad.id}}&campaign_name={{campaign.name}}&adset_name={{adset.name}}&ad_name={{ad.name}}&placement={{placement}}&site_source_name={{site_source_name}}`
