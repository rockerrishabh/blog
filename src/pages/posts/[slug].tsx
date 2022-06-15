import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { prisma } from '../../../lib/prisma'
import { useEffect } from 'react'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import { PostProps } from '../../../typings'
import ReactTimeago from 'react-timeago'
import Layout from '../../components/Layout'

function Post(post: PostProps) {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <Layout title={`${post.title}`} className="col-span-7 p-5">
      <div className="flex flex-col space-y-2">
        <h2>{post.title}</h2>
        <ReactMarkdown>{post.content}</ReactMarkdown>
        <small>{post.author.name}</small>
        <small>{post.author.email}</small>
        <p>
          Created at: <ReactTimeago date={post.createdAt} />
        </p>
        <p>
          Updated at: <ReactTimeago date={post.updatedAt} />
        </p>
        <p>{post.published}</p>
      </div>
    </Layout>
  )
}

export default Post

export const getServerSideProps: GetServerSideProps = async (context) => {
  const post = await prisma.posts.findUnique({
    where: {
      slug: String(context.params?.slug),
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
  } else
    return {
      props: JSON.parse(JSON.stringify(post)),
    }
}
