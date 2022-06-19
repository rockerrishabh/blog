import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Layout from '../../components/Layout'
import { prisma } from '../../../lib/prisma'
import { PostsProps } from '../../../typings'
import Link from 'next/link'

function Dashboard({ posts }: PostsProps) {
  return (
    <Layout className="max-w-7xl mx-auto" title="Dashboard">
      <div className="mt-4">
        <Link href="/dashboard/my-posts">
          <a>My Posts</a>
        </Link>
      </div>
    </Layout>
  )
}

export default Dashboard

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  if (!session) {
    context.res.writeHead(302, { Location: '/' })
    context.res.end()
  }
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
