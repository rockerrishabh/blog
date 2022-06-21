import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

function Links() {
  const { data: session } = useSession()
  return (
    <>
      {session && (
        <Link href="/dashboard">
          <a className="font-semibold text-lg hover:text-blue-500">Dashboard</a>
        </Link>
      )}
      <Link href="/category">
        <a className="hover:text-blue-500">Category</a>
      </Link>
      <Link href="/about-us">
        <a className="hover:text-blue-500">About Us</a>
      </Link>
      <Link href="/contact-us">
        <a className="hover:text-blue-500">Contact Us</a>
      </Link>
    </>
  )
}

export default Links
