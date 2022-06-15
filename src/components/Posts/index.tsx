import { useRouter } from 'next/router'
import { PostProps } from '../../../typings'
import ReactMarkdown from 'react-markdown'
import TimeAgo from 'react-timeago'
import Link from 'next/link'

type Props = {
  title: string
  authorName: string
  authorEmail: string
  content: string
  createdAt: Date
  updatedAt: Date
  published: boolean
  href: string
}

function Posts({
  title,
  authorName,
  authorEmail,
  content,
  createdAt,
  updatedAt,
  published,
  href,
}: Props) {
  const router = useRouter()
  return (
    <Link href={href}>
      <div className="cursor-pointer shadow-md p-2">
        <h2>{title}</h2>
        <small>{authorName}</small>
        <small>{authorEmail}</small>
        <ReactMarkdown>{content}</ReactMarkdown>
        <p>{published}</p>
        <TimeAgo date={updatedAt} />
        <TimeAgo date={createdAt} />
      </div>
    </Link>
  )
}

export default Posts
