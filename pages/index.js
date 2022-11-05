import Head from 'next/head'
import Link from 'next/link'
import Layout, { siteTitle } from '../components/layout'
import Date from '../components/date'
import utilStyles from '../styles/utils.module.scss'
import { getSortedPostsData } from '../lib/posts'

export default function Home({ postsData, style }) {
    return (
        <Layout home>
            <Head>
                <title>{siteTitle}</title>
                <style dangerouslySetInnerHTML={{ __html: style }}></style>
            </Head>
            <section className={utilStyles.headingMd}>
                <p>Blog about computers, numbers and solarpunk.</p>
            </section>
            <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
                <h2 className={`${utilStyles.headingLg}`}>Blog</h2>
                <ul className={utilStyles.list}>
                    {postsData.map(({ id, date, title }) => (
                        <li className={utilStyles.listItem} key={id}>
                            <Link href={`/posts/${id}`} dangerouslySetInnerHTML={{ __html: title }}></Link>
                            <br />
                            <small className={utilStyles.lightText}>
                                <Date dateString={date} />
                            </small>
                        </li>
                    ))}
                </ul>
            </section>
        </Layout>
    )
}

export async function getStaticProps() {
    const data = await getSortedPostsData()
    return {
        props: {
            postsData: data.postsData,
            style: data.style,
        }
    }
}