import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Links from '../../Links'

function Header() {
  const { data: session } = useSession()
  const router = useRouter()
  return (
    <div className="sticky z-10 bg-white top-0 border-b border-gray-400">
      <div className="justify-between px-4 items-center flex max-w-7xl py-4 mx-auto">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <a className="font-bold text-slate-700 hover:text-red-400 hover:scale-105 text-2xl">
              Blog App
            </a>
          </Link>
        </div>

        <div className="md:flex hidden items-center space-x-14">
          <div className="space-x-4 items-center flex">
            <Links />
          </div>
          {session ? (
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-500 rounded-md text-white hover:bg-red-400"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="px-4 py-2 bg-green-500 rounded-md text-white hover:bg-green-400"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
