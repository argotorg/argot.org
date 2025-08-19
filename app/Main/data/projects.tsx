import React, { ReactNode } from 'react'

export interface Project {
  title: string
  description: string
  longDescription: ReactNode
  url: string
  logo?: string
}

export const projects: Project[] = [
  {
    title: 'Solidity',
    description: 'Statically-typed curly-braces EVM programming language',
    longDescription: (
      <>
        Solidity is a statically-typed curly-braces programming language designed for developing
        smart contracts that run on the Ethereum Virtual Machine. Smart contracts are programs that
        are executed within a peer-to-peer network, where no single entity has special authority
        over their execution. This allows anyone to implement tokens of value, ownership, voting,
        and other types of logic.
        <br />
        <br />
        Solidity supports inheritance, libraries, and complex user-defined types, among other
        features. It is a mature project that has been widely used in production for almost 10 years
        now, created with an intention to make a usable high-level language as quickly as possible.
        The focus was on correctness of the language, type safety, and closeness to JavaScript for
        familiarity and ease of development.
      </>
    ),
    url: 'https://soliditylang.org/',
    logo: '/static/projects/solidity.svg',
  },
  {
    title: 'Act',
    description: 'Formal specification language for EVM programs',
    longDescription: (
      <>
        Act is a human-readable formal specification language that provides a rigorous, exhaustive
        description of EVM programs. It enables automatic proofs that a smart contract's bytecode
        conforms to its specification. Once verified, the specification can be used to prove
        high-level properties of the contract, such as safety and liveness.
        <br />
        <br />
        Act integrates with well-established verification tools (SMT solvers, theorem prover) to
        maximize expressiveness and verification power.
      </>
    ),
    url: 'https://github.com/ethereum/act',
    logo: '/static/projects/act.svg',
  },
  {
    title: 'Ethdebug',
    description: 'Smart contract debugging data format that aims to make the EVM readable',
    longDescription: (
      <>
        <strong>ethdebug</strong> aims to make the EVM readable. Smart contract compilation destroys
        everything human – variable names, data structures, your actual logic – leaving only
        bytecode. Today, debugging a mainnet contract means reverse-engineering opcodes while
        millions of dollars execute through inscrutable hex.
        <br />
        <br />
        The <strong>ethdebug format</strong> is a universal standard that enables compilers to
        preserve debugging information through compilation and deployment. Compatible with Solidity,
        Vyper, Fe, and future languages, it gives debuggers the information needed to show you real
        variable values, actual data structures, and the original program logic. No more manually
        reconstructing what happened from raw EVM operations. <strong>ethdebug</strong> is designed
        to power debugging tools across the entire contract lifecycle – from local development to
        production deployments where the stakes are real and the code is immutable.
      </>
    ),
    url: 'https://ethdebug.github.io/format/index.html',
    logo: '/static/projects/ethdebug.svg',
  },
  {
    title: 'Fe',
    description: 'Statically-typed language for the EVM',
    longDescription: (
      <>
        Fe is a statically typed language for the Ethereum Virtual Machine (EVM). The syntax and
        type system is similar to Rust's, with the addition of higher-kinded types. Fe aims to be a
        powerful and versatile language that empowers developers.
      </>
    ),
    url: 'https://fe-lang.org/',
    logo: '/static/projects/fe.svg',
  },
  {
    title: 'Hevm',
    description: 'Symbolic execution engine for the EVM',
    longDescription: (
      <>
        Hevm is a specialized symbolic execution engine and testing framework for Ethereum smart
        contracts. It enables developers to perform detailed analysis of contract behavior, find
        edge cases, and verify properties of their code through symbolic manipulation. This powerful
        tool helps ensure contract correctness and security.
      </>
    ),
    url: 'https://hevm.dev',
    logo: '/static/projects/hevm.png',
  },
  {
    title: 'Sourcify',
    description: 'Open-source and decentralized source-code verification service',
    longDescription: (
      <>
        Sourcify lets smart contract developers verify their source code against the bytecode they
        deploy (and receive the "green checkmark") on EVM chains. Sourcify aims to improve the
        overall verification experience and push the exiting ecosystem to be more open and
        transparent:
        <br />
        <br />• <strong>Open-source</strong>: Sourcify is and will always be 100% open-source.
        Anyone can run their own instance of Sourcify easily.
        <br />• <strong>Open-data</strong>: Verified contract datasets should be open and easily
        accessible in bulk. Sourcify's whole dataset is available in modern data formats.
        <br />• <strong>Open-standards</strong>: Sourcify promotes open-standards and collaboration
        between different verifiers by stewarding the{' '}
        <a className="text-amber-600" href="https://verifieralliance.org/">
          Verifier Alliance
        </a>
        .
      </>
    ),
    url: 'https://sourcify.dev/',
    logo: '/static/projects/sourcify.png',
  },
]
