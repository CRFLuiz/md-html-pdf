# MD → HTML → PDF Converter

A React-based web application that provides a real-time Markdown editor with live preview and PDF export functionality. Convert your Markdown documents to beautifully formatted PDFs with custom headers and footers.

![React](https://img.shields.io/badge/React-19.2.6-blue)
![Vite](https://img.shields.io/badge/Vite-8.0.12-purple)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **Real-time Preview** — Write Markdown and see the rendered HTML instantly
- **PDF Export** — Generate professional PDF documents with a single click
- **Custom Headers & Footers** — Add PNG, JPG, or HTML headers/footers to your PDFs
- **Theme Support** — Toggle between light and dark modes (persisted to localStorage)
- **GitHub Flavored Markdown** — Full GFM support including tables, task lists, and strikethrough
- **Syntax Highlighting** — Beautiful code blocks with highlight.js integration
- **Responsive Design** — Works on desktop and tablet devices

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/CRFLuiz/md-html-pdf.git
cd md-html-pdf

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Project Structure

```
md-html-pdf/
├── src/
│   ├── App.jsx       # Main application component
│   ├── main.jsx      # React entry point
│   ├── App.css       # Application styles
│   └── index.css     # Global styles
├── public/           # Static assets
├── docs/             # Documentation
├── index.html        # HTML template
├── vite.config.js    # Vite configuration
└── package.json     # Dependencies
```

## Technologies Used

| Category | Technology |
|----------|------------|
| Framework | React 19 |
| Build Tool | Vite 8 |
| Markdown | react-markdown, remark-gfm, rehype-highlight |
| PDF Generation | html2pdf.js, pdf-lib |
| Icons | lucide-react |

## License

MIT License — feel free to use this project for any purpose.
