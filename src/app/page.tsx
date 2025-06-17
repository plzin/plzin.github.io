import { getSortedHeaderData } from '@/lib/posts';
import Link from 'next/link';
import { IoLogoGithub, IoLogoRss, IoLogoTwitter } from 'react-icons/io5';
import { Date } from '@/ui/date';

export default async function Home() {
  const postData = await getSortedHeaderData();

  return (
    <>
      <header className="flex flex-col items-center justify-center">
        <img
          src="/images/profile.png"
          className="rounded-full"
          height={144}
          width={144}
          alt=""
        />
        <h1 className="py-4 text-3xl font-bold -tracking-[0.05rem] leading-[1.2]">Justus Polzin</h1>
        <a href="https://twitter.com/justuspolzin" target="_blank" className="flex items-center">
          <IoLogoTwitter size={30} />
          <div className="pl-2 dashed-link">
            @justuspolzin
          </div>
        </a>
        <a href="https://github.com/plzin" target="_blank" className="flex items-center">
          <IoLogoGithub size={30} />
          <div className="pl-2 dashed-link">
            @plzin
          </div>
        </a>
        <div className="flex items-center">
          <IoLogoRss size={25} />
          <a href="/feed/rss.xml" className="pl-2 dashed-link">
            rss
          </a>
          <a href="/feed/atom.xml" className="pl-2 dashed-link">
            atom
          </a>
        </div>
      </header>
      <main className="mb-8">
        <ul className="list-none">
          {postData.map(({ id, date, title }) => (
            <li key={id} className="mt-4">
              <Link href={`/posts/${id}`} dangerouslySetInnerHTML={{ __html: title }} className="no-underline hover:underline text-xl" />
              <div>
                <Date date={date} />
              </div>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}