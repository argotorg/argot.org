export interface Project {
  title: string
  description: string
  longDescription: string
  url: string
  logo?: string
}

export const projects: Project[] = [
  {
    title: 'Solidity',
    description: 'Smart contract language',
    longDescription:
      'Solidity is an object-oriented programming language for implementing smart contracts on various blockchain platforms, most notably, Ethereum. A smart contract is a collection of code (its functions) and data (its state) that resides at a specific address on the Ethereum blockchain.',
    url: 'https://soliditylang.org/',
    logo: '/static/projects/solidity.svg',
  },
  {
    title: 'Act',
    description: 'Formal specification language for smart contracts',
    longDescription:
      'Act is a language for writing formal specifications of smart contracts. It allows developers to express the behavior and properties of smart contracts in a precise, mathematical way. This enables formal verification of contract behavior, helping catch potential bugs and vulnerabilities before deployment.',
    url: 'https://github.com/ethereum/act',
  },
  {
    title: 'Ethdebug',
    description: 'Standardized debug info format for the EVM',
    longDescription:
      'Ethdebug provides a standardized format for debug information in the Ethereum Virtual Machine (EVM). This enables better debugging tools and experiences across different development environments, making it easier for developers to track down issues in their smart contracts during development and after deployment.',
    url: 'https://ethdebug.github.io/format/index.html',
    logo: '/static/projects/ethdebug.svg',
  },
  {
    title: 'Fe',
    description: 'Smart contract language',
    longDescription:
      'Fe is a statically typed language for the Ethereum Virtual Machine (EVM). It is inspired by Python and Rust, aiming to be easy to learn while providing strong safety guarantees. Fe features built-in overflow checking, a powerful type system, and compilation to efficient EVM bytecode.',
    url: 'https://fe-lang.org/',
    logo: '/static/projects/fe.svg',
  },
  {
    title: 'Hevm',
    description: 'Symbolic execution engine for the EVM',
    longDescription:
      'Hevm is a specialized symbolic execution engine and testing framework for Ethereum smart contracts. It enables developers to perform detailed analysis of contract behavior, find edge cases, and verify properties of their code through symbolic manipulation. This powerful tool helps ensure contract correctness and security.',
    url: 'https://hevm.dev',
    logo: '/static/projects/hevm.svg',
  },
  {
    title: 'Sourcify',
    description: 'Open-source and decentralized source-code verification',
    longDescription:
      'Sourcify is a decentralized service that enables automatic verification and publication of smart contract source code. It creates a public repository of verified contract source code, improving transparency and trust in the Ethereum ecosystem. This helps users verify that deployed bytecode matches the source code they expect.',
    url: 'https://sourcify.dev/',
    logo: '/static/projects/sourcify.png',
  },
]
