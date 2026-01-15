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
          </div>
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <div className="flex space-x-4 text-lg font-medium ">
              <Link className="link-underline" href="/privacy-policy">
                Privacy Policy
              </Link>
              <Link
                className="link-underline"
                href="https://github.com/argotorg/assets"
                target="_blank"
                rel="noopener noreferrer"
              >
                Brand Assets
              </Link>
            </div>
            <div className="flex  space-x-1">
              <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={5} />
              <SocialIcon kind="github" href={siteMetadata.github} size={5} />
              <SocialIcon kind="farcaster" href={siteMetadata.farcaster} size={5} />
              <SocialIcon kind="x" href={siteMetadata.x} size={5} />
              <SocialIcon kind="bluesky" href={siteMetadata.bluesky} size={5} />
              <SocialIcon kind="rss" href="/feed.xml" size={5} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
