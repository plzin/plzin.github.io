import '../styles/global.scss'
import { ThemeProvider } from 'next-themes'

export default function App({ Component, pageProps }) {
    return (
        <ThemeProvider themes={['light', 'dark', 'crimson']}>
            <Component {...pageProps} />
        </ThemeProvider>
    )
}