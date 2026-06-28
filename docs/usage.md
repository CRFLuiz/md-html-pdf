# Usage Guide

This guide provides detailed instructions on how to use the MD → HTML → PDF converter application.

## Getting Started

### Writing Markdown

The application features a split-pane interface:

- **Left Panel** — Markdown editor where you write your content
- **Right Panel** — Live HTML preview of your Markdown

The editor supports full GitHub Flavored Markdown (GFM), including:

- **Headings** (`#`, `##`, `###`, etc.)
- **Bold** and *italic* text
- ~~Strikethrough~~
- [Links](https://example.com)
- Images (`![alt](url)`)
- Tables
- Code blocks with syntax highlighting
- Task lists (`- [ ]`, `- [x]`)
- Blockquotes
- Ordered and unordered lists

### Example Markdown

```markdown
# My Document Title

## Introduction

Welcome to my **Markdown** document.

## Code Example

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
```

## Table Example

| Feature | Status |
|---------|--------|
| Editor | ✅ |
| Preview | ✅ |
| PDF Export | ✅ |

## Task List

- [x] Write content
- [x] Add styling
- [ ] Export to PDF
```

## Exporting to PDF

### Basic Export

1. Write your Markdown content in the editor
2. Click the **Export PDF** button (download icon) in the top-right corner
3. The PDF will be downloaded automatically as `document.pdf`

### Custom Headers and Footers

You can add custom headers and footers to your PDFs:

1. **Click the header/footer buttons** — Located next to the export button
2. **Select a file** — Supports:
   - PNG images
   - JPG/JPEG images
   - HTML files
3. **File requirements**:
   - Maximum size: 2MB
   - Recommended width: A4 (210mm)

The header appears at the top of each page, and the footer appears at the bottom.

### PDF Settings

The exported PDF uses these default settings:
- **Format**: A4
- **Orientation**: Portrait
- **Margins**: 10mm (or 30mm if using a header)
- **Image Quality**: 98%

## Theme Customization

### Switching Themes

Click the **sun/moon icon** in the top-right corner to toggle between:
- **Light mode** — White background with dark text
- **Dark mode** — Dark background with light text

The theme preference is automatically saved to your browser's localStorage and persists between sessions.

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Export PDF | Click export button |

## Troubleshooting

### PDF Not Generating

- Ensure your Markdown content doesn't have rendering errors
- Check that your header/footer files are under 2MB
- Try refreshing the page

### Header/Footer Not Appearing

- Verify the file format is correct (PNG, JPG, or HTML)
- Check that the image dimensions are appropriate for A4 pages

### Preview Not Updating

- The preview has a 250ms debounce for performance
- Wait a moment after typing before the preview updates

## Browser Support

The application works best in modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
