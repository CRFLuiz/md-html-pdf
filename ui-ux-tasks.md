# UI/UX Improvement Tasks

## Task 1 — Design System & Semantic Color Tokens
**Priority:** 4 (HIGH) | **Domain:** style, color

### What should be done
Replace all raw hex values in `src/App.css` with a semantic color token system and define a consistent visual style for the app.

### How it should be done
1. Define CSS custom properties (design tokens) in `:root` covering:
   - `--color-bg`, `--color-surface`, `--color-primary`, `--color-primary-hover`, `--color-text`, `--color-text-secondary`, `--color-border`, `--color-success`, `--color-error`
2. Apply tokens to all elements in `src/App.css`
3. Choose a style: **minimalism** (tool/product type: Markdown editor)
4. Use a neutral, professional palette (slate/gray based)

### Objective
Establish a maintainable, consistent visual foundation that can scale to dark mode and future features.

### Acceptance Criteria
- [x] No raw hex values remain in `src/App.css` (only `var(--color-*)` tokens)
- [x] All interactive elements use semantic colors (primary for CTAs, surface for cards/panels)
- [x] Color contrast ≥ 4.5:1 verified for text on surface backgrounds
- [x] Style is consistent across all elements (no mixed visual languages)

---

## Task 2 — Dark Mode Support
**Priority:** 4 (HIGH) | **Domain:** style, color

### What should be done
Add a dark mode toggle that switches between light and dark themes using the semantic token system.

### How it should be done
1. Add a `[data-theme="dark"]` selector in `src/App.css` with dark variants of all tokens
2. Add a theme state (`useState`) and toggle button in `src/App.jsx`
3. Persist user preference in `localStorage`
4. Respect `prefers-color-scheme` on first load

### Objective
Allow users to work comfortably in low-light environments and match system preferences.

### Acceptance Criteria
- [x] Toggle button switches between light and dark themes
- [x] Dark mode uses desaturated/lighter tonal variants (not inverted colors)
- [x] All text meets 4.5:1 contrast in dark mode independently
- [x] Dividers, borders, and interaction states visible in both modes
- [x] User preference persists across sessions via `localStorage`
- [x] First load respects `prefers-color-scheme` system setting

---

## Task 3 — Responsive Layout (Mobile-First)
**Priority:** 5 (HIGH) | **Domain:** ux, layout

### What should be done
Refactor the 50/50 split layout to be mobile-friendly with breakpoints and proper spacing.

### How it should be done
1. Use mobile-first approach: stack editor above preview on small screens (`flex-direction: column`)
2. Add breakpoint at 768px: switch to side-by-side (`flex-direction: row`)
3. Use 4/8px spacing scale for all padding/margins
4. Set `max-width` on preview text (~65-75ch) for readability
5. Add `viewport` meta tag if not present (Vite handles this by default)

### Objective
Ensure the app is usable and readable on phones, tablets, and desktops.

### Acceptance Criteria
- [x] Editor stacks above preview on screens < 768px
- [x] Side-by-side layout activates at ≥ 768px
- [x] All spacing uses 4/8px increments (no arbitrary values like 20px, 32px)
- [x] Preview text line length ≤ 75 characters on desktop
- [x] No horizontal scroll on any screen size
- [x] Touch targets (buttons, textarea) meet minimum 44×44px on mobile

---

## Task 4 — Accessibility: Focus, Labels & Semantics
**Priority:** 1 (CRITICAL) | **Domain:** ux, accessibility

### What should be done
Fix all accessibility gaps: focus rings, aria-labels, heading hierarchy, and semantic structure.

### How it should be done
1. Add visible focus rings (2-4px, `--color-primary`) on all interactive elements in `src/App.css`
2. Add `aria-label="Export document to PDF"` to export button
3. Add `<label>` for the textarea with `htmlFor` instead of placeholder-only
4. Change header `<h1>` to `<h2>` or use only one `<h1>` in the preview by wrapping preview in `<article>` with `aria-label`
5. Add skip link: "Skip to preview" for keyboard users
6. Add `prefers-reduced-motion` media query to disable transitions

