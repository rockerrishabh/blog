export type Posts = {
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
    }[]
  }

  export type Post = {   
      id: string
      title: string
      slug: string
      content: string
      published: boolean
      author: {
          name: string
          email: string
      }[]
  }