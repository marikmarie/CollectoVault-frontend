import React from 'react'
import { motion } from 'framer-motion'

const Modal: React.FC<{open: boolean, onClose: ()=>void, title?: string, children?: React.ReactNode}> = ({ open, onClose, title, children }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
      <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="relative z-10 w-full max-w-lg mx-4">
        <div className="bg-surface rounded-2xl p-6 shadow-lg">
          {title && <h3 className="text-lg text-white font-semibold mb-2">{title}</h3>}
          <div>{children}</div>
          <div className="mt-4 flex justify-end">
            <button onClick={onClose} className="px-4 py-2 bg-primary text-white rounded">Close</button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Modal
