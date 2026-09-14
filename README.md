# Pokédex — Angular 🎯

Uma **Pokédex interativa** feita com **Angular 22** (TypeScript e SCSS) consumindo a [PokéAPI](https://pokeapi.co/). É uma SPA completa, responsiva e acessível, com suporte a **Libras (VLibras)**.

## 🔗 Acesse o projeto

### **https://claralimadev.github.io/pokedex-app/**

---

## ✨ Funcionalidades

- **Listagem em grid responsivo** com cards (#ID, nome, imagem e tipos).
- **Busca global** por nome ou número (com debounce), inclusive fora da lista carregada.
- **Filtros por tipo, geração e região** — carregando os primeiros 12 Pokémons da classificação direto da API, com "Carregar Mais".
- **Favoritos** ⚡ salvos no `localStorage`.
- **Comparação de Pokémons** (batalha 🆚) com barras por atributo, destaque em ouro do vencedor por stat e **coroação do vencedor** 🏆 (total de atributos).
- **Destaques por Geração** 🧢 (o mais forte e o melhor treinador de cada geração).
- **Minigame "Quem é esse Pokémon?"** 🎮 com 3 vidas, contagem de recorde e efeito de "explosão" na revelação.
- **Modal de detalhes** com altura, peso, descrição (PT-BR, EN e ES), stats e linha evolutiva.
- **Tema claro/escuro** 🌗 e **idiomas 🇧🇷 / 🇺🇸 / 🇪🇸**.
- **Acessibilidade**: navegação por teclado, `aria`, contraste e **VLibras** para LIBRAS.
- **Treinadores nas laterais** (sprites do Pokémon Showdown) com marcas d'água em parallax de 8%.

---

## 🛠️ Tecnologias

- **Angular 22** (standalone components, `signals`, control flow `@if/@for`)
- TypeScript + SCSS
- [PokéAPI](https://pokeapi.co/)
- Vitest (testes unitários)
- Hospedagem: **GitHub Pages**

---

## 🚀 Rodando localmente

```bash
npm install
ng serve
```

Abra `http://localhost:4200/`.

### Build de produção

```bash
ng build
```

Os artefatos ficam em `dist/pokedex-app/browser` (direcionado ao GitHub Pages com `baseHref="/pokedex-app/"`).

### Testes

```bash
ng test
```

---

## 👩‍💻 Sobre a autora

Feito por **Ana Clara Lima Ribeiro** — técnica em Mecatrônica (SENAI) e estudante de Engenharia de Software (UniAteneu), apaixonada por interfaces acessíveis e inclusion.

---

**Projeto de estudo/mentoria** — me acompanhe também em: [GitHub](https://github.com/claralimadev)