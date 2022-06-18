import Link from 'next/link'
import React from 'react'

function Links() {
  return (
    <>
      <Link href="/about-us">
        <a className="hover:text-blue-500">About Us</a>
      </Link>
      <Link href="/about-us">
        <a className="hover:text-blue-500">About Us</a>
      </Link>
      <Link href="/about-us">
        <a className="hover:text-blue-500">About Us</a>
      </Link>
    </>
  )
}

export default Links
