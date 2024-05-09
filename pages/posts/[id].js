import Head from 'next/head'
import Layout from '../../components/layout'
import Date from '../../components/date'
import { getAllPostIds, getPostData } from '../../lib/posts'
import utilStyles from '../../styles/utils.module.scss'
import rough from 'roughjs'

export default function Post({ postData }) {
    if (postData.id == 'zero-polys-mod-n') {
        const max = 5;
        const generator = rough.generator()
        function append(svg, drawable) {
            for (let p of generator.toPaths(drawable)) {
                svg.str += `<path d="${p.d}" stroke="${p.stroke}" stroke-width="${p.strokeWidth}" fill="${p.fill ?? 'none'}"></path>`
            }
        }
        function cross(svg, i, j, color) {
            const x = 60 + i * 80
            const y = 440 - j * 80
            const opts = {
                stroke: color,
                strokeWidth: 2,
            }
            append(svg, generator.line(x - 10, y - 10, x + 10, y + 10, opts))
            append(svg, generator.line(x - 10, y + 10, x + 10, y - 10, opts))
        }
        function draw_diagram(clr_fn) {
            console.log('Draw diagram')
            let svg = new Object()
            svg.str = '<svg viewBox="0 0 500 500" style="display:block;margin:auto;width:500px;max-width:100%">'
            const opts = {
                stroke: 'var(--foreground)',
                strokeWidth: 2,
            }
            append(svg, generator.line(10, 490, 450, 490, opts))
            append(svg, generator.line(10, 490, 10, 50, opts))
            append(svg, generator.line(0, 60, 10, 50, opts))
            append(svg, generator.line(10, 50, 20, 60, opts))
            append(svg, generator.line(440, 480, 450, 490, opts))
            append(svg, generator.line(450, 490, 440, 500, opts))
            for (let x = 0; x < max; x += 1) {
                for (let y = 0; y < max; y += 1) {
                    cross(svg, x, y, clr_fn(x, y))
                }
            }
            svg.str += '</svg>'
            return svg.str
        }

        const svg1 = draw_diagram((x, y) => {
            const a = 2
            const b = 2
            if (x == a && y == b) {
                return 'gold'
            } else if (x <= a && y <= b) {
                return 'red'
            } else {
                return 'blue'
            }
        })

        const svg2 = draw_diagram((x, y) => {
            const k = 3
            const sum = x + y
            if (sum < k) {
                return 'red'
            } else if (sum == k) {
                return 'gold'
            } else {
                return 'blue'
            }
        })

        postData.contentHtml = postData.contentHtml.replace('SVG1', svg1)
        postData.contentHtml = postData.contentHtml.replace('SVG2', svg2)
    }

    return (
        <Layout>
            <Head>
                <title>{postData.plain_title ?? postData.title}</title>
            </Head>
            <article>
                <h1 className={utilStyles.headingXl} dangerouslySetInnerHTML={{ __html: postData.title }} />
                <div className={utilStyles.lightText}>
                    <Date dateString={postData.date} />
                </div>
                <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
            </article>
        </Layout>
    )
}

export async function getStaticPaths() {
    const paths = getAllPostIds()
    return {
        paths,
        fallback: false,
    }
}

export async function getStaticProps({ params }) {
    const postData = await getPostData(params.id)
    return {
        props: {
            postData
        }
    }
}