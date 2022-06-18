import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '../../../../lib/prisma'
import { PostProps } from '../../../../typings'
import Layout from '../../../components/Layout'

function Edit(post: PostProps) {
  return (
    <Layout className="max-w-7xl mx-auto" title={`${post.title} - Edit`}>
      <div></div>
    </Layout>
  )
}

export default Edit

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const post = await prisma.posts.findUnique({
    where: {
      slug: String(ctx.params?.slug),
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
  return { props: JSON.parse(JSON.stringify(post)) }
}
