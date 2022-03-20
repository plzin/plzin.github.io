import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { SunIcon, MoonIcon } from '@heroicons/react/solid'
import styles from './theme-switcher.module.scss'

export default function ThemeSwitcher() {
    // Avoid hydration mismatch.
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme();

    useEffect(() => setMounted(true), [])

    if (!mounted) return null

    if (theme === "dark") {
        return (
            <SunIcon className={styles.switcher} role="button" onClick={() => setTheme('light')} />
        )
    } else {
        return (
            <MoonIcon className={styles.switcher} role="button" onClick={() => setTheme('dark')} />
        )
    }
}