### Objective
Make the app usable by screen readers and keyboard-only users, meeting WCAG AA standards.

### Acceptance Criteria
- [x] All interactive elements show visible focus rings (2-4px)
- [x] Export button has descriptive `aria-label`
- [x] Textarea has a proper `<label>` element (not placeholder-only)
- [x] Only one `<h1>` renders per page (header or preview, not both)
- [x] Skip link is present and functional for keyboard users
- [x] `prefers-reduced-motion: reduce` disables all transitions/animations
- [x] Tab order matches visual order

---

## Task 5 — Export Button: States, Feedback & Icon
**Priority:** 2 (CRITICAL), 7 (MEDIUM), 8 (MEDIUM) | **Domain:** ux, interaction

### What should be done
Add proper interaction states, loading feedback, and status notifications to the PDF export flow.

### How it should be done
1. Add hover/pressed/disabled states for export button in `src/App.css` (opacity/elevation changes, 150ms transition)
2. Show a spinner/loading state on the button during PDF generation
3. Disable button during export to prevent double-clicks
4. Add toast notifications for: success ("PDF exported!"), error ("Export failed"), and timeout
5. Use an SVG icon (e.g., Lucide `Download` icon) next to button text
6. Add `cursor: pointer` to button styles

### Objective
Give users clear feedback during the export process and prevent errors from repeated clicks.

### Acceptance Criteria
- [x] Button shows hover state (subtle background/elevation change)
- [x] Button shows pressed state (scale 0.98 or opacity change)
- [x] Button shows spinner and disables during PDF generation
- [x] Success toast appears after export with auto-dismiss (3-5s)
- [x] Error toast appears with retry guidance if export fails
- [x] Button uses SVG icon + text (not emoji)
- [x] `cursor: pointer` applied to button

---

## Task 6 — Debounce Markdown Rendering
**Priority:** 3 (HIGH) | **Domain:** ux, performance

### What should be done
Debounce the markdown-to-HTML rendering to avoid re-rendering on every keystroke.

### How it should be done
1. Use `useDeferredValue` (React 18+) or a `debounce` utility for the markdown state
2. Show a subtle "Rendering..." indicator when deferred value lags behind input
3. Keep textarea input responsive (no lag on typing)

### Objective
Improve performance and perceived responsiveness during fast typing.

### Acceptance Criteria
- [x] Typing in textarea feels instant (no input lag)
- [x] Preview updates are debounced (250-300ms delay after last keystroke)
- [x] Optional: "Rendering..." indicator shows when preview is updating
- [x] No layout thrashing or excessive re-renders in React DevTools

---

## Task 7 — Typography System
**Priority:** 6 (MEDIUM) | **Domain:** typography

### What should be done
Establish a consistent type scale and proper text styling for both editor and preview.

### How it should be done
1. Define type scale CSS variables: `--text-xs: 12px`, `--text-sm: 14px`, `--text-base: 16px`, `--text-lg: 18px`, `--text-xl: 24px`, `--text-2xl: 32px`
2. Apply: textarea = `--text-base` (16px), header = `--text-xl`, preview headings use scale
3. Set `line-height: 1.6` for body text, `1.25` for headings
4. Use `font-weight` hierarchy: headings 600-700, body 400, labels 500
5. Ensure `letter-spacing` is default (no tight tracking on body)

### Objective
Create a readable, professional typography hierarchy that scales across screen sizes.

### Acceptance Criteria
- [x] Base font size is 16px (prevents iOS auto-zoom on mobile)
- [x] Line-height is 1.5-1.75 for all body text
- [x] Heading hierarchy uses consistent font-weight (600-700)
- [x] Type scale variables are defined and used (no arbitrary font-size values)
- [x] Preview text is readable at all breakpoints

---

## Task 8 — Toast Notification Component
**Priority:** 8 (MEDIUM) | **Domain:** ux, feedback

### What should be done
Create a reusable toast notification system for export status and future messages.

