# MD → HTML → PDF

A React-based markdown editor with real-time preview and PDF export.

## Overview

**MD → HTML → PDF** is a minimal, focused tool that lets you write [Markdown](https://www.markdownguide.org/) on the left panel and see a live HTML preview on the right — then export the result as a PDF with one click.

## Features

- **Real-time preview** — edits appear instantly on the right panel
- **GitHub Flavored Markdown (GFM)** — tables, strikethrough, task lists, and more via `remark-gfm`
- **Syntax highlighting** — code blocks are highlighted automatically with `rehype-highlight`
- **Light / Dark mode** — respects system preference and persists user choice
- **PDF export** — renders the preview to a clean PDF using `html2pdf.js`
- **File upload** — load existing `.md` files directly into the editor

## Tech Stack

| Layer | Library |
|---|---|
| UI framework | React 19 |
| Bundler | Vite |
| Markdown parsing | `react-markdown` + `remark-gfm` |
| Syntax highlighting | `rehype-highlight` |
| PDF generation | `html2pdf.js` + `pdf-lib` |
| Icons | `lucide-react` |

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

## Project Structure

```
md-html-pdf/
├── index.html          # Entry HTML
├── vite.config.js      # Vite configuration
├── package.json
├── public/             # Static assets
├── src/
│   ├── main.jsx        # React entry point
│   ├── App.jsx         # Main application component
│   ├── App.css         # Application styles
│   ├── index.css       # Global styles
│   └── assets/         # Static assets (SVG, etc.)
└── docs/               # Documentation
    └── README.md       # (this file)
```

## Usage

1. Write or paste Markdown in the **left panel**.
2. The **right panel** shows the live HTML preview.
3. Click **Export PDF** to download the rendered document.
4. Toggle **light / dark mode** with the theme button.
5. Use **Upload** to load an existing `.md` file.

## License

Private / All rights reserved.
