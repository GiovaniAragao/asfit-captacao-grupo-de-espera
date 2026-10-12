# Captação — Grupo de Espera da Asfit

Página de captação do lançamento da Asfit (Agatha Sá). Quem se cadastra entra no Grupo de
Espera e recebe o link das inscrições antes de todo mundo. O lançamento é na live oficial
de 11/11.

Versão de referência no ar: https://nova-asfit.pages.dev (Cloudflare Pages, provisória).

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

1. **Formulário.** No fim do `index.html` há duas variáveis vazias:
   - `ENVIAR_PARA`: o endereço (webhook) que recebe o cadastro. A página manda um POST
     `multipart/form-data` com os campos `nome`, `email`, `whatsapp`, `utm_source`,
     `utm_medium`, `utm_campaign`, `utm_content` e `utm_term`. As UTMs vêm da URL da página.
   - `LINK_DO_GRUPO`: o convite do Grupo de Espera no WhatsApp. Preenchido, a pessoa vai
     direto para o grupo depois do cadastro.

   Enquanto as duas estiverem vazias, o cadastro só mostra a mensagem de sucesso e não vai
   para lugar nenhum.
2. **Domínio.** Trocar `https://nova-asfit.pages.dev` pelo domínio final no `og:url` e no
   `og:image`, no topo do `index.html`. É o que monta a prévia do link no WhatsApp.
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
