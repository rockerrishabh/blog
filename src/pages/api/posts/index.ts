import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '../../../../lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title, content, slug } = req.body

  const session = await getSession({ req })
  try {
    if (session) {
      const posts = await prisma.posts.create({
        data: {
          title: title,
          content: content,
          slug: slug,
          author: {
            connect: {
              email: session?.user.email,
            },
          },
        },
      })
      res.json(posts)
    } else {
      res.send({
        error:
          'You must be sign in to view the protected content on this page.',
      })
    }
  } catch (error) {
    console.log(error)
  }
}
