import { getSession, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { prisma } from '../../../../lib/prisma'
import { useEffect } from 'react'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import { PostProps } from '../../../../typings'
import ReactTimeago from 'react-timeago'
import Layout from '../../../components/Layout'
import Link from 'next/link'

function Post(post: PostProps) {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <Layout title={`${post.title}`} className="max-w-7xl mx-auto">
      <div className="mt-4 mb-6 mx-4 flex justify-between items-center">
        <h1 className="">Post</h1>
        {session && (
          <>
            {session.user.email === post.author.email && (
              <Link href={`/posts/${post.slug}/edit`}>
                <a className="py-2 px-6 bg-indigo-500 hover:bg-indigo-400 text-white rounded-md">
                  Edit
                </a>
              </Link>
            )}
          </>
        )}
      </div>
      <div className="flex flex-col p-5 border mt-5 border-red-300 rounded-md space-y-2">
        <h2 className="font-semi-bold underline-offset-2 underline decoration-red-300 text-xl">
          {post.title}
        </h2>
        <ReactMarkdown>{post.content}</ReactMarkdown>
        <div className="font-semibold justify-between flex items-center">
          <small className="pt-2">By {post.author.name}</small>
          <div className="flex flex-col">
            {session && <small>{post.author.email}</small>}
            <ReactTimeago date={post.updatedAt} />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Post

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const post = await prisma.posts.findUnique({
    where: {
      slug: String(ctx.params?.slug),
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  })
  if (!post?.slug) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    }
  }
  return {
    props: JSON.parse(JSON.stringify(post)),
  }
}
