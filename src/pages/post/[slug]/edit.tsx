import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { prisma } from '../../../../lib/prisma'
import { FormData, PostProps } from '../../../../typings'
import Layout from '../../../components/Layout'
import 'suneditor/dist/css/suneditor.min.css'
import dynamic from 'next/dynamic'

const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false,
})

function Edit(post: PostProps) {
  const { data: session } = useSession()
  const router = useRouter()

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()
  const onSubmit = handleSubmit(({ title, slug, content }) =>
    toast.promise(Update({ title, slug, content }), {
      loading: 'Updating...',
      success: <b>Updated Successfully!</b>,
      error: <b>Error while Updating</b>,
    })
  )
  const Update = async ({ title, slug, content }: FormData): Promise<void> => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/update/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, slug, content }),
    })
    reset()
    router.push(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/my-posts`)
  }

  return (
    <Layout className="max-w-7xl mx-auto" title={`${post.title} - Edit`}>
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
                  defaultValue={post.title}
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
                  defaultValue={post.slug}
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
                <SunEditor
                  // className="flex-1 px-1 py-1 bg-transparent outline-none border border-gray-600 rounded focus:ring-2 focus:border-0 focus:ring-blue-500"
                  onBlur={onBlur}
                  name="content"
                  defaultValue={post.content}
                  onChange={onChange}
                  setOptions={{
                    height: '794px',
                    width: '100%',
                    minHeight: '600px',
                    historyStackDelayTime: 100,
                    attributesWhitelist: {
                      all: 'style',
                    },
                    buttonList: [
                      // Default
                      ['undo', 'redo'],
                      ['font', 'fontSize', 'formatBlock'],
                      ['paragraphStyle', 'blockquote'],
                      [
                        'bold',
                        'underline',
                        'italic',
                        'strike',
                        'subscript',
                        'superscript',
                      ],
                      ['fontColor', 'hiliteColor', 'textStyle'],
                      ['removeFormat'],
                      ['outdent', 'indent'],
                      ['align', 'horizontalRule', 'list', 'lineHeight'],
                      ['table', 'link', 'image', 'video', 'audio'],
                      ['fullScreen', 'showBlocks', 'codeView'],
                      ['preview', 'print'],
                    ], // Or Array of button list, eg. [['font', 'align'], ['image']]
                    // plugins: [font] set plugins, all plugins are set by default
                    // Other option
                    imageFileInput: false,
                  }}
                />
              )}
              name="content"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 py-2 rounded text-white hover:opacity-95"
          >
            Update
          </button>
        </form>
      </div>
    </Layout>
  )
}

export default Edit

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  if (!session) {
    context.res.writeHead(302, { Location: '/' })
    context.res.end()
  }
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
