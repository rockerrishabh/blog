import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/react'
import Layout from '../../components/Layout'
import { prisma } from '../../../lib/prisma'
import { PostsProps } from '../../../typings'
import Link from 'next/link'

function Dashboard({ posts }: PostsProps) {
  const { data: session } = useSession()
  return (
    <Layout className="max-w-7xl mx-auto" title="Dashboard">
      <div className="mt-4 flex flex-col space-y-3">
        <Link href="/dashboard/my-posts">
          <a>My Posts</a>
        </Link>
        {session?.user.role === 'Admin' && (
          <Link href="/dashboard/all-users">
            <a>All Users</a>
          </Link>
        )}
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
