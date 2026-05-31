import { useState, useEffect, useCallback } from 'react'
import { Download, Sun, Moon, Loader2, Upload, X } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import html2pdf from 'html2pdf.js'
import { PDFDocument, rgb } from 'pdf-lib'
import './App.css'

const defaultMarkdown = `# Bem-vindo ao MD → HTML → PDF

Escreva seu **Markdown** aqui e veja o resultado em tempo real.

## Recursos

- Editor com preview instantâneo
- Suporte a tabelas, código e mais
- Exportação para PDF

\`\`\`js
const hello = "world"
console.log(hello)
\`\`\`

> Citação em destaque

1. Item numerado
2. Outro item
`

function Toast({ toasts, removeToast }) {
  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type}${toast.exiting ? ' exiting' : ''}`}
          role="status"
          onAnimationEnd={() => {
            if (toast.exiting) removeToast(toast.id)
          }}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}

function App() {
  const [markdown, setMarkdown] = useState(defaultMarkdown)
  const [deferredMarkdown, setDeferredMarkdown] = useState(defaultMarkdown)
  const [exporting, setExporting] = useState(false)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  const [toasts, setToasts] = useState([])
  const [rendering, setRendering] = useState(false)
  const [headerFile, setHeaderFile] = useState(null)
  const [footerFile, setFooterFile] = useState(null)
  const [headerPreview, setHeaderPreview] = useState('')
  const [footerPreview, setFooterPreview] = useState('')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [textColor, setTextColor] = useState('#1e293b')
  const [showColorOptions, setShowColorOptions] = useState(false)

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  // Debounce markdown rendering
  useEffect(() => {
    setRendering(true)
    const timer = setTimeout(() => {
      setDeferredMarkdown(markdown)
      setRendering(false)
    }, 250)
    return () => clearTimeout(timer)
  }, [markdown])

  // Toast management
  const addToast = useCallback((type, message) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, type, message, exiting: false }])

    // Remove após 4 segundos (garante remoção mesmo sem animação)
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)))
      setTimeout(() => {
        removeToast(id)
      }, 300) // Tempo para animação sair
    }, 4000)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // File upload handlers
  const handleHeaderUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.match(/image\/(png|jpeg)|text\/html/) || file.size > 2 * 1024 * 1024) {
      addToast('error', 'Arquivo inválido. Use PNG, JPG ou HTML (máx 2MB)')
      return
    }

    setHeaderFile(file)
    if (file.type.includes('image')) {
      const reader = new FileReader()
      reader.onload = (e) => setHeaderPreview(e.target.result)
      reader.readAsDataURL(file)
    } else {
      setHeaderPreview(file.name)
    }
  }

  const handleFooterUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.match(/image\/(png|jpeg)|text\/html/) || file.size > 2 * 1024 * 1024) {
      addToast('error', 'Arquivo inválido. Use PNG, JPG ou HTML (máx 2MB)')
      return
    }

    setFooterFile(file)
    if (file.type.includes('image')) {
      const reader = new FileReader()
      reader.onload = (e) => setFooterPreview(e.target.result)
      reader.readAsDataURL(file)
    } else {
      setFooterPreview(file.name)
    }
  }

  const removeHeader = () => {
    setHeaderFile(null)
    setHeaderPreview('')
  }

  const removeFooter = () => {
    setFooterFile(null)
    setFooterPreview('')
  }

  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsArrayBuffer(file)
    })
  }

  const renderHtmlToImage = async (htmlContent) => {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlContent
    tempDiv.style.position = 'absolute'
    tempDiv.style.left = '-9999px'
    tempDiv.style.top = '0'
    tempDiv.style.width = '210mm' // A4 width
    tempDiv.style.padding = '10px'
    tempDiv.style.background = bgColor
    tempDiv.style.color = textColor
    document.body.appendChild(tempDiv)

    const canvas = await html2canvas(tempDiv, { scale: 2 })
    document.body.removeChild(tempDiv)

    return canvas.toDataURL('image/png').split(',')[1]
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const handleExportPDF = async () => {
    if (exporting) return
    setExporting(true)
    try {
      const element = document.getElementById('preview')
      if (!element) throw new Error('Preview element not found')

      // Step 1: Generate PDF with html2pdf.js using custom colors
      const opt = {
        margin: 0,
        filename: 'temp.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          backgroundColor: bgColor,
          useCORS: true,
          onclone: function(clonedDoc) {
            const preview = clonedDoc.getElementById('preview')
            if (preview) {
              // Force preview to fill page
              preview.style.width = '210mm'
              preview.style.minHeight = '297mm'
              preview.style.background = bgColor
              preview.style.color = textColor
              preview.style.margin = '0'
              preview.style.padding = '24px'
              preview.style.boxSizing = 'border-box'

              const style = clonedDoc.createElement('style')
              style.textContent = `
                #preview {
                  background: ${bgColor} !important;
                  color: ${textColor} !important;
                  padding: 24px !important;
                  margin: 0 !important;
                  min-height: 100% !important;
                  width: 100% !important;
                }
                body {
                  background: ${bgColor} !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  width: 210mm !important;
                  height: 297mm !important;
                }
                #preview * {
                  background-color: transparent !important;
                  color: ${textColor} !important;
                  border-color: ${textColor}20 !important;
                }
                #preview code, #preview pre {
                  background-color: ${bgColor}10 !important;
                }
                #preview th {
                  background-color: ${bgColor}10 !important;
                }
              `
              clonedDoc.head.appendChild(style)
            }
          }
        },
        jsPDF: {
          unit: 'mm',
          format: [210, 297], // Exact A4 size
          orientation: 'portrait',
          hotfixes: ['img'],
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      }

      // Generate PDF as blob
      const pdfBlob = await html2pdf().set(opt).from(element).output('blob')
      const pdfBytes = await pdfBlob.arrayBuffer()

      // Step 2: Load with pdf-lib
      const pdfDoc = await PDFDocument.load(pdfBytes)

      // Force background color on all pages
      const pages = pdfDoc.getPages()
      pages.forEach(page => {
        const { width, height } = page.getSize()
        // Draw background rectangle covering entire page
        page.drawRectangle({
          x: 0,
          y: 0,
          width: width,
          height: height,
          color: rgb(
            parseInt(bgColor.slice(1, 3), 16) / 255,
            parseInt(bgColor.slice(3, 5), 16) / 255,
            parseInt(bgColor.slice(5, 7), 16) / 255
          ),
          borderWidth: 0,
        })
      })

      // Step 3: Process header
      if (headerFile) {
        let headerImage

        if (headerFile.type.includes('image')) {
          const headerBytes = await readFileAsArrayBuffer(headerFile)
          if (headerFile.type.includes('png')) {
            headerImage = await pdfDoc.embedPng(headerBytes)
          } else {
            headerImage = await pdfDoc.embedJpg(headerBytes)
          }
        } else if (headerFile.name.endsWith('.html')) {
          const htmlContent = await headerFile.text()
          const base64 = await renderHtmlToImage(htmlContent)
          const binaryString = atob(base64)
          const bytes = new Uint8Array(binaryString.length)
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
          }
          headerImage = await pdfDoc.embedPng(bytes)
        }

        if (headerImage) {
          const pages = pdfDoc.getPages()
          pages.forEach(page => {
            const { width, height } = page.getSize()
            const targetWidth = width
            const aspectRatio = headerImage.width / headerImage.height
            const targetHeight = targetWidth / aspectRatio

            page.drawImage(headerImage, {
              x: 0,
              y: height - targetHeight,
              width: targetWidth,
              height: targetHeight,
            })
          })
        }
      }

      // Step 4: Process footer
      if (footerFile) {
        let footerImage

        if (footerFile.type.includes('image')) {
          const footerBytes = await readFileAsArrayBuffer(footerFile)
          if (footerFile.type.includes('png')) {
            footerImage = await pdfDoc.embedPng(footerBytes)
          } else {
            footerImage = await pdfDoc.embedJpg(footerBytes)
          }
        } else if (footerFile.name.endsWith('.html')) {
          const htmlContent = await footerFile.text()
          const base64 = await renderHtmlToImage(htmlContent)
          const binaryString = atob(base64)
          const bytes = new Uint8Array(binaryString.length)
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
          }
          footerImage = await pdfDoc.embedPng(bytes)
        }

        if (footerImage) {
          const pages = pdfDoc.getPages()
          pages.forEach(page => {
            const { width } = page.getSize()
            const targetWidth = width
            const aspectRatio = footerImage.width / footerImage.height
            const targetHeight = targetWidth / aspectRatio

            page.drawImage(footerImage, {
              x: 0,
              y: 0,
              width: targetWidth,
              height: targetHeight,
            })
          })
        }
      }

      // Step 5: Save and download
      const modifiedPdfBytes = await pdfDoc.save()
      const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'documento.pdf'
      a.click()
      URL.revokeObjectURL(url)

      addToast('success', 'PDF exportado com sucesso!')
    } catch (error) {
      console.error('Erro ao exportar PDF:', error)
      addToast('error', 'Falha ao exportar PDF. Tente novamente.')
    } finally {
      setExporting(false)
    }
  }

  // Helper function to adjust color brightness
  const adjustColor = (hex, opacity) => {
    // Simple implementation - returns the hex color as is
    // In production, you might want to parse the hex and adjust it
    return hex
  }

  return (
    <>
      <a href="#preview" className="skip-link">
        Pular para preview
      </a>

      <div className="app">
        <header className="header">
          <div className="header-left">
            <h2>MD → HTML → PDF</h2>
             <div className={`rendering-indicator${rendering ? ' visible' : ''}`}>
               {rendering && (
                 <>
                   <span className="dot" />
                   Renderizando...
                 </>
               )}
             </div>
          </div>
           <div className="header-right">
             <button
               onClick={toggleTheme}
               className="theme-toggle"
               aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
             >
               {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
             </button>
             <button
               onClick={handleExportPDF}
               className="export-btn"
               aria-label="Exportar documento para PDF"
               disabled={exporting}
             >
               {exporting ? (
                 <>
                   <Loader2 size={14} className="spinner" />
                   Exportando...
                 </>
               ) : (
                 <>
                   <Download size={14} />
                   Exportar PDF
                 </>
               )}
             </button>
           </div>
        </header>

        <div className="container">
          <div className="editor-wrapper">
            <label htmlFor="markdown-editor" className="editor-label">
              Editor Markdown
            </label>
            <textarea
              id="markdown-editor"
              className="editor"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              aria-label="Editor Markdown"
            />
          </div>
          <div className="preview-wrapper">
            <div className="preview-label">Preview</div>
            <article id="preview" className="preview" aria-label="Preview do documento">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {deferredMarkdown}
              </ReactMarkdown>
            </article>
          </div>
        </div>

        {/* Color Customization Section */}
        <div className="color-section">
          <button
            className="color-toggle"
            onClick={() => setShowColorOptions(!showColorOptions)}
            aria-expanded={showColorOptions}
            aria-controls="color-options"
          >
            Cores do PDF {showColorOptions ? '▲' : '▼'}
          </button>

          {showColorOptions && (
            <div id="color-options" className="color-options">
              <div className="color-group">
                <label className="color-label">
                  Fundo
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="color-input"
                  />
                  <span className="color-value">{bgColor}</span>
                </label>
              </div>
              <div className="color-group">
                <label className="color-label">
                  Texto
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="color-input"
                  />
                  <span className="color-value">{textColor}</span>
                </label>
              </div>
              <button
                className="color-reset"
                onClick={() => {
                  setBgColor('#ffffff')
                  setTextColor('#1e293b')
                }}
              >
                Resetar para padrão
              </button>
            </div>
          )}
        </div>

        {/* Upload Section for Header/Footer */}
        <div className="upload-section">
          <div className="upload-group">
            <label className="upload-label">Header (opcional)</label>
            <div className="upload-controls">
              <label className="upload-btn">
                <Upload size={14} />
                <span>{headerFile ? headerFile.name : 'Enviar imagem ou HTML'}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,text/html"
                  onChange={handleHeaderUpload}
                  style={{ display: 'none' }}
                />
              </label>
              {headerPreview && headerFile?.type.includes('image') && (
                <img src={headerPreview} alt="Header preview" className="upload-preview" />
              )}
              {headerFile && !headerFile.type.includes('image') && (
                <span className="upload-filename">{headerPreview}</span>
              )}
              {headerFile && (
                <button className="upload-remove" onClick={removeHeader} aria-label="Remover header">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="upload-group">
            <label className="upload-label">Footer (opcional)</label>
            <div className="upload-controls">
              <label className="upload-btn">
                <Upload size={14} />
                <span>{footerFile ? footerFile.name : 'Enviar imagem ou HTML'}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,text/html"
                  onChange={handleFooterUpload}
                  style={{ display: 'none' }}
                />
              </label>
              {footerPreview && footerFile?.type.includes('image') && (
                <img src={footerPreview} alt="Footer preview" className="upload-preview" />
              )}
              {footerFile && !footerFile.type.includes('image') && (
                <span className="upload-filename">{footerPreview}</span>
              )}
              {footerFile && (
                <button className="upload-remove" onClick={removeFooter} aria-label="Remover footer">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Toast toasts={toasts} removeToast={removeToast} />
    </>
  )
}

export default App
