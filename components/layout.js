import Head from 'next/head'
import styles from './layout.module.scss'
import utilStyles from '../styles/utils.module.scss'
import Link from 'next/link'
import ThemeSwitcher from './theme-switcher'
import { IoLogoTwitter, IoLogoGithub, IoLogoRss } from 'react-icons/io5'

const name = 'Justus Polzin'
export const siteTitle = 'Justus Polzin\'s Blog'

export default function Layout({ children, home }) {
    return (
        <div className={styles.container}>
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
                        <a className={styles.socials} href="https://twitter.com/justuspolzin" target="_blank">
                            <IoLogoTwitter size={30} />
                            <div className={styles.socialHandle}>
                                @justuspolzin
                            </div>
                        </a>
                        <a className={styles.socials} href="https://github.com/plzin" target="_blank">
                            <IoLogoGithub size={30} />
                            <div className={styles.socialHandle}>
                                @plzin
                            </div>
                        </a>
                        <div className={styles.socials}>
                            <IoLogoRss size={25} />
                            <a href="/feed/rss.xml" className={styles.socialHandle}>
                                rss
                            </a>
                            <a href="/feed/atom.xml" className={styles.socialHandle}>
                                atom
                            </a>
                        </div>
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