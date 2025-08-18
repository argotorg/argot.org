export default function About() {
  return (
    <section className="py-8 md:py-24">
      <h2 className="mb-4 text-center text-3xl font-extrabold md:mb-8">About</h2>

      <div className="mx-auto max-w-3xl space-y-6 text-base md:text-xl">
        <p className="max-w-prose">
          Argot works on essential public goods such as Solidity, Fe, Sourcify, Ethdebug, Act, and
          Hevm. The collective is dedicated to ensure this infrastructure evolves with integrity,
          transparency, and technical excellence.
        </p>

        <p className="max-w-prose">
          We provide a stable, long-term home for these projects, ensuring they remain open-source,
          accessible, and free from commercial capture.
        </p>

        <div className="mt-8">
          <h3 className="mb-6 text-xl font-bold md:text-2xl">
            We believe Ethereum's core infrastructure should be:
          </h3>

          <ul className="list-disc space-y-4 pl-6 text-base marker:text-amber-500 md:text-lg">
            <li>
              <strong>Independent</strong> - free from commercial capture, enabling collaboration
              over control.
            </li>

            <li>
              <strong>Open-source</strong> - software that anyone can inspect, use, and contribute
              to.
            </li>

            <li>
              <strong>Rigorously engineered</strong> - minimizing compiler bugs, improving developer
              safety, and responding to real-world usage patterns.
            </li>

            <li>
              <strong>Sustainable</strong> - supported by long-term stewardship, not short-term
              incentives.
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
