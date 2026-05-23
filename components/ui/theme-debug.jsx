'use client'

import { useEffect, useState } from 'react'
import { useTheme } from '@/components/theme-provider'

export default function ThemeDebug() {
  const { theme, setTheme } = useTheme()
  const [rootClass, setRootClass] = useState('')
  const [stored, setStored] = useState(null)

  useEffect(() => {
    const update = () => {
      setRootClass(typeof document !== 'undefined' ? document.documentElement.className : '')
      setStored(typeof window !== 'undefined' ? window.localStorage.getItem('theme') : null)
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
  }

  return (
    <div className="fixed right-3 bottom-16 z-50">
      <div className="bg-white/90 dark:bg-black/80 text-black dark:text-white shadow rounded-lg p-2 text-xs w-44">
        <div className="flex items-center justify-between mb-1">
          <strong>Theme</strong>
          <button onClick={toggle} className="ml-2 px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-900 text-xs">Toggle</button>
        </div>
        <div className="space-y-1">
          <div>ctx: <span className="font-mono">{theme}</span></div>
          <div>root: <span className="font-mono">{rootClass || '—'}</span></div>
          <div>ls: <span className="font-mono">{stored ?? '—'}</span></div>
        </div>
      </div>
    </div>
  )
}
