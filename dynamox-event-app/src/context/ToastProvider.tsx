'use client'

import { createContext, useContext, useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

type ToastSeverity = 'success' | 'error' | 'info' | 'warning'

interface ToastContextType {
  showToast: (message: string, severity?: ToastSeverity) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {

  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [severity, setSeverity] = useState<ToastSeverity>('success')

  const showToast = (msg: string, sev: ToastSeverity = 'success') => {
    setMessage(msg)
    setSeverity(sev)
    setOpen(true)
  }

  const handleClose = () => setOpen(false)

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={severity} onClose={handleClose} variant="filled">
          {message}
        </Alert>
      </Snackbar>

    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider")
  }

  return context
}