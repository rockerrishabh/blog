import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Links from '../../Links'

function Header() {
  const { data: session } = useSession()
  const router = useRouter()
  return (
    <div className="sticky bg-white top-0 border-b border-gray-400">
      <div className="justify-between items-center flex max-w-7xl py-4 mx-auto">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <a className="font-bold text-slate-700 hover:text-red-400 hover:scale-105 text-2xl">
              Blog App
            </a>
          </Link>
          {session && (
            <>
              {router.pathname === '/' && (
                <Link href="/dashboard">
                  <a className="font-medium mt-[0.22rem] hover:text-blue-500">
                    Dashboard
                  </a>
                </Link>
              )}
              {router.pathname === '/posts/[slug]' && (
                <Link href="/dashboard">
                  <a className="font-medium mt-[0.22rem] hover:text-blue-500">
                    Dashboard
                  </a>
                </Link>
              )}
            </>
          )}
        </div>

        <div className="flex items-center space-x-14">
          <div className="space-x-4">
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
