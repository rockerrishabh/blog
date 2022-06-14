import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../../lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title, content, slug } = req.body
  const postId = req.query.id
  if (req.method === 'PUT') {
    const post = await prisma.posts.update({
      where: { id: String(postId) },
      data: {
        title: title,
        content: content,
        slug: slug,
      },
    })
    res.json(post)
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route`
    )
  }
}
