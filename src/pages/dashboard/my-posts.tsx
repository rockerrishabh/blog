import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import ReactTimeago from 'react-timeago'
import { prisma } from '../../../lib/prisma'
import { PostsProps } from '../../../typings'
import Layout from '../../components/Layout'
import parse from 'html-react-parser'

function MyPosts({ posts }: PostsProps) {
  const { data: session } = useSession()
  const router = useRouter()
  useEffect(() => void router.prefetch('/dashboard/posts'), [router])
  return (
    <Layout title="My Posts" className="max-w-7xl mx-auto">
      <div className="flex mt-4 items-center justify-between">
        <div>My Posts</div>
        <Link href="/dashboard/create">
          <a className="px-4 py-2 bg-green-500 hover:bg-green-400 rounded-md text-white">
            Create
          </a>
        </Link>
      </div>
      <div className="mt-4 flex flex-col mb-4 space-y-4">
        {posts.map((post) => (
          <Link key={post.slug} href={`/post/${post.slug}`}>
            <div className="shadow-lg flex flex-col space-y-2 hover:border-red-400 cursor-pointer border group border-red-100 rounded-md p-5">
              <h2 className="group-hover:underline underline-offset-2 underline decoration-slate-700 group-hover:decoration-red-400">
                {post.title}
              </h2>
              <div className="post--content">{parse(post.content)}</div>
              <div className="flex font-semibold pt-2 items-center justify-between">
                <small className="">By {post.author.name}</small>
                <small>
                  <ReactTimeago date={post.updatedAt} />
                </small>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  )
}

export default MyPosts

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  if (!session) {
    context.res.writeHead(302, { Location: '/' })
    context.res.end()
  }
  const posts = await prisma.posts.findMany({
    where: {
      author: {
        email: session?.user.email,
      },
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })
  return JSON.parse(
    JSON.stringify({
      props: { session: session, posts },
    })
  )
}
