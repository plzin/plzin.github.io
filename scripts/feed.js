import fs from 'fs'
import { Feed } from 'feed'
import { getSortedHeaderData } from '../lib/posts.js'

async function generateFeed() {
    console.log('Generating feed.')
    const feed = new Feed({
        title: 'Justus Polzin\'s Blog',
        description: 'Blog about computers, numbers, and sometimes other things',
        id: 'https://plzin.github.io/',
        link: 'https://plzin.github.io/',
        image: 'https://plzin.github.io/images/profile.png',
        favicon: 'https://plzin.github.io/images/favicon.ico',
        updated: new Date(),
        author: {
            name: 'Justus Polzin',
            link: 'https://plzin.github.io/'
        }
    })

    const posts = await (await getSortedHeaderData()).postsData
    posts.forEach((post) => {
        const url = `https://plzin.github.io/posts/${post.id}`
        feed.addItem({
            title: post.plain_title ?? post.title,
            id: url,
            link: url,
            date: new Date(post.date),
            description: post.summary,
        })
    })

    fs.mkdirSync('./public/feed/', { recursive: true })
    fs.writeFileSync('./public/feed/rss.xml', feed.rss2())
    fs.writeFileSync('./public/feed/atom.xml', feed.atom1())
}

generateFeed()