import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/react'
import Layout from '../../components/Layout'
import { prisma } from '../../../lib/prisma'
import { FormData } from '../../../typings'
import { Controller, useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

function Create() {
  const { data: Session } = useSession()
  const router = useRouter()
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()
  const onSubmit = handleSubmit((data) =>
    toast.promise(Create(data), {
      loading: 'Creating...',
      success: <b>Created Successfully!</b>,
      error: <b>Error while Creating</b>,
    })
  )
  const Create = async (data: FormData): Promise<void> => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      reset()
      router.push('/dashboard/my-posts')
    } catch (error) {
      toast.error('Error Happened')
    }
  }
  return (
    <Layout title="Create new Post" className="max-w-7xl mx-auto">
      <div>Create</div>
      <div className="p-5">
        <form onSubmit={onSubmit} className="flex space-y-4 flex-col">
          <div className="space-x-10 items-center flex">
            <label htmlFor="title">Title:</label>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur } }) => (
                <input
                  id="title"
                  type="text"
                  onBlur={onBlur}
                  onChange={onChange}
                  className="flex-1 px-1 py-1 bg-transparent outline-none border border-gray-600 rounded focus:ring-2 focus:border-0 focus:ring-blue-500"
                />
              )}
              name="title"
            />
          </div>
          <div className="space-x-10 items-center flex">
            <label htmlFor="slug">Slug:</label>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur } }) => (
                <input
                  id="slug"
                  type="text"
                  onBlur={onBlur}
                  onChange={onChange}
                  className="flex-1 px-1 py-1 bg-transparent outline-none border border-gray-600 rounded focus:ring-2 focus:border-0 focus:ring-blue-500"
                />
              )}
              name="slug"
            />
          </div>
          <div className="space-x-4 items-center flex">
            <label htmlFor="content">Content:</label>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur } }) => (
                <textarea
                  className="flex-1 px-1 py-1 bg-transparent outline-none border border-gray-600 rounded focus:ring-2 focus:border-0 focus:ring-blue-500"
                  onBlur={onBlur}
                  id="content"
                  onChange={onChange}
                />
              )}
              name="content"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 py-2 rounded text-white hover:opacity-95"
          >
            Create
          </button>
        </form>
      </div>
    </Layout>
  )
}

export default Create

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
