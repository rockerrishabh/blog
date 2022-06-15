import type { GetServerSideProps, NextPage } from 'next'
import { getSession, signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Layout from '../components/Layout'
import Posts from '../components/Posts'
import { prisma } from '../../lib/prisma'
import { PostsProps } from '../../typings'
import { useRouter } from 'next/router'
import Link from 'next/link'

const Home: NextPage<PostsProps> = ({ posts }) => {
  const router = useRouter()
  const { data: session } = useSession()
  return (
    <Layout title="Blog App">
      <div>
        {session ? (
          <div>
            <h1>{session.user.name}</h1>
            <h3>{session.user.email}</h3>
            <h2>{session.user.role}</h2>
            <h1>{session.user.id}</h1>
            <Image
              className="rounded-full"
              src={session.user.image as string}
              alt={session.user.name}
              height="40px"
              width="40px"
            />
            <button
              onClick={() => {
                signOut()
              }}
            >
              Sign Out
            </button>
            <p>fjjjjjjjjjjjjjjjjvyryyyyyyyyyyyyyyyyyyyyyyyyyyy</p>
          </div>
        ) : (
          <div className="p-5">
            {posts.map((posts) => (
              <div key={posts.id}>
                <Posts
                  href={`/posts/${posts.id}`}
                  title={posts.title}
                  content={posts.content}
                  createdAt={posts.createdAt}
                  updatedAt={posts.updatedAt}
                  published={posts.published}
                  authorEmail={posts.author.email}
                  authorName={posts.author.name}
                />
              </div>
            ))}
            <button
              onClick={() => {
                signIn('google')
              }}
            >
              Sign In
            </button>
          </div>
        )}
        <h1></h1>
      </div>
    </Layout>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
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
  return JSON.parse(JSON.stringify({ props: { posts } }))
}
