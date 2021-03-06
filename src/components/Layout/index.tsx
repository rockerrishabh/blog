import Head from 'next/head'
import { ReactElement, ReactNode } from 'react'
import Header from './Header.tsx'

type LayoutProps = {
  title: string
  children: ReactNode
  className?: string
}

function Layout({ title, children, className }: LayoutProps): ReactElement {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className={className}>{children}</div>
    </>
  )
}

export default Layout
