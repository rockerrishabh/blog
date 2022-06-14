import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const postId = req.query.id
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
}
