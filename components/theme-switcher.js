import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { HiSun, HiMoon } from 'react-icons/hi'
import { WiMoonAltWaningCrescent5 } from 'react-icons/wi'
import styles from './theme-switcher.module.scss'

export default function ThemeSwitcher() {
    // Avoid hydration mismatch.
    const [mounted, setMounted] = useState(false)
    const { resolvedTheme, setTheme } = useTheme();

    useEffect(() => setMounted(true), [])

    if (!mounted) return null

    switch (resolvedTheme) {
        case 'light':
            return (
                <HiMoon className={styles.switcher} role="button" onClick={() => setTheme('dark')} />
            )
        case 'dark':
            return (
                <WiMoonAltWaningCrescent5 className={styles.switcher} role="button" onClick={() => setTheme('crimson')} />
            )
        case 'crimson':
            return (
                <HiSun className={styles.switcher} role="button" onClick={() => setTheme('light')} />
            )
    }
}