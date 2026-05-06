'use client'

import * as React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext({
  theme: 'system',
  setTheme: () => {}
})

const getPreferredTheme = () => {
  if (typeof window === 'undefined') return 'light'

  const stored = window.localStorage.getItem('theme')
  if (stored) return stored

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const applyThemeClass = (theme) => {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  root.classList.remove('light', 'dark')

  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    root.classList.add(systemTheme)
  } else {
    root.classList.add(theme)
  }
}

export function ThemeProvider({ children, defaultTheme = 'system', enableSystem = true }) {
  const [theme, setThemeState] = useState(defaultTheme)

  useEffect(() => {
    const initialTheme = getPreferredTheme()
    setThemeState(initialTheme === 'dark' || initialTheme === 'light' ? initialTheme : defaultTheme)
    applyThemeClass(initialTheme)

    if (enableSystem) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => {
        if (theme === 'system') {
          applyThemeClass('system')
        }
      }
      mediaQuery.addEventListener?.('change', handleChange)
      mediaQuery.addListener?.(handleChange)
      return () => {
        mediaQuery.removeEventListener?.('change', handleChange)
        mediaQuery.removeListener?.(handleChange)
      }
    }
  }, [])

  const setTheme = (value) => {
    setThemeState(value)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', value)
    }
    applyThemeClass(value)
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
