import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import katex from 'katex';
import { bundledLanguages, getSingletonHighlighter } from 'shiki';

// The directory where the posts are stored.
const postsDirectory = path.join(process.cwd(), 'posts');

// Regex for inline latex: $..$
// (?<!\\) means that \ can escape $ and it does not count.
const reInline = /(?<!\\)\$(.*?)(?<!\\)\$/g;

// Same idea but with $$..$$.
// The biggest difference is the 's' flag at the end
// which makes the . match newlines, so the opening $$ and closing $$
// can be on different lines.
const reNewline = /(?<!\\)\$\$(.*?)(?<!\\)\$\$/gs;

// Escaped $ (\$) that will be replaced with non-escaped ones.
const dollar = /\\$/g;

// Matches
// ```js run
// expr
// ```
// which means that the result of `import(<postId>.ts).expr`
// evaluates to a string and should be substituted for the block in the markdown.
const reJsExpr = /```js run\n(.+?)\n```/g;

// Matches both code blocks and inline code.
// We're not using @shikijs/rehype because it does not support a default language
// for inline code. It also doesn't highlight code inside raw html, which are used
// by the MBA tables.
// Also, we don't use separate regex because that would hightlight inline code
// inside code blocks.
const reCode = /```([^`\n]+?)\n(.+?)\n```|`([^`\n]+?)(?:{:([^}\n]+?)})?`/gs;

// The default language for inline code.
const defaultInlineCodeLanguage = 'rust';

// Shiki options.
const shikiOptions = {
  themes: {
    light: 'github-light',
    dark: 'github-dark',
  },
  defaultColor: false,
} as const;

// Shiki highlighter.
const highlighter = await getSingletonHighlighter({
  langs: Object.keys(bundledLanguages),
  themes: Object.values(shikiOptions.themes),
});

// KaTeX options.
const defaultKatexOptions = {
  output: 'html',
} as const;

// Replace the inline latex.
function replaceLatexInline(s: string, macros: Record<string, string> = {}) {
  return s.replaceAll(reInline, (m, p) => {
    return katex.renderToString(p, { ...defaultKatexOptions, macros });
  });
}

interface PostData {
  /** The ID of the post which is the file stem, i.e. the file name without the .md extension. */
  id: string;

  /** The title of the post. Which may contain tex. */
  title: string;

  /** The date of the post. */
  date: string;

  /** The summary of the post for RSS */
  summary: string;

  /** The title of the post without any tex. */
  plainTitle: string;

  /** The stem of the .ts file that contains needed javascript. */
  jsStem?: string;
}

type Post = PostData & {
  contentHtml: string;
};

// Sorts the posts from latest to oldest.
// The objects need to have a date and title field.
export function sortPosts<T extends PostData>(posts: T[]): T[] {
  return posts.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else if (a.date > b.date) {
      return -1;
    } else if (a.title < b.title) {
      return 1;
    } else if (a.title > b.title) {
      return -1;
    } else {
      return 0;
    }
  });
}

function parseFrontMatter(id: string, data: matter.GrayMatterFile<string>['data']): PostData {
  const date = data.date;
  if (typeof date !== 'string') {
    throw new Error('Date is not a string');
  }

  let title = data.title;
  if (typeof title !== 'string') {
    throw new Error('Title is not a string');
  }
  title = replaceLatexInline(title);
  title = title.replaceAll(dollar, '$');

  const summary = data.summary;
  if (typeof summary !== 'string') {
    throw new Error('Summary is not a string');
  }

  const plainTitle = data.plainTitle;
  if (typeof plainTitle !== 'undefined' && typeof plainTitle !== 'string') {
    throw new Error('Plain title is not a string');
  }

  if (typeof data.jsStem !== 'undefined' && typeof data.jsStem !== 'string') {
    throw new Error('JS stem is not a string');
  }

  return {
    id,
    date,
    title,
    summary,
    plainTitle: plainTitle ?? title,
    jsStem: data.jsStem,
  };
}


// Returns the data about all posts sorted by date.
// Used by the home page to display a list of posts.
export async function getSortedHeaderData(): Promise<PostData[]> {
  // Get the file names under /posts.
  const postIds = getAllPostIds();
  const allPostsData = await Promise.all(postIds.map(async id => {
    // Read the markdown file as a string.
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section.
    const matterResult = matter(fileContents);
    return parseFrontMatter(id, matterResult.data);
  }));

  // Sort the posts by date.
  const postsData = sortPosts(allPostsData);

  return postsData;
}

export function getAllPostIds(): string[] {
  const ids = [];
  for (const file of fs.readdirSync(postsDirectory)) {
    if (file.endsWith('.md')) {
      ids.push(file.slice(0, -'.md'.length));
    }
  }
  return ids;
}

export async function getPostData(id: string): Promise<Post> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the front matter.
  const matterResult = matter(fileContents);

  const data = matterResult.data;
  const postData = parseFrontMatter(id, data);

  // Put the macro list in a form that KaTeX expects.
  const macros: Record<string, string> = {};
  if ('macros' in data) {
    for (const m of data.macros) {
      for (const a in m) {
        macros[`\\${a}`] = m[a];
      }
    }
  }

  let content = matterResult.content;

  content = content.replaceAll(reNewline, (m, p) => {
    return katex.renderToString(p, { ...defaultKatexOptions, displayMode: true, macros });
  });
  content = replaceLatexInline(content, macros);

  // Replace the escaped dollars with actual ones.
  content = content.replaceAll(dollar, '$');

  const jsStem = postData.jsStem ?? id;

  if (fs.existsSync(path.join(postsDirectory, `${jsStem}.ts`))) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const js = await import(`../../posts/${jsStem}.ts`);
    content = content.replaceAll(reJsExpr, (m, p) => {
      return eval(`js.${p}`);
    });
  } else {
    const matches = Array.from(content.matchAll(reJsExpr));
    if (matches.length > 0) {
      throw Error(`${id}.ts not found but there are js constants in the markdown: ${matches.map(m => `"${m[1]}"`).join(', ')}`);
    }
  }

  content = content.replaceAll(reCode, (m, blockLang, blockCode, inlineCode, inlineLang) => {
    // Decide if this is a code block or inline code.
    if (blockLang) {
      if (!blockCode) {
        throw new Error('Code block without code');
      }

      return highlighter.codeToHtml(blockCode, {
        ...shikiOptions,
        lang: blockLang ?? defaultInlineCodeLanguage,
      });
    }

    if (!inlineCode) {
      throw new Error('Inline code without code');
    }

    const html = highlighter.codeToHtml(inlineCode, {
      ...shikiOptions,
      lang: inlineLang ?? defaultInlineCodeLanguage,
      structure: 'inline',
    });

    return `<code class="shiki${inlineCode.length <= 30 ? ' whitespace-nowrap' : ''}">${html}</code>`;
  });

  // Use remark to convert the markdown into an HTML string.
  const processedContent = await unified()
    // Parse the markdown.
    .use(remarkParse)
    // Enables GitHub markdown extensions.
    .use(remarkGfm)
    // Turn the markdown into HTML.
    .use(remarkRehype, { allowDangerousHtml: true })
    // Needed for keeping HTML nodes in markdown.
    .use(rehypeRaw)
    // Turn the HTML into a string.
    .use(rehypeStringify)
    .process(content);
  const contentHtml = processedContent.toString();

  // Combine the data with the ID.
  return {
    ...postData,
    contentHtml,
  };
}

export async function getSortedPosts(): Promise<Post[]> {
  const ids = getAllPostIds();
  const posts = await Promise.all(ids.map(id => getPostData(id)));

  return sortPosts(posts);
}