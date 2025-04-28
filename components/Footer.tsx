import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

const Footer = () => {
  return (
    <footer className="mt-auto pb-4">
      <div className="mt-16 flex flex-col">
        <div className="flex items-center justify-between py-4 dark:border-gray-700">
          <div className="flex items-center space-x-4 text-xl font-medium text-anthracite-700 dark:text-ecru-300">
            <span className="mr-8 font-bold">ARGOT © {new Date().getFullYear()}</span>
            <Link className="link-underline" href="/terms">
              Terms of use
            </Link>
            <Link className="link-underline" href="/brand">
              Brand assets
            </Link>
          </div>
          <div className="flex items-center space-x-1">
            <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={5} />
            <SocialIcon kind="github" href={siteMetadata.github} size={5} />
            <SocialIcon kind="farcaster" href={siteMetadata.farcaster} size={5} />
            <SocialIcon kind="x" href={siteMetadata.x} size={5} />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
