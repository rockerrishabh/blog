import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '../../../../lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  const postId = req.query.id
  if (session) {
    if (req.method === 'DELETE') {
      const posts = await prisma.posts.delete({
        where: { id: String(postId) },
      })
      res.json(posts)
    } else {
      throw new Error(
        `The HTTP ${req.method} method is not supported at this route`
      )
    }
  } else {
    res.send({
      error: 'You must be sign in to view the protected content on this page.',
    })
  }
}
