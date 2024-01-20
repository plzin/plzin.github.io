import Head from 'next/head'
import Link from 'next/link'
import Layout, { siteTitle } from '../components/layout'
import Date from '../components/date'
import utilStyles from '../styles/utils.module.scss'
import { getSortedHeaderData } from '../lib/posts'

export default function Home({ postsData }) {
    return (
        <Layout home>
            <Head>
                <title>{siteTitle}</title>
            </Head>
            <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
                <h2 className={utilStyles.headingLg}>Posts</h2>
                <ul className={utilStyles.list}>
                    {postsData.map(({ id, date, title }) => (
                        <li className={utilStyles.listItem} key={id}>
                            <Link href={`/posts/${id}`} className={utilStyles.noDecoration} dangerouslySetInnerHTML={{ __html: title }}></Link>
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
    const data = await getSortedHeaderData()
    return {
        props: {
            postsData: data.postsData,
        }
    }
}