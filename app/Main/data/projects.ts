export interface Project {
  title: string
  description: string
  href: string
}

export const projects: Project[] = [
  {
    title: 'Solidity',
    description: 'Smart contract language',
    href: 'https://soliditylang.org/',
  },
  {
    title: 'Act',
    description: 'Formal specification language for smart contracts',
    href: 'https://github.com/ethereum/act',
  },
  {
    title: 'Ethdebug',
    description: 'Standardized debug info format for the EVM',
    href: 'https://ethdebug.github.io/format/index.html',
  },
  {
    title: 'Fe',
    description: 'Smart contract language',
    href: 'https://fe-lang.org/',
  },
  {
    title: 'Hevm',
    description: 'Symbolic execution engine for the EVM',
    href: 'https://hevm.dev',
  },
  {
    title: 'Sourcify',
    description: 'Open-source and decentralized source-code verification',
    href: 'https://sourcify.dev/',
  },
]
