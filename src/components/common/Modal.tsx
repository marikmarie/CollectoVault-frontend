import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

type ModalProps = {
  open: boolean
  onClose: () => void
  title?: string
  children?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}


const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, size = 'md' }) => {
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return

    // lock scroll
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // save focused element
    previouslyFocused.current = document.activeElement as HTMLElement | null

    // focus the modal content (or first focusable)
    const focusable = getFocusable(contentRef.current)
    if (focusable.length) {
      (focusable[0] as HTMLElement).focus()
    } else if (contentRef.current) {
      contentRef.current.focus()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      } else if (e.key === 'Tab') {
        // focus trap
        const nodes = getFocusable(contentRef.current)
        if (nodes.length === 0) {
          e.preventDefault()
          return
        }
        const first = nodes[0] as HTMLElement
        const last = nodes[nodes.length - 1] as HTMLElement
        const active = document.activeElement as HTMLElement | null

        if (!e.shiftKey && active === last) {
          e.preventDefault()
          first.focus()
        } else if (e.shiftKey && active === first) {
          e.preventDefault()
          last.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      // restore scroll
      document.body.style.overflow = prevOverflow
      
      try {
        previouslyFocused.current?.focus()
      } catch {
        
      }
    }
  }, [open, onClose])

  if (typeof document === 'undefined') return null

  return ReactDOM.createPortal(
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-hidden={!open}
        >
          
          <motion.div
            ref={overlayRef}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => {
              // only close when clicking the backdrop itself (not clicking children)
              if (e.target === overlayRef.current) onClose()
            }}
          />

          
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            tabIndex={-1}
            ref={contentRef}
            className={`relative z-10 w-full mx-4 outline-none ${size === 'sm' ? 'max-w-xl' : size === 'lg' ? 'max-w-3xl' : 'max-w-2xl'}`}
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.995 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  {title && (
                    <h3 id="modal-title" className="text-lg text-white font-semibold">
                      {title}
                    </h3>
                  )}
                </div>

                <button
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="ml-2 rounded-md p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="mt-4 text-slate-300">{children}</div>

              <div className="mt-6 flex justify-end gap-3" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}


function getFocusable(root: HTMLElement | null): HTMLElement[] {
  if (!root) return []
  const selector = [
    'a[href]',
    'area[href]',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    'iframe',
    'object',
    'embed',
    '[contenteditable]',
    '[tabindex]:not([tabindex^="-"])'
  ].join(',')
  const nodes = Array.from(root.querySelectorAll<HTMLElement>(selector))
  // filter out elements that are not visible
  return nodes.filter((n) => !!(n.offsetWidth || n.offsetHeight || n.getClientRects().length))
}

export default Modal
