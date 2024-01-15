import Head from 'next/head'
import styles from './layout.module.scss'
import utilStyles from '../styles/utils.module.scss'
import Link from 'next/link'
import ThemeSwitcher from './theme-switcher'
import { IoLogoTwitter, IoLogoGithub } from 'react-icons/io5'

const name = 'Justus Polzin'
export const siteTitle = 'Justus Polzin\'s Blog'

export default function Layout({ children, home }) {
    return (
        <div className={styles.container}>
            <Head>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <header className={styles.header}>
                {home ? (
                    <>
                        <img
                            src="/images/profile.png"
                            className={utilStyles.borderCircle}
                            height={144}
                            width={144}
                            alt={name}
                        />
                        <h1 className={utilStyles.heading2Xl}>{name}</h1>
                        <a href="https://twitter.com/justuspolzin" target="_blank">
                            <div className={styles.socials}>
                                <IoLogoTwitter size={30} />
                                <div className={styles.socialHandle}>
                                    @justuspolzin
                                </div>
                            </div>
                        </a>
                        <a href="https://github.com/plzin" target="_blank">
                            <div className={styles.socials}>
                                <IoLogoGithub size={30} />
                                <div className={styles.socialHandle}>
                                    @plzin
                                </div>
                            </div>
                        </a>
                        <ThemeSwitcher />
                    </>
                ) : (
                    <>
                        <div>
                            <Link href="/">
                                <img
                                    src="/images/profile.png"
                                    className={utilStyles.borderCircle}
                                    height={108}
                                    width={108}
                                    alt={name}
                                />
                            </Link>
                            <h2 className={utilStyles.headingLg}>
                                <Link href="/" className={utilStyles.noDecoration}>
                                    {name}
                                </Link>
                            </h2>
                        </div>
                        <ThemeSwitcher />
                    </>
                )}
            </header>
            <main>{children}</main>
            {!home && (
                <div className={styles.backToHome}>
                    <Link href="/" className={utilStyles.noDecoration}>
                        ← Back to home
                    </Link>
                </div>
            )}
        </div>
    )
}