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
import toast from 'react-hot-toast'

function Post(post: PostProps) {
  const { data: session } = useSession()
  const router = useRouter()
  useEffect(() => {
    router.reload()
  }, [router])

  const publishPost = async (id: string): Promise<void> => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/publish/${id}`, {
      method: 'PUT',
    })
    await router.push(`/posts/${post.slug}`)
  }

  const unPublishPost = async (id: string): Promise<void> => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/unpublish/${id}`, {
      method: 'PUT',
    })
    await router.push(`/posts/${post.slug}`)
  }

  const deletePost = async (id: string): Promise<void> => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
      method: 'DELETE',
    })
    await router.push('/dashboard/my-posts')
  }

  return (
    <Layout title={`${post.title}`} className="max-w-7xl mx-auto">
      <div className="mt-4 mb-6 mx-4 flex justify-between items-center">
        <h1 className="">Post</h1>
        {session && (
          <>
            {session.user.email === post.author.email && (
              <div className="flex space-x-4 items-center">
                <button
                  onClick={() => {
                    toast.promise(deletePost(post.id), {
                      loading: 'Deleting...',
                      success: <b>Deleted Successfully!</b>,
                      error: <b>Error while Deleting</b>,
                    })
                  }}
                  className="py-2 px-6 hover:bg-neutral-400 bg-neutral-500 text-white rounded-md"
                >
                  Delete
                </button>
                {post.published === false && (
                  <button
                    onClick={() => {
                      toast.promise(publishPost(post.id), {
                        loading: 'Publishing...',
                        success: <b>Published Successfully!</b>,
                        error: <b>Error while Publishing</b>,
                      })
                    }}
                    className="py-2 px-6 bg-red-500 hover:bg-red-400 text-white rounded-md"
                  >
                    Publish
                  </button>
                )}
                {post.published === true && (
                  <button
                    onClick={() => {
                      toast.promise(unPublishPost(post.id), {
                        loading: 'UnPublishing...',
                        success: <b>Un Published Successfully!</b>,
                        error: <b>Error while Un-Publishing</b>,
                      })
                    }}
                    className="py-2 px-6 bg-slate-500 hover:bg-slate-400 text-white rounded-md"
                  >
                    UnPublish
                  </button>
                )}
                <Link href={`/posts/${post.slug}/edit`}>
                  <a className="py-2 px-6 bg-indigo-500 hover:bg-indigo-400 text-white rounded-md">
                    Edit
                  </a>
                </Link>
              </div>
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
            <div className="flex text-sm space-x-1">
              <div>Last Updated</div>
              <ReactTimeago date={post.updatedAt} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Post

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = getSession(context)
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
  }
  return {
    props: { session: session } && JSON.parse(JSON.stringify(post)),
  }
}
