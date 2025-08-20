/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'Argot Collective',
  author: 'Argot Collective',
  headerTitle: 'Argot Collective',
  description:
    "The Argot Collective is a new non-profit organization maintaining Ethereum's core infrastructure formed by 25 former Ethereum Foundation employees. Operating democratically and transparently, we aim to provide stable, long-term support for crucial projects, free from commercial pressures.",
  language: 'en-us',
  theme: 'light', // system, dark or light
  siteUrl: 'https://argot.org',
  siteRepo: 'https://github.com/argotorg/argot.org',
  siteLogo: `${process.env.BASE_PATH || ''}/static/images/logo-circle.png`,
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/argot-og-image?cache-break-2.png`,
  // mastodon: 'https://mastodon.social/@mastodonuser',
  email: 'hello@argot.org',
  github: 'https://github.com/argotorg',
  x: 'https://x.com/argotorg',
  farcaster: 'https://warpcast.com/argotorg',
  bluesky: 'https://bsky.app/profile/argot.org',
  // twitter: 'https://twitter.com/Twitter',
  // facebook: 'https://facebook.com',
  // youtube: 'https://youtube.com',
  // linkedin: 'https://www.linkedin.com',
  // threads: 'https://www.threads.net',
  // instagram: 'https://www.instagram.com',
  locale: 'en-US',
  // set to true if you want a navbar fixed to the top
  stickyNav: false,
}

module.exports = siteMetadata
