import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden border-b border-line py-20">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(13,17,23,0.92) 0%, rgba(13,17,23,0.75) 50%, rgba(13,17,23,0.4) 100%), url('/hero-construction.jpg')",
        }}
      />
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="max-w-4xl">
          <span className="mb-5 block font-heading text-sm font-bold uppercase tracking-[0.3em] text-accent">
            Licensed &amp; Insured General Contractor
          </span>
          <h1 className="mb-8 font-heading text-5xl font-extrabold uppercase leading-[1.05] text-white md:text-7xl">
            Built Right.
            <br />
            Built to <span className="text-primary">Last.</span>
          </h1>
          <p className="mb-10 max-w-xl border-l-[3px] border-primary pl-5 text-lg text-[#c9d1d9]">
            Quality general contracting for residential and commercial projects. From kitchen
            remodels to full commercial buildouts, we deliver craftsmanship you can count on.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/#contact"
              className="btn-fill border-2 border-primary bg-primary px-8 py-4 text-center font-heading text-sm font-bold uppercase tracking-[0.18em] text-white"
            >
              Get a Free Estimate
            </Link>
            <Link
              href="/#services"
              className="border-2 border-primary bg-black/50 px-8 py-4 text-center font-heading text-sm font-bold uppercase tracking-[0.18em] text-accent transition-colors hover:bg-primary hover:text-white"
            >
              Our Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
