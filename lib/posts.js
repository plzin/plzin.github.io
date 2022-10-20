import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse/lib'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify/lib'
import rehypePrism from '@mapbox/rehype-prism'
import remarkGfm from 'remark-gfm'

// The directory where the posts are stored.
const postsDirectory = path.join(process.cwd(), 'posts')

// Regex for inline latex: $..$
// (?<!\\) means that \ can escape $ and it does not count.
let re_inline = /(?<!\\)\$(.*?)(?<!\\)\$/g

// Same idea but with $$..$$.
// The biggest difference is the 's' flag at the end
// which makes the . match newlines, so the opening $$ and closing $$
// can be on different lines.
let re_newline = /(?<!\\)\$\$(.*?)(?<!\\)\$\$/gs

// Escaped $ (\$) that will be replaced with non-escaped ones.
let dollar = /\\$/g

// MathJax conversion options. See here
// https://docs.mathjax.org/en/latest/web/typeset.html#conversion-options-1
let options = { scale: 1.1 }

// Replaces occurrences of a regex in a string with the results of an async function.
async function replaceAsync(str, regex, fn) {
    const promises = [];
    str.replace(regex, (match, ...args) => {
        const promise = fn(match, ...args);
        promises.push(promise);
    });
    const data = await Promise.all(promises);
    return str.replace(regex, () => data.shift());
}

// Replace the inline latex.
async function replace_latex_inline(mj, s) {
    return replaceAsync(s, re_inline, async (m, p, o, s, n) => {
        let html = await mj.tex2chtmlPromise(p, { ...options, display: false })
        return mj.startup.adaptor.outerHTML(html)
    })
}

// Initialize mathjax.
async function init_mathjax(macros = []) {
    let mj = await require('mathjax').init({
        loader: {
            load: ['input/tex', 'output/chtml', '[tex]/mathtools', '[tex]/configmacros'],
        },
        tex: {
            packages: { '[+]': ['mathtools', 'configmacros'] },
            macros: macros,
        },
        chtml: {
            fontURL: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2',
        },
        startup: {
            typeset: false,
        }
    })

    mj.typesetClear()
    mj.texReset()
    mj.startup.output.clearCache()
    return mj
}

// Returns the data about all posts sorted by date.
// Used by the home page to display a list of posts.
export async function getSortedPostsData() {
    // Load MathJax in case a title contains latex.
    let mj = await init_mathjax()

    // Get the file names under /posts.
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = await Promise.all(fileNames.map(async fileName => {
        // Remove ".md" from the file name to get the ID.
        const id = fileName.replace(/\.md$/, '')

        // Read the markdown file as a string.
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')

        // Use gray-matter to parse the post metadata section.
        let matterResult = matter(fileContents)
        let title = matterResult.data.title
        title = await replace_latex_inline(mj, title)
        title = title.replaceAll(dollar, '$')

        // Combine the data with the ID.
        return {
            ...matterResult.data,
            id,
            title,
        }
    }))

    const postsData = allPostsData.sort(({ date: a }, { date: b }) => {
        if (a < b) { return 1 } else if (a > b) { return -1 } else { return 0 }
    })
    const style = mj.startup.adaptor.innerHTML(mj.chtmlStylesheet())

    // Sort the posts by date.
    return {
        postsData,
        style,
    }
}

export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory)

    return fileNames.map(fileName => {
        return {
            params: {
                id: fileName.replace(/\.md$/, '')
            }
        }
    })
}

export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the front matter.
    const matterResult = matter(fileContents)

    // Put the macro list in a form that MathJax expects.
    let macros = {}
    if ('macros' in matterResult.data) {
        for (const m of matterResult.data.macros) {
            for (const a in m) {
                macros[a] = m[a]
            }
        }
    }

    let mj = await init_mathjax(macros)
    let title = await replace_latex_inline(mj, matterResult.data.title)
    let content = matterResult.content

    content = await replaceAsync(content, re_newline, async (m, p, o, s, n) => {
        let html = await mj.tex2chtmlPromise(p, { ...options, display: true })
        return mj.startup.adaptor.outerHTML(html)
    })

    content = await replace_latex_inline(mj, content)

    // Replace the escaped dollars with actual ones.
    content = content.replaceAll(dollar, '$')
    const style = mj.startup.adaptor.innerHTML(mj.chtmlStylesheet())

    // Use remark to convert the markdown into an HTML string.
    const processedContent = await unified()
        .use(remarkParse)                                   // Parse the markdown.
        .use(remarkGfm)                                     // Enables GitHub markdown extensions.
        .use(remarkRehype, { allowDangerousHtml: true })    // Turn the markdown into HTML.
        .use(rehypePrism)                                   // Syntax highlighting for code.
        .use(rehypeRaw)                                     // Needed for keeping HTML nodes in markdown.
        //.use(rehypeSanitize)                              // This removes the SVGs generated by MathJax.
        .use(rehypeStringify)                               // Turn the HTML into a string.
        .process(content)
    const contentHtml = processedContent.toString()

    // Combine the data with the ID.
    return {
        ...matterResult.data,
        id,
        title,
        contentHtml,
        style,
    }
}