### How it should be done
1. Create a `Toast` component or use a lightweight approach with state in `App.jsx`
2. Support variants: success (green), error (red), info (blue)
3. Auto-dismiss after 4 seconds
4. Position: top-right or bottom-center, above all content (`z-index: 1000`)
5. Use `aria-live="polite"` for screen reader announcements
6. Add enter/exit animation (fade + slide, 200ms, respect `prefers-reduced-motion`)

### Objective
Provide non-blocking feedback for user actions with proper accessibility support.

### Acceptance Criteria
- [x] Toasts appear on export success and error
- [x] Toasts auto-dismiss after 4 seconds
- [x] Toasts use `aria-live="polite"` for screen reader support
- [x] Toasts do not steal focus from the editor
- [x] Multiple toasts stack without overlapping
- [x] Animations respect `prefers-reduced-motion`
- [x] Color contrast ≥ 4.5:1 for toast text

---

## Task 9 — Corrigir Conflitos no index.css
**Priority:** 1 (CRITICAL) | **Domain:** style, color

### What should be done
Remover ou refatorar o arquivo `src/index.css` que contém valores hex brutos e conflita com o sistema de tokens semânticos definido em `src/App.css`.

### Como deve ser feito
1. Remover as variáveis CSS `--text`, `--text-h`, `--bg`, `--border`, etc. de `index.css` que conflitam com `App.css`
2. Remover a largura fixa de `#root: 1126px` em `index.css` (causa rolagem horizontal)
3. Remover `font: 18px` de `index.css` (causa auto-zoom no iOS)
4. Garantir que `index.css` não sobreponha os tokens definidos em `App.css`
5. Opcionalmente, mesclar estilos globais necessários em `App.css`

### Objetivo
Eliminar conflitos de estilo entre `index.css` e `App.css`, garantindo que o sistema de tokens semânticos seja a única fonte de verdade.

### Acceptance Criteria
- [x] `src/index.css` não define variáveis que conflitam com `App.css`
- [x] `#root` não tem largura fixa de 1126px
- [x] Fonte base não é definida como 18px em `index.css`
- [x] Todos os estilos globais respeitam o sistema de tokens de `App.css`

---

## Task 10 — Viewport Meta Tag Optimization
**Priority:** 1 (CRITICAL) | **Domain:** ux, layout

### What should be done
Atualizar a meta tag viewport em `index.html` para incluir `shrink-to-fit=no` e `maximum-scale=1`.

### Como deve ser feito
1. Verificar se `index.html` tem a meta tag viewport
2. Adicionar `shrink-to-fit=no` para evitar problemas de redimensionamento no iOS
3. Adicionar `maximum-scale=1` para evitar zoom indesejado em alguns dispositivos
4. Garantir `width=device-width, initial-scale=1` esteja presente

### Objetivo
Melhorar a experiência mobile garantindo que o viewport seja configurado corretamente.

### Acceptance Criteria
- [x] Meta tag viewport presente com `width=device-width, initial-scale=1`
- [x] `shrink-to-fit=no` adicionado
- [x] `maximum-scale=1` adicionado (se apropriado para o caso de uso)

---

## Task 11 — Mobile Viewport Units
**Priority:** 5 (HIGH) | **Domain:** layout, responsive

### What should be done
Substituir `100vh` por `min-h-dvh` (ou `100dvh`) para melhor suporte mobile.

### Como deve ser feito
1. Verificar uso de `100vh` em `App.css` e `index.css`
2. Substituir por `min-h-dvh` ou `100dvh` para lidar com a barra de endereços móvel
3. Testar em dispositivos móveis reais ou simulador

### Objetivo
Garantir que o layout ocupa a altura correta da viewport em dispositivos móveis, respeitando a barra de endereços dinâmica.

### Acceptance Criteria
- [x] `100vh` substituído por `min-h-dvh` ou `100dvh` onde apropriado
- [x] Layout não tem espaços em branco extras em mobile
- [x] Funciona corretamente com a barra de endereços móvel visível/oculta
