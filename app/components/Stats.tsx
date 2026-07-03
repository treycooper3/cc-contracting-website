const STATS = [
  {
    label: "Licensed & Insured",
    path: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  },
  {
    label: "Residential & Commercial",
    path: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  },
  {
    label: "Quality Guaranteed",
    path: "M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3",
  },
  {
    label: "Free Estimates",
    path: "M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z M2 10h20",
  },
];

export default function Stats() {
  return (
    <section className="border-b border-line bg-card py-14">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-3 text-center">
            <svg
              viewBox="0 0 24 24"
              width="34"
              height="34"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d={stat.path} />
            </svg>
            <p className="font-heading text-sm font-bold uppercase tracking-[0.1em] text-foreground">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
