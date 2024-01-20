import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html>
            <Head>
                <link rel="icon" href="/images/favicon.ico"></link>
                <link href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css" rel="stylesheet"></link>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}