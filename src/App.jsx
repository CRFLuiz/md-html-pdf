import { useState, useEffect, useCallback } from 'react'
import { Download, Sun, Moon, Loader2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import html2pdf from 'html2pdf.js'
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

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const handleExportPDF = async () => {
    if (exporting) return
    setExporting(true)
    try {
      const element = document.getElementById('preview')
      if (!element) throw new Error('Preview element not found')

      const opt = {
        margin: 10,
        filename: 'documento.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          backgroundColor: '#ffffff',
          onclone: function(clonedDoc) {
            const preview = clonedDoc.getElementById('preview')
            if (preview) {
              // Injeta CSS para forçar cores no documento clonado
              const style = clonedDoc.createElement('style')
              style.textContent = `
                #preview {
                  background: #ffffff !important;
                  color: #1e293b !important;
                  padding: 24px !important;
                }
                #preview * {
                  background-color: transparent !important;
                  color: #1e293b !important;
                  border-color: #e2e8f0 !important;
                }
                #preview code, #preview pre {
                  background-color: #f4f3ec !important;
                }
                #preview th {
                  background-color: #f8f9fa !important;
                }
              `
              clonedDoc.head.appendChild(style)
            }
          }
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }

      await html2pdf().set(opt).from(element).save()
      addToast('success', 'PDF exportado com sucesso!')
    } catch (error) {
      addToast('error', 'Falha ao exportar PDF. Tente novamente.')
    } finally {
      setExporting(false)
    }
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
      </div>

      <Toast toasts={toasts} removeToast={removeToast} />
    </>
  )
}

export default App
