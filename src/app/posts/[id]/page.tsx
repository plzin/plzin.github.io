import { getAllPostIds, getPostData } from '@/lib/posts';
import { Date } from '@/ui/date';
import Link from 'next/link';
import './markdown.css';

type Params = { params: Promise<{ id: string; }> };

export async function generateStaticParams() {
  const posts = await getAllPostIds();
  return posts.map(id => ({ id }));
}

export async function generateMetadata({ params }: Params) {
  const { id } = await params;
  const post = await getPostData(id);
  return {
    title: post.plainTitle,
  };
}

export default async function Post({ params }: Params) {
  const { id } = await params;
  const post = await getPostData(id);
  return (
    <>
      <header>
        <div className="flex flex-col items-center justify-center">
          <Link href="/">
            <img
              src="/images/profile.png"
              className="rounded-full"
              height={108}
              width={108}
              alt=""
            />
          </Link>
          <h2 className="py-6 text-2xl font-bold tracking-tight leading-[1.2]">
            <Link href="/" className="no-underline hover:underline">
              Justus Polzin
            </Link>
          </h2>
        </div>
      </header>
      <main>
        <article>
          <h1 className="text-2xl font-bold" dangerouslySetInnerHTML={{ __html: post.title }} />
          <Date date={post.date} />
          <div className="pt-4 prose" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        </article>
      </main>
      <footer className="my-6">
        <Link href="/" className="no-underline hover:underline">
            ← Back to home
        </Link>
      </footer>
    </>
  );
}