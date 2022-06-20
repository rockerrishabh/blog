import type { GetServerSideProps, NextPage } from 'next'
import { getSession, signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Layout from '../components/Layout'
import Posts from '../components/Posts'
import { prisma } from '../../lib/prisma'
import { PostsProps } from '../../typings'
import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import ReactTimeago from 'react-timeago'
import { useEffect } from 'react'

const Home: NextPage<PostsProps> = ({ posts }) => {
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    router.reload()
  }, [router])

  return (
    <Layout className="max-w-7xl mx-auto" title="Blog App">
      <h1 className="mb-6 ml-4 mt-4">Recent Posts</h1>
      <div className="mt-4 mb-4 flex flex-col space-y-4">
        {posts.map((post) => (
          <Link key={post.slug} href={`/posts/${post.slug}`}>
            <div className="shadow-lg flex flex-col space-y-2 hover:border-red-400 cursor-pointer border group border-red-100 rounded-md p-5">
              <h2 className="group-hover:underline underline-offset-2 underline decoration-slate-700 group-hover:decoration-red-400">
                {post.title}
              </h2>
              <ReactMarkdown className="post--content">
                {post.content}
              </ReactMarkdown>
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

export default Home

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  const posts = await prisma.posts.findMany({
    where: {
      published: true,
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
