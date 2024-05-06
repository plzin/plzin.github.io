import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import rehypePrism from '@mapbox/rehype-prism'
import remarkGfm from 'remark-gfm'
import katex from 'katex'

// The directory where the posts are stored.
const postsDirectory = path.join(process.cwd(), 'posts')

// Regex for inline latex: $..$
// (?<!\\) means that \ can escape $ and it does not count.
const re_inline = /(?<!\\)\$(.*?)(?<!\\)\$/g

// Same idea but with $$..$$.
// The biggest difference is the 's' flag at the end
// which makes the . match newlines, so the opening $$ and closing $$
// can be on different lines.
const re_newline = /(?<!\\)\$\$(.*?)(?<!\\)\$\$/gs

// Escaped $ (\$) that will be replaced with non-escaped ones.
const dollar = /\\$/g

// KaTeX options.
const options = {
    output: 'html'
}

// Replace the inline latex.
function replace_latex_inline(s, macros = {}) {
    return s.replaceAll(re_inline, (m, p) => {
        return katex.renderToString(p, { ...options, macros })
    })
}

// Sorts the posts from latest to oldest.
// The objects need to have a date and title field.
export function sortPosts(posts) {
    return posts.sort(({ date: a, title: c }, { date: b, title: d }) => {
        if (a < b) {
            return 1
        } else if (a > b) {
            return -1
        } else if (c < d) {
            return 1
        } else if (c > d) {
            return -1
        } else {
            0
        }
    })
}

// Returns the data about all posts sorted by date.
// Used by the home page to display a list of posts.
export async function getSortedHeaderData() {
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
        title = replace_latex_inline(title)
        title = title.replaceAll(dollar, '$')

        // Combine the data with the ID.
        return {
            ...matterResult.data,
            id,
            title,
        }
    }))

    // Sort the posts by date.
    const postsData = sortPosts(allPostsData)

    return {
        postsData,
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

    // Put the macro list in a form that KaTeX expects.
    let macros = {}
    if ('macros' in matterResult.data) {
        for (const m of matterResult.data.macros) {
            for (const a in m) {
                macros["\\" + a] = m[a]
            }
        }
    }

    const title = replace_latex_inline(matterResult.data.title)
    let content = matterResult.content

    content = content.replaceAll(re_newline, (m, p) => {
        return katex.renderToString(p, { ...options, displayMode: true, macros })
    })
    content = replace_latex_inline(content, macros)

    // Replace the escaped dollars with actual ones.
    content = content.replaceAll(dollar, '$')

    // Use remark to convert the markdown into an HTML string.
    const processedContent = await unified()
        .use(remarkParse)                                   // Parse the markdown.
        .use(remarkGfm)                                     // Enables GitHub markdown extensions.
        .use(remarkRehype, { allowDangerousHtml: true })    // Turn the markdown into HTML.
        .use(rehypePrism)                                   // Syntax highlighting for code.
        .use(rehypeRaw)                                     // Needed for keeping HTML nodes in markdown.
        .use(rehypeStringify)                               // Turn the HTML into a string.
        .process(content)
    const contentHtml = processedContent.toString()

    // Combine the data with the ID.
    return {
        ...matterResult.data,
        id,
        title,
        contentHtml,
    }
}

export async function getSortedPosts() {
    const ids = getAllPostIds()
    const posts = await Promise.all(ids.map(async (id) => {
        return await getPostData(id.params.id)
    }))

    return sortPosts(posts)
}