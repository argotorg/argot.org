import Footer from './Footer'
import { ReactNode } from 'react'
import Header from './Header'

interface Props {
  children: ReactNode
}

const LayoutWrapper = ({ children }: Props) => {
  return (
    <div className="flex h-screen flex-col justify-between">
      <Header />
      <main className="mb-auto">{children}</main>
      <Footer />
    </div>
  )
}

export default LayoutWrapper
