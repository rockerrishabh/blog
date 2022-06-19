export type PostsProps = {
  posts: {
    id: string
    title: string
    slug: string
    content: string
    published: boolean
    author: {
      name: string
      email: string
    }
    createdAt: Date
    updatedAt: Date
  }[]
}

export type PostProps = {
  id: string
  title: string
  slug: string
  content: string
  published: boolean
  author: {
    name: string
    email: string
  }
  createdAt: Date
  updatedAt: Date
}

export type FormData = {
  title: string
  slug: string
  content: string
}
