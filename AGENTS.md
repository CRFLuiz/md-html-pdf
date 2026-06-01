# AGENTS.md - md-html-pdf

## Comandos

- `npm run dev` - Vite dev server (porta provável: 5173)
- `npm run build` - Build para `dist/`
- `npm run lint` - ESLint (flat config)
- `npm run preview` - Preview do build

Sem typecheck (não usa TypeScript). Sem testes definidos.

## Arquitetura

**Single-page app**: React 19 + Vite 8

**Fluxo de exportação PDF** (importante - usa DUAS libs):
1. `html2pdf.js` gera o PDF inicial a partir do HTML
2. `pdf-lib` carrega o PDF e adiciona headers/footers em cada página
3. O processo é: html2pdf → blob → pdf-lib → modifica → download

**Sistema de tema**:
- Usa `[data-theme="dark"]` no `document.documentElement`
- Tema salvo em `localStorage`
- Respeita `prefers-color-scheme` na primeira carga

## Arquivos-chave

- `src/App.jsx` - Componente principal, lógica de exportação, estados de cor
- `src/App.css` - Design tokens (`:root` e `[data-theme="dark"]`), estilos de toast
- `src/index.css` - Reset global mínimo (após limpeza)
- `index.html` - Entrypoint, viewport meta com `shrink-to-fit=no`

## Convenções

**CSS**:
- Design tokens definidos como `--color-*` em `:root`
- Escala de espaçamento: `--space-{1-8}` (0.25rem a 2rem)
- Escala tipográfica: `--text-{xs-xl}` (0.75rem a 2rem)
- Sempre usar `var(--color-*)` - nunca hex direto em `App.css`

**PDF Export**:
- Cores customizáveis via `bgColor` e `textColor` (estados no App.jsx)
- Default: fundo branco (`#ffffff`), texto escuro (`#1e293b`)
- Headers/footers: upload de imagem (PNG/JPG) ou HTML
- Margens zero no PDF (configurado em `margin: 0` no html2pdf)

**Acessibilidade**:
- Skip link presente (`skip-link`)
- `aria-label` em botões
- `aria-live="polite"` em toasts
- `prefers-reduced-motion` suportado

## Quirks

- `pdf-lib` requer `Uint8Array` para embedar imagens - converter via `FileReader.readAsArrayBuffer()`
- `renderHtmlToImage()` cria elemento temporário com `position: absolute; left: -9999px`
- Toast usa duplo timeout: 4s para iniciar saída + 300ms para animção de exit
- `lucide-react` icons importados diretamente (ex: `Download`, `Sun`, `Moon`, `Loader2`)

## O que NÃO fazer

- Não adicionar TypeScript (projeto é JavaScript)
- Não usar hex diretamente em `App.css` (usar tokens)
- Não esquecer que `pdf-lib` modifica o PDF após html2pdf gerar
- Não remover `dist/` do `.gitignore` (artifact de build)
