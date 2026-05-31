# UI/UX Task Descriptions

Este arquivo contém descrições detalhadas das tarefas de UI/UX para o projeto md-html-pdf.

---

## Task 1 — Design System & Semantic Color Tokens

**Arquivos afetados:** `src/App.css`

**Descrição:**
O projeto atual usa valores hex brutos em `App.css`. Esta tarefa estabelece um sistema de design tokens usando CSS custom properties, permitindo manutenção fácil e suporte a temas.

**Tokens necessários:**
- `--color-bg`: Cor de fundo principal
- `--color-surface`: Cor de superfície para painéis/cards
- `--color-primary`: Cor primária para CTAs
- `--color-primary-hover`: Cor primária no hover
- `--color-text`: Cor de texto principal
- `--color-text-secondary`: Cor de texto secundária
- `--color-border`: Cor de bordas
- `--color-success`: Cor para sucesso (verde)
- `--color-error`: Cor para erro (vermelho)

**Estilo escolhido:** Minimalism (adequado para ferramenta de edição Markdown)

---

## Task 2 — Dark Mode Support

**Arquivos afetados:** `src/App.jsx`, `src/App.css`

**Descrição:**
Implementar alternância entre tema claro e escuro usando o sistema de tokens semânticos. O tema deve respeitar a preferência do sistema na primeira carga e persistir a escolha do usuário.

**Implementação:**
- Seletor `[data-theme="dark"]` em `App.css` com variantes escuras
- Estado React para tema em `App.jsx`
- Persistência via `localStorage`
- Detecção de `prefers-color-scheme`

---

## Task 3 — Responsive Layout (Mobile-First)

**Arquivos afetados:** `src/App.css`

**Descrição:**
O layout atual com divisão 50/50 quebra em mobile. Esta tarefa refatora para uma abordagem mobile-first com breakpoints adequados.

**Pontos-chave:**
- Mobile (<768px): editor empilhado acima do preview
- Desktop (≥768px): lado a lado
- Escala de espaçamento 4/8px
- Limite de largura do texto no preview (65-75ch)

---

## Task 4 — Accessibility: Focus, Labels & Semantics

**Arquivos afetados:** `src/App.jsx`, `src/App.css`

**Descrição:**
Corrigir lacunas de acessibilidade para atender ao padrão WCAG AA.

**Melhorias:**
- Anéis de foco visíveis em todos os elementos interativos
- `aria-label` no botão de exportar
- `<label>` adequada para o textarea
- Hierarquia de cabeçalhos correta (apenas um `<h1>`)
- Skip link para navegação via teclado
- Suporte a `prefers-reduced-motion`

---

## Task 5 — Export Button: States, Feedback & Icon

**Arquivos afetados:** `src/App.jsx`, `src/App.css`

**Descrição:**
Adicionar estados de interação, feedback visual e ícone ao botão de exportação PDF.

**Recursos:**
- Estados hover/pressed/disabled
- Spinner durante geração do PDF
- Botão desativado durante exportação
- Toast notifications (sucesso/erro)
- Ícone SVG + texto
- `cursor: pointer`

---

## Task 6 — Debounce Markdown Rendering

**Arquivos afetados:** `src/App.jsx`

**Descrição:**
Adicionar debounce na renderização Markdown para evitar re-renderizações a cada tecla.

**Implementação:**
- Usar `useDeferredValue` (React 18+) ou utilitário de debounce
- Indicador sutil de "Renderizando..." quando houver atraso
- Entrada do textarea responsiva (sem lag)

---

## Task 7 — Typography System

**Arquivos afetados:** `src/App.css`

**Descrição:**
Estabelecer uma escala tipográfica consistente e estilos de texto adequados.

**Escala de tipos:**
- `--text-xs: 12px`
- `--text-sm: 14px`
- `--text-base: 16px` (previne auto-zoom no iOS)
- `--text-lg: 18px`
- `--text-xl: 24px`
- `--text-2xl: 32px`

**Hierarquia:**
- `line-height: 1.6` para texto corpo
- `line-height: 1.25` para cabeçalhos
- `font-weight`: 400 (corpo), 500 (labels), 600-700 (cabeçalhos)

---

## Task 8 — Toast Notification Component

**Arquivos afetados:** `src/App.jsx`, `src/App.css`

**Descrição:**
Criar um sistema de notificações toast reutilizável para feedback de ações do usuário.

**Recursos:**
- Variantes: success (verde), error (vermelho), info (azul)
- Auto-dismiss após 4 segundos
- Posicionamento: top-right ou bottom-center
- `aria-live="polite"` para leitores de tela
- Animações de entrada/saída (respeitando `prefers-reduced-motion`)

---

## Task 9 — Corrigir Conflitos no index.css

**Arquivos afetados:** `src/index.css`, `src/App.css`

**Descrição:**
O arquivo `index.css` contém valores que conflitam com o sistema de tokens em `App.css`. Este é um problema crítico que causa inconsistências visuais.

**Problemas identificados:**
1. Variáveis CSS conflitantes (`--text`, `--bg`, etc.) em `index.css` vs tokens em `App.css`
2. `#root` com largura fixa de `1126px` causa rolagem horizontal
3. Fonte base `18px` em `index.css` pode causar auto-zoom no iOS
4. Media queries em `index.css` (max-width: 1024px) podem sobrepor estilos de `App.css`

**Solução recomendada:**
- Remover ou limpar `index.css`, mantendo apenas resets globais mínimos
- Garantir que `App.css` seja a única fonte de estilos temáticos
- Ou mesclar o necessário de `index.css` em `App.css`

---

## Task 10 — Viewport Meta Tag Optimization

**Arquivos afetados:** `index.html`

**Descrição:**
Otimizar a meta tag viewport para melhor experiência mobile.

**Atributos necessários:**
- `width=device-width`: Garante largura correta
- `initial-scale=1`: Escala inicial
- `shrink-to-fit=no`: Evita problemas de redimensionamento no iOS
- `maximum-scale=1` (opcional): Previne zoom indesejado

---

## Task 11 — Mobile Viewport Units

**Arquivos afetados:** `src/App.css`, `src/index.css`

**Descrição:**
Substituir unidades `100vh` por unidades dinâmicas modernas para melhor suporte mobile.

**Problema:**
`100vh` não considera a barra de endereços dinâmica em dispositivos móveis, causando espaços em branco.

**Solução:**
- Usar `100dvh` (dynamic viewport height) ou `min-h-dvh`
- Testar com a barra de endereços visível e oculta
- Funciona em navegadores modernos (verificar compatibilidade se necessário)
