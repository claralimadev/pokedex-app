# MENTORIA - Estado Atual

## Ajustes Realizados

### 2026-09-13

- **src/app/pages/pokedex/pokedex.ts:17**: Corrigido `inject(PokemonApiService-intercept)` para `inject(PokemonApiService)`. O sinal de menos (`-`) estava sendo interpretado como operação matemática.

### Fase 2 - Model + serviço mapeando detalhes

- **src/app/core/models/pokemon.model.ts** (novo): Interface `Pokemon` com `id`, `name`, `types` e `image`.
- **src/app/core/services/pokemon-api.service.ts**: `getPokemonPage` agora retorna `Observable<Pokemon[]>`. Usa `switchMap` + `forkJoin` para resolver as requisições de detalhe de cada Pokémon da página, mapeando `types` (nomes dos tipos) e `image` (official-artwork).
- **src/app/pages/pokedex/pokedex.ts**: Removida a interface local `PokemonCardModel`; a página agora consome o model `Pokemon`.
- **src/app/pages/pokedex/pokedex.html**: Renderização da imagem e dos tipos de cada card.

### Fase 3 - Componente PokemonCard + grid no App

- **src/app/components/pokemon-card/** (novo): Componente `PokemonCard` com input `pokemon` (`Pokemon`). Renderiza número (`#001`), nome, imagem e tipos de cada Pokémon, com estilos próprios.
- **src/app/app.ts**: App agora injeta `PokemonApiService`, mantém o signal `pokemonCards` e carrega a lista ao inicializar.
- **src/app/app.html**: Lista de Pokémon renderizada no grid responsivo (`repeat(auto-fill, minmax(...))`) usando `<app-pokemon-card>`.
- **src/app/app.scss**: Ajustado - estilos de card movidos para o componente; mantidos layout, header, footer e grid.
- **src/app/app.routes.ts**: Rotas esvaziadas.
- **src/app/pages/pokedex/*** (removido): PokedexPage substituída pelo App (que agora renderiza a lista diretamente em `app.html`).
- **src/app/app.spec.ts**: Teste atualizado do router-outlet para renderização do título da Pokédex.

### Fase 3 - Filtro de busca por nome/ID e seleção de tipo

- **src/app/app.ts**: Adicionados os signals `searchQuery` e `selectedType`, o computed `types` (tipos distintos da página atual) e o computed `filteredPokemon` (filtra por nome/ID e por tipo, em tempo real).
- **src/app/app.html**: Inputs habilitados e conectados aos signals: busca por nome/ID (`(input)` -> `onSearchChange`) e Select de tipos (`(change)` -> `onTypeChange`), com opções populadas dinamicamente. Adicionado estado vazio "Nenhum Pokémon encontrado.".
- **src/app/app.scss**: Substituído estilo de input desabilitado por estilo do estado vazio.

### Fase 4 - Paginação "Carregar Mais" + modal com detalhes

- **src/app/core/models/pokemon.model.ts**: Adicionada a interface `PokemonStats` (hp, attack, defense, speed); `Pokemon` agora inclui `stats`.
- **src/app/core/services/pokemon-api.service.ts**: `PokemonDetailResponse` inclui `stats`; `getPokemonPage` passa a retornar `Observable<PokemonPage>` (`{ pokemon, next }`) mapeando os 4 stats solicitados.
- **src/app/components/pokemon-card/pokemon-card.ts**: Novo output `cardClick` (`output<Pokemon>()`) emitido ao clicar no card; template com `(click)="onClick()"` e hover/cursor pointer no estilo.
- **src/app/app.ts**: Paginação incremental com `offset`/`hasNext`/`isLoading` e método `loadPokemon()`; signal `selectedPokemon` + `onPokemonClick`/`closeModal` para o modal.
- **src/app/app.html**: Rodapé com contador de Pokémon e botão "Carregar Mais" (usando limit/offset); modal dos detalhes (HP, Ataque, Defesa, Velocidade) aberto ao clicar no card, com fechamento por botão X ou clique no overlay.
- **src/app/app.scss**: Estilos do modal (overlay, card, stats) e botão do rodapé.

### Fase 5 - Verificação geral e finalização

- **Verificação geral**: `npm run build` (produção) concluído sem erros de TypeScript/SCSS; testes unitários passando (2/2) via `ng test`; Prettier aplicado em todos os arquivos `src`.
- **src/** (novo v1.0.0): Projeto formatado com Prettier (13 arquivos ajustados).

### Fase 6 - Responsividade total (mobile first, tablet e desktop)

- **src/styles.scss**: Estilos globais - reset de box-sizing, base tipográfica e suavização de fonte, `font-size` herdada, `touch-action: manipulation` em botões, `:focus-visible` acessível.
- **src/app/app.scss**: Reescrito mobile-first:
  - Header e controles empilham no mobile (coluna) e viram linha a partir de `640px`.
  - Busca, select e botões com mínimo de 48px de altura (conforto ao toque), `font-size: 16px` no mobile para evitar zoom no iOS.
  - Grid responsivo com `repeat(auto-fit, minmax(min(100%, 150px), 1fr))` no mobile, `180px` >= 640px e `220px` >= 960px, sem quebrar a tela.
  - Modal com `max-height: 90dvh` + rolagem interna e botão de fechar maior (2.5rem).
- **src/app/app.html**: Badges de tipo do modal trocados de `pokemon-card__type` (classe encapsulada no card) para `modal__type`.
- **src/app/components/pokemon-card/pokemon-card.scss**: `touch-action: manipulation` e `-webkit-tap-highlight-color: transparent` nos cards.

### Fase 7 - Tema Claro / Escuro

- **src/styles.scss**: Variáveis CSS de tema em `:root` (Claro) e `[data-theme='dark']` (Escuro). Claro: fundo claro com destaque vermelho Pokébola `#DC0A2D`. Escuro: fundo azul profundo `#0B132B` com detalhes em azul/ciano (`#22D3EE`). `color-scheme` ajustado por tema e fundo aplicado em `html`/`body`.
- **src/app/app.ts**: Signal `isDark` inicializado do `localStorage` (chave `pokedex-theme`); `toggleTheme()` alterna, salva a preferência e aplica `data-theme` no `<html>` via `applyTheme()`.
- **src/app/app.html**: Botão de alternância no topo com ícones ☀️ (escuro -> claro) e 🌙 (claro -> escuro), `aria-label` dinâmico.
- **src/app/app.html**: Ícones trocados por SVGs de Pokémons: Charmander (Modo Claro) e Umbreon (Modo Escuro), com anéis amarelos. O ícone visível é o do Pokémon oposto ao tema atual (Claro -> Umbreon; Escuro -> Charmander). SVGs com `width`/`height` 30px centralizados no botão de 48px.
- **src/app/app.scss**: Todas as cores refatoradas para `var(--color-*)` (fundo, superfícies, bordas, texto, acento, overlay e sombras). Botão `theme-toggle` quadrado de 48px.
- **src/app/components/pokemon-card/pokemon-card.scss**: Cores do card e badges refatoradas para as variáveis de tema.

### Fase 8 - Hero Section estilo Google + filtro por botões de tipo

- **src/app/app.html**: Hero centralizado com título "Bem-vindo, Treinador!", busca centralizada (pill com sombra) logo abaixo, grade de botões de tipos (18 elementos) em 2-3 fileiras (3 colunas mobile / 6 colunas a partir de 640px) e botão "Limpar filtro e mostrar todos". Substituiu o antigo header/select.
- **src/app/app.ts**: Removeu computed `types` (agora lista fixa); adicionou `pokemonTypes` (18 tipos), `hasActiveFilter` (computed) e `clearFilter()` (limpa busca e tipo). Filtro continua no computed `filteredPokemon` (busca + tipo).
- **src/app/app.scss**: Reescrito com Hero (`.hero`, `.type-grid`, `.type-btn` com estado `--active`, `.clear-btn`); tema toggle reposicionado no canto superior direito do hero.
- **src/app/app.spec.ts**: Assert de título atualizado para "Bem-vindo, Treinador!".
- **angular.json**: Orçamento de CSS de componente elevado para 6kB (warning) / 12kB (error) devido ao hero maior.

### Fase 9 - Carregamento incremental com reset por filtro

- **src/app/core/services/pokemon-api.service.ts**: `getPokemonPage(offset = 0, limit = 12)` com limite padrão de 12 por requisição; `DEFAULT_LIMIT` fixo no serviço.
- **src/app/app.ts**: 
  - Incremental: "Carregar Mais" avança o `offset` de 12 em 12, acumulando páginas sem travar (requisições assíncronas com estado `isLoading`).
  - Reset por filtro: `resetAndLoad()` zera `offset`, limpa `pokemonCards` e recarrega os 12 iniciais. Chamado ao trocar de tipo (`onTypeChange`) e ao limpar filtro (`clearFilter`) - otimiza memória mantendo o site leve.
  - Guarda de concorrência: `loadToken` descarta respostas obsoletas de requisições anteriores após um reset.

### Fase 10 - Ícone de menu Dugtrio + menu lateral móvel

- **src/app/app.html**: Criado SVG customizado do Dugtrio (três cabeças de terra em tons de marrom, alinhadas horizontalmente, com olhos, focinhos e bocas simplificados) usado como substituto do menu "hambúrguer". Adicionado `.topbar` no topo (menu Dugtrio à esquerda, marca "Pokédex" ao centro, tema à direita) e menu lateral móvel (`.drawer`) com o ícone Dugtrio no cabeçalho, filtros por tipo e botão "Limpar filtro".
- **src/app/app.ts**: Signals `isMenuOpen` + métodos `toggleMenu()`/`closeMenu()`. Selectionar tipo no menu lateral fecha o drawer.
- **src/app/app.scss**: Estilos do topbar, `.menu-toggle`, `.dugtrio-icon` (42px proporcional), drawer com backdrop (z-index 20/21) e modal elevado para 30.

### Fase 11 - Busca filtrada por tipo (independente) + skeleton loading

- **src/app/core/services/pokemon-api.service.ts**: Novo `getPokemonByType(type, offset = 0, limit = 12)` consultando `/type/{type}`; faz slice do offset (12 em 12) com paginação própria do tipo e devolve apenas os 12 da categoria (sem carregar a lista geral antes).
- **src/app/app.ts**: `loadPokemon()` rotela a requisição: usa `getPokemonByType` quando há tipo ativo, senão `getPokemonPage`. O offset é por categoria. Exposto `skeletonItems` (12 placeholders).
- **src/app/app.html**: Skeleton grid com 12 cards fantasma (id, imagem, nome) exibido durante o carregamento inicial/categoria; só mostra a lista real quando os dados chegam.
- **src/app/app.scss**: Estilos do `.skeleton-card` + animação `skeleton-pulse`.
- **angular.json**: Orçamento de CSS elevado para 8kB (warning) / 16kB (error).

### Fase 12 - Botões de tipo em pílula com emojis

- **src/app/app.ts**: Adicionado `TYPE_LABELS` (mapa tipo -> rótulo com emoji, ex: ⚪ Normal, 🔥 Fire) exposto como `typeLabels`.
- **src/app/app.html**: Botões de tipo (hero e drawer) agora exibem emoji + nome via `{{ typeLabels[type] }}`.
- **src/app/app.scss**: `.type-grid` virou flex-wrap com `gap: 10px` e `.type-btn` em pílula retangular com `width: auto`, `padding: 0.5rem 1rem`, `white-space: nowrap` (nomes 100% visíveis, sem cortes/sobreposição). Removido formato de grade/círculo fixo (media query de colunas eliminada).

### Fase 13 - Dropdown 'Classificações' + tema claro Charizard

- **src/app/app.ts**: Novo signal `isTypesOpen` + método `toggleTypes()`.
- **src/app/app.html**: Botão retrátil "Classificações" (com chevron que rotaciona) no hero e no drawer; as pílulas de tipo ficam ocultas por padrão e só desdobram ao clicar. Removido título "Filtrar por tipo" do drawer.
- **src/app/app.scss**: Estilos `.classificacoes-toggle` (pílula 48px, gap interno, hover no accent) + animação do chevron; removido `.drawer__section-title`.
- **src/styles.scss**: Tema claro atualizado para a paleta 'Charizard' - laranja pastel/base elegante (accent `#b45309`, accent-soft `#fde7d3`, fundos/bordas quentes `#fdf3e7`/`#e6c9a3`, texto warm `#3a2a18`) mantendo bom contraste de leitura.

### Fase 14 - Arte lateral dos treinadores (line art adaptável ao tema)

- **src/app/app.html**: Dois `<aside class="side-art">` com SVG line art (stroke) minimalistas - Charizard (esquerda, `currentColor` = accent) e Umbreon (direita, `currentColor` = texto muted), com `aria-hidden`.
- **src/app/app.scss**: `.side-art` fixo nas laterais, centralizado verticalmente, `pointer-events: none`, oculto por padrão (`display: none`) e exibido apenas em `@media (min-width: 1024px)`. Fade-in suave ativado ao rolar via scroll-driven animation (`animation-timeline: scroll()`) dentro de `@supports`, com fallback para visível.
- As linhas usam `currentColor` + variáveis CSS do tema, então as cores se adaptam sozinhas (Charizard laranja no claro / Umbreon cyan no escuro).

### Fase 15 - Marca d'água dos treinadores (line art manga/anime)

- **src/app/app.html**: Seis `<aside class="side-art">` com SVG line art minimalista (traço manga/anime) dos treinadores: **Ash, Brock e Red** (lado esquerdo) e **Pikachu, Misty e Cynthia** (lado direito), todos `aria-hidden`, com posições verticais intercaladas (`--top`, `--middle`, `--bottom`, `--top-r`, `--middle-r`, `--bottom-r`).
- **src/app/app.scss**: Marca d'água sutil - `opacity: 0.18`, `pointer-events: none`, `width: clamp(90px, 11vw, 150px)`, fixa nas margens, visível apenas em `@media (min-width: 1024px)` (oculta no mobile). Cor dos traços via `currentColor` ligado a `var(--color-accent)` (laranja escuro suave no modo Charizard claro / cyan translúcido no modo Umbreon escuro). Fade-in ao rolar via scroll-driven animation dentro de `@supports` + `prefers-reduced-motion`.

### Fase 16 - Marca d'água suave (opacity 0.08) com parallax lento

- **src/app/app.scss**: Opacidade reduzida para `0.08` (8%) - traço super delicado. Adicionada `transition: opacity 0.8s ease-out, transform 0.8s ease-out` e troca da cor dos traços para `var(--color-text)` via `stroke` no `.side-art__svg g` (adapta-se ao tema Charizard claro / Umbreon escuro; `pointer-events: none` mantido).
- **src/app/app.html**: Cada artista ganhou `data-reveal` (frações de scroll 0.06/0.34/0.62 e 0.2/0.48/0.76) para aparição escalonada.
- **src/app/app.ts**: Novo `initSideArtParallax()` (via `afterNextRender` + `DestroyRef`): parallax sutil com `translateY(calc(-50% + scrollY * 0.04px))` e fade gradual da opacidade 0 → 0.08 por artista conforme o scroll avança, dentro de `requestAnimationFrame`. Removida a abordagem `animation-timeline: scroll()`.
- O deslize e o fade são extremamente suaves/lentos e ocorrem à medida que a página é rolada para baixo, em desktop (≥1024px).

### Fase 17 - Artes grandes de corpo inteiro (Ash, Cynthia, Red, Misty)

- **src/app/app.html**: Os seis ícones pequenos foram substituídos por quatro ilustrações em traço (line art) de corpo inteiro, detalhadas, `viewBox 220x560`: **Ash** (boné + punho erguido) e **Cynthia** (cabelo longo + casaco, mãos na cintura) à esquerda; **Red** (boné para trás + jaqueta) e **Misty** (rabo de cavalo longa + top) à direita. `data-reveal` atualizado (0.05/0.55 e 0.3/0.8).
- **src/app/app.scss**: Artes grandes com `min-height: 380px`, `width: clamp(130px, 15vw, 210px)`, posicionadas nas margens extremas (`left`/`right: -20px`), `opacity: 0.1` (marca d'água delicada), traço `stroke: var(--color-text)` adaptável ao tema e `pointer-events: none`. Transição de scroll suave: `transition: transform 1s ease, opacity 1s ease`.
- **src/app/app.ts**: Paralaxe/fade atualiza para objetivo `opacity: 0.1` conforme o scroll avança (`requestAnimationFrame`).

### Fase 18 - Hero com tipos sempre visíveis + Favoritar ⚡ e Comparar nos cards

- **src/app/app.html**: Removido o botão retrátil "Classificações ▾" do Hero (Home); a grade de pílulas/badges dos tipos (com emojis) fica **100% aberta por padrão**. O menu lateral (drawer) **mantém** a opção retrátil "Classificações ▾".
- **src/app/components/pokemon-card/pokemon-card.ts**: Adicionado `isFavorite` (computed reativo sobre o signal compartilhado `favorites` persistido no `localStorage` sob a chave `pokedex-favorites`), `toggleFavorite()` (adiciona/remove por ID) e `toggleCompare()` com signal `isCompare`. Clicks dos botões chamam `event.stopPropagation()` para não abrir o modal.
- **src/app/components/pokemon-card/pokemon-card.html**: Card ganhou cabeçalho com número à esquerda e botão raio **⚡** (Favoritar, com estado ativo) à direita, além do botão **Comparar** na base do card (estado ativo ao alternar).
- **src/app/components/pokemon-card/pokemon-card.scss**: Estilos `.pokemon-card__header`, `.pokemon-card__favorite` (32px circular, ativo com accent) e `.pokemon-card__compare` (largura total, ativo com accent/contrast).
- **src/app/app.scss**: Marcas d'água laterais (Fases 15/16/17) com `opacity: 0.12` e `transition: opacity 0.3s ease, transform 0.3s ease` (era 0.1/1s).
- **src/app/app.ts**: Parallax das marcas d'água atualizado para objetivo de opacidade `0.12`.

### Fase 19 - Favorito neon ⚡ + i18n PT/EN/ES + detalhes avançados (altura/peso, lore, stats, evolução)

- **src/app/components/pokemon-card/pokemon-card.scss**: Botão favorito (raio ⚡) com fundo escuro neutro (`#2a2e38`/`#3d4350`) quando não favoritado; quando favoritado, preenchimento amarelo brilhante `#ffcc00`, borda iluminada e efeito neon `box-shadow: 0 0 10px #ffcc00`.
- **src/app/core/i18n/pokemon-types.ts** (novo): Centraliza `Locale` (`pt-BR`/`en-US`/`es-ES`), `TYPE_LIST`, emojis dos tipos e mapas `TYPE_NAMES`/`UI_STRINGS` traduzidos (PT-BR default: Fogo, Água, Planta, Elétrico, etc. / EN-US original / ES-ES). Helpers `typeName`, `typeLabel`, `flavorLanguage`, `uiString`, `isLocale`.
- **src/app/app.ts** + **pokemon-card.ts/html**: Pílulas do hero/drawer e badges de tipo dos cards traduzidos conforme o idioma selecionado (`typeLabel`/`typeName`), com `language` input no card.
- **src/app/app.html**: No menu lateral (Dugtrio), logo abaixo de "Menu", seletor de idioma com `🇧🇷 PT-BR | 🇺🇸 EN-US | 🇪🇸 ES-ES` persistido no `localStorage` (chave `pokedex-language`, método `setLanguage`).
- **src/app/core/models/pokemon.model.ts**: `PokemonStats` agora com 6 stats (`specialAttack`/`specialDefense` adicionados); novas interfaces `PokemonEvolution` e `PokemonDetails` (`height`, `weight`, `description`, `evolutions`).
- **src/app/core/services/pokemon-api.service.ts**: Novo `getPokemonDetails(id, lang)` - busca detalhe + espécie (flavor text por idioma) + cadeia evolutiva (`/evolution-chain`), mapeando altura (dm→m), peso (hg→kg), lore e sprites da linha evolutiva em ordem.
- **src/app/app.ts** + **app.html**: Modal com Altura (m), Peso (kg), Descrição/Lore, barras de progresso animadas (HP, ATK, DEF, SPA, SPD, VEL com valores ao lado, `statList()` normalizando sobre 255) e seção "Linha Evolutiva" com sprites em ordem (seta → entre eles, membro atual destacado). Carregamento assíncrono com estado `isDetailsLoading` e guarda `detailsToken`.
- **angular.json**: Orçamento `anyComponentStyle` elevado para 12kB (warning) / 20kB (error).

### Fase 20 - Vídeo de fundo Pokébola 3D, cores de tipo dinâmicas, raio favorito com choque, comparação VS, busca global #360+ e VLibras

- **src/app/app.html** + **app.ts** + **app.scss**: Fundo de vídeo transparente — removidas todas as `side-art` (SVGs de rascunho dos treinadores) e o `initSideArtParallax`. Adicionado `<video class="bg-pokeball-video">` (autoplay, loop, muted, playsinline) cobrindo a viewport (`position: fixed`, `z-index: -1`). Regras adaptativas: `body.dark-theme` (opacity .15, brightness .6 contrast 1.1) e `body.light-theme` (opacity .08, brightness 1.2 contrast .9). `applyTheme()` agora também alterna a classe `dark-theme`/`light-theme` no `<body>`; `:host` ficou com fundo transparente para o vídeo aparecer. Os arquivos do vídeo devem ser colocados em `public/videos/pokeball-3d.webm` / `.mp4` (sources apontando para `videos/pokeball-3d.*`).
- **src/styles.scss**: Cores dinâmicas por tipo via classes `.type-{fire,water,...,fairy}` definindo `--type-bg`, `--type-text` e `--type-glow` — pastéis no claro, vibrantes/neon com box-shadow de brilho no `[data-theme='dark']`. Pílulas/cards/modal transparentes ao acento anterior passam a usar essas variáveis. Tipos já vinham traduzidos em PT-BR via i18n (`typeName`) e permanecem.
- **src/app/components/pokemon-card/*** : Botão de favorito trocado por SVG de raio vetorial **solto** (sem círculo): contorno fino vazado quando desfavoritado; favoritado com `fill/stroke #ffcc00` + `drop-shadow(0 0 6px rgba(255,204,0,.8))`. Clique dispara `.shock-animation` (400ms) com trepidação + flashes elétricos amarelados no card. Botão de comparação virou **"⚔️ VS"** emitindo `compareClick`; estado ativo controlado pelo App via input `compareActive`.
- **src/app/core/services/favorites.service.ts** (novo): Store reativa de favoritos (`pokedex-favorites`) compartilhada entre App e cards — permite filtrar favoritos e sincronizar estados.
- **src/app/app.html** + **app.ts**: 
  - **Busca global #360+**: debounce de 350ms; a cada tecla, além do filtro local, consulta direta a PokéAPI (`searchPokemonByName`) por nome/ID mesmo fora da lista carregada; resultado exibido em bloco destacado `.global-result` acima do grid.
  - **Comparação ⚔️ VS**: two clicks em cards → modal lado a lado com imagens, tipos coloridos e barras de stats (HP/ATK/DEF/SPA/SPD/VEL) com selo central VS.
  - **Drawer**: aba **⚡ Favoritos** (toggle) e submenu **Classificações ▾** com abas **⭐ Tipo**, **🌐 Geração I a IX** e **🗺️ Região** (faixas de ID via `classifications.ts`), filtrando os cards carregados.
- **src/app/core/data/classifications.ts** (novo): `GENERATIONS` e `REGIONS` com faixas de ID + helper `inRange`.
- **src/app/core/services/pokemon-api.service.ts**: Novo `searchPokemonByName(nameOrId)` consultando `/pokemon/{query}`; extraído `toPokemon()` para reaproveitar o mapeamento.
- **src/index.html**: Widget oficial do **VLibras** mantido/adicionado (`vlibras-plugin.js` + instância `VLibras.Widget('https://vlibras.gov.br/app')`) para acessibilidade de surdos.
- **angular.json**: orçamento `anyComponentStyle` elevado para 16kB/24kB.

### Fase 21 - Destaques por Geração, Quiz "Who's That Pokémon?" e alinhamento do drawer

- **src/app/core/data/classifications.ts**: Novo `GENERATION_HIGHLIGHTS` — para cada Geração I a IX o Pokémon mais forte (⚡: Mewtwo #150, Ho-Oh #250, Rayquaza #384, Arceus #493, Kyurem #646, Xerneas #716, Necrozma #800, Eternatus #890, Miraidon #1008) e o melhor treinador (🧢: Red, Lance, Steven Stone, Cynthia, Alder, Diantha, Ash, Leon, Geeta).
- **src/app/app.html** + **app.ts** + **app.scss** (drawer → "🏆 Destaques por Geração"):
  - Novo toggle `🏆 Destaques por Geração ▾` (signal `isHighlightsOpen`) listando por geração o nome do Pokémon mais forte e o melhor treinador.
  - O botão "⚡ Mais forte" chama `openHighlight(id)`, que busca o Pokémon na PokéAPI (`searchPokemonByName`), abre o modal de detalhes com seus stats lendários (barras HP/ATK/DEF/SPA/SPD/VEL) destacados.
  - Estilos `.highlights*` (itens com hover amarelo neon).
- **src/app/components/pokemon-quiz/*** (novo): Componente `PokemonQuiz` — jogo **"Who's That Pokémon?"**:
  - Palco clássico: fundo **vermelho** com **explosão azul** (rais `repeating-conic-gradient` girando) e disco vermelho radial; silhueta preta (`filter: brightness(0)`) sobre o palco.
  - Pergunta: Pokémon aleatório (70% clássicos #1-151 / resto #1-1025) + 4 opções de nome. Ao responder, a silhueta **se revela em 1.5s** (transição CSS de opacidade/scale para o sprite colorido via `.quiz__stage--revealed`), com rótulo "Correto!/Errou!", placar 🎯 e botões Pular/Próximo.
  - Aberto pelo botão **🎮 Quiz** do drawer (`isQuizOpen`), fechado por `close` output.
- **src/app/app.scss** + **app.html** (alinhamento do drawer): botões `⚡ Favoritos`, `Classificações ▾`, `🏆 Destaques por Geração` e `🎮 Quiz` agora **alinhados à esquerda** — `width: 100%`, `display: flex`, `justify-content: flex-start`, `text-align: left` (`.nav-item`, `.classificacoes-toggle`, `.drawer > .clear-btn`).
- **Fundo 3D preservado**: `<video class="bg-pokeball-video">` (Pokébola 3D transparente em loop) mantém as regras adaptativas `body.dark-theme` (opacity .15) e `body.light-theme` (opacity .08).
- **angular.json**: orçamento `anyComponentStyle` segue 16kB/24kB (sem avisos de budget).

### Fase 22 - Backgrounds visuais (Dark/Light) + anime clássico no Quiz

- **src/app/app.html** + **app.scss**: Substituído o `<video class="bg-pokeball-video">` (que apontava para `videos/pokeball-3d.*` inexistente) por duas `<img class="bg-image bg-image--dark | bg-image--light">` com as imagens de referência baixadas de `i.pinimg.com`:
  - **public/images/bg/dark.jpg** (referência pin.it/5JkUm27b6 — espaço profundo/negro com Pokébola 3D flutuando).
  - **public/images/bg/light.jpg** (referência pin.it/2FtJCEhPY — fundo claro/limpo com Pokébola 3D).
  - `.bg-image`: `position: fixed; top/left 0; width: 100vw; height: 100vh; object-fit: cover; z-index: -1; pointer-events: none; opacity: 0; transition: opacity .6s`.
  - Alternância automática por tema: `body.dark-theme .bg-image--dark` → `opacity: 0.18; filter: brightness(0.7)` e `body.light-theme .bg-image--light` → `opacity: 0.10; filter: brightness(1.1)` (crossfade suave na troca de tema). `applyTheme()` já aplica `dark-theme`/`light-theme` no `<body>`.
- **src/app/components/pokemon-quiz/*.scss/html**: Fundo do palco do Quiz agora usa **imagem explícita do anime clássico** `public/images/quiz/anime-stage.svg` (fundo vermelho com explosão de luz azul — raios `repeating` + halo `radial-gradient` azul-branco — e a marca **POKÉMON** no canto inferior direito), renderizada via `<img class="quiz__stage-bg">` cobrindo o palco. A silhueta preta e a revelação de 1.5s ficam acima (`z-index: 2`).
- **src/app/components/pokemon-quiz/pokemon-quiz.ts**: Minigame preservado e completado:
  - **3 Choquinhos ⚡ (vidas)**: signal `lives` (inicia em 3), decrementado a cada erro; ao zerar → `isGameOver`.
  - **Recorde no localStorage**: chave `pokedex-quiz-best` (helper `persistBest()`/`initialBest()`); placar `🏆` exibido no header.
  - **Botão "Tentar novamente"**: painel `quiz__gameover` aparece em Game Over com pontuação final, recorde e botão `restart()` (zera lives/placar e começa rodada nova).
  - **Choquinhos por cima do fundo do anime**: `.quiz__lives` (⚡⚡⚡ com estado `--lost` esmaecido/grayscale) posicionado sobre o palco (`z-index: 4`, topo centralizado); rótulo "Correto!/Errou!" na base (`z-index: 3`).
- Preservados: busca global por ID/nome direto na PokéAPI, pílulas com cores de tipos (pastéis/claro e neon/escuro) e widget do VLibras (src/index.html).

### Fase 23 - Restauro do vídeo 3D da Pokébola de fundo

- **public/assets/videos/pokeball-bg.mp4** (novo): vídeo de fundo **3D da Pokébola** (8s, 30fps, loop, 960x540, ~296KB, H.264 `libx264`/`yuv420p`/faststart) gerado por script Node (frames PNG → ffmpeg). Cena de espaço profundo com nebulosas, estrelas cintilando, a Pokébola flutuando/balançando (rotação 3D com squash do eixo Y, gloss especular, anel de luz superior, botão central e trilha de movimento suave) - substitui as imagens estáticas da Fase 22.
- **src/app/app.html**: Tag restaurada na raiz do componente principal (fora de containers/modais):
  `<video autoplay loop muted playsinline class="bg-pokeball-video"><source src="assets/videos/pokeball-bg.mp4" type="video/mp4"></video>`. Removidas as duas `<img class="bg-image ...">`.
- **src/app/app.scss**: Regras restauradas com z-index permanente de fundo (independente de modais):
  `.bg-pokeball-video { position: fixed; top/left 0; width: 100vw; height: 100vh; object-fit: cover; z-index: -1; pointer-events: none; transition: opacity .3s ease; }`, com `body.dark-theme` (opacity .18 / brightness(.7)) e `body.light-theme` (opacity .10 / brightness(1.1)) alternando automaticamente conforme o tema.
- Minigame arcade **mantido**: 3 Choquinhos ⚡ (vidas), placar de recorde (`pokedex-quiz-best` no localStorage), perguntas sem repetição e a tela clássica de revelação do Quiz (SVG do anime vermelho/azul com marca POKÉMON).

### Fase 24 - Minigame: removida marca POKÉMON + animação de explosão restaurada

- **src/app/components/pokemon-quiz/pokemon-quiz.html** + **.scss**: No palco do Quiz, removida a marca amarela **POKÉMON** do canto inferior direito (referência pin.it/3Rj8eGMCI - "Quem é esse pokemon") e restaurada a **animaçãozinha** clássica por cima do fundo:
  - `.quiz__burst`: explosão de luz azul girando (`repeating-conic-gradient` azul + `animation: quiz-burst-spin 1.4s linear infinite`, opacity .55).
  - `.quiz__disc`: disco vermelho radial central com brilho (`box-shadow` vermelho + branco) sobre o qual ficam a silhueta preta e a revelação.
  - O SVG de fundo (`anime-stage.svg`) agora é só o cenário vermelho com raios azuis/vignette (sem texto).

### Fase 25 - Quiz: explosão lenta e suave (sem tontura)

- **src/app/components/pokemon-quiz/pokemon-quiz.scss**: Giro da explosão azul do palco reduzido de 1.4s para **28s** (rotação quase imperceptível), `opacity` de .55 para .32 e leve `blur(1px)` - movimentação suave que não enjoa.
- Adicionado `@media (prefers-reduced-motion: reduce)` para **desligar** o giro da explosão e acelerar a revelação (acessibilidade de quem sente tontura/náusea com movimento).

### Fase 26 - Movimento ainda mais calmo (anti-tontura)

- **src/app/components/pokemon-quiz/pokemon-quiz.scss**: Explosão azul do palco agora gira a **60s por volta** (quase estática), com raios mais largos (gradiente 0/22/44deg), `opacity: 0.2` e `blur(2px)` - imperceptível, sem enjoo.
- **src/app/app.ts**: `afterNextRender` reduz o `playbackRate` do vídeo de fundo da Pokébola para **0.45** (movimento lento/flutuante); se o usuário tiver `prefers-reduced-motion: reduce`, o vídeo **pausa** totalmente.

### Fase 27 - Quiz: sem "palitos", só a explosão de luz girando (5s)

- **public/images/quiz/anime-stage.svg**: removidos os raios/palitos finos (`<g id="rays">` com os 18 polígonos azuis e os círculos de glow); o SVG agora é apenas o cenário vermelho com radial gradient + vignette.
- **src/app/components/pokemon-quiz/pokemon-quiz.html** + **.scss**: removido o disco vermelho central (`.quiz__disc`) — o palco agora mostra **só a explosão de luz azul**, mais sólida (`opacity: .85`, radiais azuis com alpha alto), sem estrias finas, girando a **1 volta / 5s**. A silhueta e a revelação continuam por cima.

### Fase 28 - Quiz: explosão visível de novo (brilho "screen")

- **src/app/components/pokemon-quiz/pokemon-quiz.scss**: a explosão estava invisível (azul sobre fundo vermelho escurecia). Adicionado `mix-blend-mode: screen` + núcleo branco brilhante e 4 clarões azul-claros largos/suaves (radiais) com alpha alto - a explosão de luz agora **acende por cima do vermelho**, girando a cada 5s, sem palitos e sem transparência fantasma.

### Fase 29 - Quiz: revertido para o visual da Fase 22 (fundo do anime completo)

- **src/app/components/pokemon-quiz/*** : Palco do Quiz **voltado ao estado que estava antes da reclamação do nome amarelo** - o que o usuário considerava "lindo":
  - **public/images/quiz/anime-stage.svg** restaurado por completo: fundo vermelho + raios azuis + halo luminoso central + **marca POKÉMON amarela no canto inferior direito**.
  - Removida a camada `.quiz__burst` (explosão CSS girando) e o `.quiz__disc`; o palco volta a usar só a imagem do anime, com silhueta preta e revelação por cima.
  - Mantidos: 3 Choquinhos ⚡ (vidas), placar de recorde (`pokedex-quiz-best`) e botão "Tentar novamente".

### Fase 30 - Quiz: fundo do palco = imagem real da referência (pin.it/3Rj8eGMCI)

- **public/images/quiz/anime-stage.jpg** (novo): baixado de `i.pinimg.com` (735x549) — a imagem **"Quem é esse pokemon"** (referência pin.it/3Rj8eGMCI), no lugar do SVG artesanal (removido).
- **src/app/components/pokemon-quiz/pokemon-quiz.html**: `.quiz__stage-bg` agora aponta para `images/quiz/anime-stage.jpg` (no palco do jogo e no de loading). Mantidos a silhueta preta, a revelação, os 3 choquinhos ⚡, o recorde e o botão "Tentar novamente".

### Fase 31 - Quiz: imagem da referência adaptada ao palco do minigame

- **src/app/components/pokemon-quiz/*** : A imagem real (anime-stage.jpg, 735x549 ≈ 4:3) ficava "esquisita" no palco quadrado (1:1) - o `cover` cortava a explosão. Adaptado ao minigame:
  - `.quiz__stage` agora tem `aspect-ratio: 4 / 3` (mesma proporção da imagem) - a explosão aparece inteira, sem cortes feios.
  - `object-position: 50% 45%` centraliza a explosão atrás da silhueta.
  - Novo `.quiz__stage-shade`: vinheta vermelha radial + topo escurecido para integrar a borda da imagem ao fundo, com a silhueta (z 2), vidas (z 4) e revelação por cima.
- **A explosão da imagem de referência é a que o usuário queria** (não os "palitos" finos do conic-gradient anterior).

### Fase 32 - Quiz: Pokémon montado na explosão (esquerda) + maior

- **src/app/components/pokemon-quiz/pokemon-quiz.scss**: análise da imagem (via amostragem ffmpeg de pixels) mostrou a **explosão azul ~25% à esquerda** e o vermelho à direita. O sprite (silhueta/revelação) foi deslocado para a explosão (`margin-left: -21%` → centro ~30% da largura, `margin-top: 1%`) e **aumentado** de 58% → 66% da largura do palco (max 250px). Vidas, rótulo e restante do minigame intactos.

### Fase 33 - Quiz: pré-carregamento para parar o "travar" ao carregar Pokémon

- **src/app/components/pokemon-quiz/pokemon-quiz.ts**: o atraso era a ida à PokéAPI a cada pergunta (rede). Agora:
  - `prefetchNext()`: enquanto o jogador responde, a próxima pergunta já é buscada em segundo plano e guardada em `pending` (com pré-carga da imagem via `new Image()`).
  - `newQuestion()`: se há `pending`, aplica na hora (transição sem carregamento); senão busca normalmente.
  - `applyPokemon()` centraliza a definição da pergunta + pré-carga da imagem (silhueta aparece imediata).

### Fase 34 - Busca global corrigida (qualquer Pokémon, mesmo o último)

- O erro: `searchPokemonByName` chamava `/pokemon/{query}` que só aceita **nome/ID exatos** — busca parcial dava 404, e ainda havia filtro que escondia Pokémon já carregados na tela.
- **src/app/core/services/pokemon-api.service.ts**: novo `searchPokemonGlobal(query)`:
  - ID numérico → busca exata.
  - Nome parcial → baixa a **lista completa** (`/pokemon?limit=5000`, com cache `nameListCache`), filtra por `includes` (com fallback sem hífen), pega até **4 resultados** e busca os detalhes de cada um.
- **src/app/app.ts** + **app.html** + **app.scss**: `globalSearchResult` virou `signal<Pokemon[]>`; o bloco `global-result` renderiza uma **grade com até 4 cards** dos achados. Removida a regra `!loaded` — aparece **independente de já estar na tela inicial**.
- Reaproveitados: modal de detalhes, comparação e favoritos nos cards do resultado.

### Fase 35 - Sequência numérica correta (sem formas "10001+")

- A lista `/pokemon` da PokeAPI tem **1351** entradas: 1025 Pokémon reais + **326 formas** (Deoxys-Attack, Rotom-Heat etc.) que a PokeAPI numera como **10001, 10002…**. Elas entravam no fim da lista e nos resultados → apareciam números errados como "10001" ao chegar nos últimos / ao pesquisar.
- **src/app/core/services/pokemon-api.service.ts**:
  - `MAX_POKEMON_ID = 1025` + helper `speciesOnly()` (filtra por id da URL, 1–1025).
  - `getPokemonPage()`: só espécies; se sobrar só forma, retorna página vazia com `next: null` (grade termina no #1025).
  - `getPokemonByType()`: filtro `speciesOnly` também (formas não aparecem por tipo).
  - `getPokemonNameList()`: cache só com espécies → busca por nome não retorna formas.
  - `searchPokemonGlobal()`: busca numérica só aceita 1–1025; acima disso retorna vazio. Buscar "1001" → wo-chien (#1001) corretamente.

### Fase 36 - Menu "Sobre mim"

- **src/app/app.html + app.ts + app.scss**: item **👩‍💻 Sobre mim** no menu lateral abre um modal com a apresentação da Ana Clara (dados extraídos do currículo digital claralimadev.github.io/curriculo-ana):
  - Formação: técnica em Mecatrônica (SENAI), Engenharia de Software (UniAteneu), Squad Proenergia no Hackathon Proenergia Summit 2026.
  - Foco: frontend (Angular 22, TypeScript, SCSS) + acessibilidade e inclusão.
  - `aboutSkills` (chips) e seção "Sobre este projeto" descrevendo o app.
  - **Sem contato**, conforme pedido.

### Fase 37 - Responsividade mobile

- **src/styles.scss**: `html, body { overflow-x: hidden }` (mata rolagem horizontal) e `img, svg { max-width: 100% }` — nada mais "sai" dos containers/icons.
- **src/app/app.scss**: badge Dugtrio encolhido de 42px → 34px (as cabecinhas saíam do botão) + bloco `@media (max-width: 479px)`:
  - grid da página e de resultados globais em **2 colunas** fixas (`minmax(0, 1fr)`, sem estouro);
  - espaçamentos e paddings de modal/compare menores; imagens de comparação até 110px.
- **pokemon-quiz.scss**: `@media (max-width: 479px)` reduz padding do quiz e mantém respostas em 2 colunas.
- **Menu centralizado no desktop**: `@media (min-width: 768px)` no `.drawer` — painel centralizado na tela (top/left 50% + translate), largura 380px, cantos arredondados e cabeçalho centralizado.
- **Deploy do Fase 37/38 publicado no GitHub Pages** (token novo).

### Fase 38 - Botão VLibras reposicionado (mobile/desktop)

- **src/index.html**: script `ajustarVlibras` injeta estilos no shadowRoot do acessibily:
  - Mobile (padrão): `bottom: 88px; right: 14px` — o botão saiu do canto esquerdo (onde o polegar toca) para a **direita**, **acima** do botão "Carregar Mais" (não fica em cima dele).
  - Desktop (≥768px): `bottom: 24px; right: 24px`.
- Deploy atualizado no GitHub Pages (site: 200, ajuste VLibras confirmado no bundle).

### Fase 39 - Descrição PT-BR, carregamento por Geração/Região e Comparação com Vencedor

- **src/app/core/data/flavor-texts.pt.ts** (novo): dicionário local de descrições em PT-BR para os 151 de Kanto (`PT_FLAVOR_TEXTS` chaveado por ID). A PokéAPI **não possui** flavor text `pt` para a maioria das espécies (confirmado via inspeção da API para #1 e #25); o app hoje caía para `en`.
- **src/app/core/services/pokemon-api.service.ts**: `toFlavorText(id, species, lang)` — quando `lang === 'pt'`, consulta o dicionário local antes do fallback da API (lançado: `lang → en → entries[0]`).
- **src/app/core/services/pokemon-api.service.ts**: novo `getPokemonInRange(min, max, offset)` — usa a lista de nomes cacheada, filtra por faixa de ID, aplica offset 12 em 12 e devolve `PokemonPage` (permite "Carregar Mais" dentro da geração/região).
- **src/app/app.ts**: campo privado `range: IdRange | null` — `loadPokemon()` prioriza tipo → faixa → lista geral. `onGenerationChange`/`onRegionChange` agora **recarregam da API os primeiros 12 Pokémon da classificação** (antes apenas filtravam localmente), limpam o filtro concorrente (tipo/geração/região são mutuamente exclusivos), e clicar no item já ativo **destiva** o filtro (toggle). `clearFilter()` também zera `range`.
- **src/app/app.ts**: computeds `compareRows` (linhas HP/ATK/DEF/SPA/SPD/VEL com `winner: 'A' | 'B' | 'tie'`) e `compareOutcome` (vencedor por **total de atributos**, com pontos totais, perdedor e vantagens por stat). `statTotal()` soma os 6 stats. Removido o método `statsFor`.
- **src/app/app.html** (modal de comparação): cabeçalho das colunas com o nome de cada Pokémon (`vs-stat__side-name`); barra/valor do lado vencedor em ouro por stat; ao final, cartão do vencedor com **moldura dourada animada**, **troféu 🏆**, imagem, `#número`, nome e badge "⚡ Vencedor", seguido da explicação (total de pontos de cada lado + em quais atributos levou vantagem). Empate em totais exibe mensagem própria.
- **src/app/app.scss**: estilos de `vs-stat__row--header`, `vs-stat__side-name`, `vs-stat__side--win`/`vs-stat__fill--win` (ouro `#e6a817/#ffcc00`), `.vs-winner*` (card dourado com `winner-glow`, troféu flutuante) e `.vs-winner__reason`. Recomendado `prefers-reduced-motion` para o glow do troféu.
- **angular.json**: orçamento `anyComponentStyle` de 16kB → **20kB** (warning) / 24kB (error) devido aos estilos do vencedor (build limpo, sem warnings).
- **Validação**: `npm run build` (produção) sem erros/warnings; testes unitários passando 2/2.

### Fase 40 - Treinadores nas laterais (sprites Pokémon Showdown + parallax)

- **public/images/trainers/** (novo): sprites oficiais de treinadores do Pokémon Showdown (80×80, PNG transparente) baixados de `https://play.pokemonshowdown.com/sprites/trainers/` — `red`, `brock`, `steven` (esquerda); `ash`, `misty`, `cynthia` (direita). Hospedados localmente no app para não depender do site externo no runtime.
- **src/app/app.html**: dois `<aside class="trainer-art trainer-art--left/right">` posicionados `position: fixed` nas laterais, com 3 `<img class="trainer-art__sprite">` espaçados a cada `18vh`, `aria-hidden` (decorativo).
- **src/app/app.scss**: marca d'água — sprites com `opacity: 0.08` (8%), `pointer-events: none`, largura `clamp(84px, 9vw, 120px)`, `z-index: 1` (acima do vídeo −1, abaixo dos modais 30). Visíveis apenas em `@media (min-width: 1024px)` (some no mobile).
- **src/app/app.ts**: `initTrainerParallax()` registrado no `afterNextRender` + `destroyRef.onDestroy` — no scroll (listener `passive` + `requestAnimationFrame`) aplica `translate3d(0, scrollY * 0.08px, 0)` (parallax a **8%** da rolagem, suave); com `prefers-reduced-motion: reduce` as imagens ficam estáticas.
- **angular.json**: `baseHref: '/pokedex-app/'` na config de produção — corrige a quebra de deploy (o primeiro envio serviu `base href="/"` e derrubou o site; o reenvio com a base correta restaurou).
- **Validação**: `npm run build` limpo; testes 2/2; artefatos (`images/trainers/*.png`) presentes no `dist`.

---

## Status Final

# Resultado: Pokedex em Angular 22 — 100% CONCLUÍDO

### Funcionalidades entregues
- Listagem em grid responsivo com cards (#ID, nome, imagem e tipos).
- Dados vindos da PokéAPI com mapeamento dos detalhes e stats por Pokémon.
- Busca instantânea por nome/ID e filtro por tipo (signals + computed).
- Paginação "Carregar Mais" usando `limit`/`offset`.
- Modal de detalhes com HP, Ataque, Defesa e Velocidade.
- Responsividade total: mobile first (<640px), tablet (>=640px) e desktop (>=960px) com grid `auto-fit`, controles tocáveis (48px) e modal adaptado.
- Tema Claro/Escuro com variáveis CSS, botão de alternância com ícones SVG de Charmander/Umbreon e preferência salva no `localStorage`.
- Hero Section centralizada estilo Google ("Bem-vindo, Treinador!") com busca e grade de botões de tipos + opção de limpar filtro.
- Build de produção, testes e formatação validados.

**Data de conclusão:** 2026-09-13