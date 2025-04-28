import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

const Footer = () => {
  return (
    <footer className="mt-auto pb-4">
      <div className="mt-8 flex flex-col md:mt-16">
        <div className="flex flex-col items-center space-y-4 py-4 dark:border-gray-700 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex flex-col items-center space-y-2 text-xl font-medium text-anthracite-700 dark:text-ecru-300 md:flex-row md:space-x-4 md:space-y-0">
            <span className="font-bold md:mr-8">ARGOT © {new Date().getFullYear()}</span>
            <Link className="link-underline" href="/terms">
              Terms of use
            </Link>
            <Link className="link-underline" href="/imprint">
              Imprint
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
