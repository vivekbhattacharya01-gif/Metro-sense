'use client'

import * as React from 'react'
import { createContext, useContext, useEffect, useState, useRef } from 'react'

const ThemeContext = createContext({
  theme: 'system',
  setTheme: () => {}
})

function getSystemTheme() {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  enableSystem = true,
  attribute = 'class',
  disableTransitionOnChange = true,
}) {
  const [theme, setThemeState] = useState(defaultTheme)
  const mediaRef = useRef(null)

  // apply theme to document (supports attribute='class' or attribute='data-theme')
  const applyTheme = (value) => {
    if (typeof document === 'undefined') return

    const root = document.documentElement

    // temporarily disable transitions to avoid flash
    if (disableTransitionOnChange) {
      root.classList.add('disable-theme-transition')
      // remove after next paint
      requestAnimationFrame(() => requestAnimationFrame(() => {
        root.classList.remove('disable-theme-transition')
      }))
    }

    const resolved = value === 'system' ? getSystemTheme() : value

    if (attribute === 'class') {
      root.classList.remove('light', 'dark')
      root.classList.add(resolved)
    } else {
      root.setAttribute(attribute, resolved)
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    const stored = window.localStorage.getItem('theme')
    if (stored) {
      setThemeState(stored)
      applyTheme(stored)
    } else if (enableSystem) {
      setThemeState('system')
      applyTheme('system')
    } else {
      const sys = getSystemTheme()
      setThemeState(sys)
      applyTheme(sys)
    }

    if (enableSystem) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = () => {
        // only respond when using system theme
        if (theme === 'system') applyTheme('system')
      }
      // store ref for cleanup
      mediaRef.current = handler
      mq.addEventListener?.('change', handler)
      mq.addListener?.(handler)
      return () => {
        mq.removeEventListener?.('change', handler)
        mq.removeListener?.(handler)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setTheme = (value) => {
    setThemeState(value)
    if (typeof window !== 'undefined') window.localStorage.setItem('theme', value)
    applyTheme(value)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
