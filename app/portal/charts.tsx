/**
 * Chart primitives for the portal dashboard. Plain SVG and CSS, no chart
 * library: three forms on one internal page does not justify the dependency.
 *
 * The categorical palette below was validated, not eyeballed — all five hues
 * pass the lightness band (OKLCH L 0.48-0.67), chroma floor, CVD separation,
 * normal-vision floor and 3:1 contrast against the #161b22 card surface.
 * If you add a sixth series, re-run the validator rather than picking a hue.
 *
 * The danger red (--danger) is deliberately NOT in this list. It is reserved
 * for status (overdue, attention), so a status colour never reads as "series 6".
 */

import Link from "next/link";

export const CATEGORICAL = ["#c08a12", "#4a86c9", "#4f9c5f", "#a25fbe", "#cc6046"];

export type Slice = { label: string; value: number };

const pct = (value: number, total: number) =>
  total === 0 ? 0 : Math.round((value / total) * 100);

export function StatTile({
  label,
  value,
  hint,
  alert = false,
  href,
}: {
  label: string;
  value: string | number;
  hint?: string;
  alert?: boolean;
  href?: string;
}) {
  const body = (
    <>
      <span className="text-xs uppercase tracking-wider text-muted">{label}</span>
      <span className={`font-heading text-3xl ${alert ? "text-danger" : "text-foreground"}`}>{value}</span>
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </>
  );
  // A tile with a destination is a link, styled to say so on hover.
  if (href) {
    return (
      <Link
        href={href}
        className="flex flex-col gap-1 rounded border border-line bg-card p-4 transition-colors hover:border-primary"
      >
        {body}
      </Link>
    );
  }
  return <div className="flex flex-col gap-1 rounded border border-line bg-card p-4">{body}</div>;
}

/**
 * Donut for categorical identity. Segments are stroked arcs with a 2px surface
 * gap between them, and every segment is also named and numbered in the legend,
 * so identity never rests on colour alone.
 */
export function Donut({ slices, size = 168 }: { slices: Slice[]; size?: number }) {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  const stroke = 24;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg width={size} height={size} role="img" aria-label="Leads by source">
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#333333"
            strokeWidth={stroke}
          />
          {slices.map((slice, i) => {
            const length = (slice.value / (total || 1)) * circumference;
            const gap = slices.length > 1 ? 2 : 0;
            const dash = `${Math.max(length - gap, 0)} ${circumference - Math.max(length - gap, 0)}`;
            const el = (
              <circle
                key={slice.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={CATEGORICAL[i % CATEGORICAL.length]}
                strokeWidth={stroke}
                strokeDasharray={dash}
                strokeDashoffset={-offset}
              >
                <title>{`${slice.label}: ${slice.value} (${pct(slice.value, total)}%)`}</title>
              </circle>
            );
            offset += length;
            return el;
          })}
        </g>
        <text
          x="50%"
          y="48%"
          textAnchor="middle"
          className="fill-foreground font-heading"
          style={{ fontSize: 28 }}
        >
          {total}
        </text>
        <text x="50%" y="61%" textAnchor="middle" className="fill-muted" style={{ fontSize: 11 }}>
          leads
        </text>
      </svg>

      <ul className="flex flex-col gap-2 text-sm">
        {slices.map((slice, i) => (
          <li key={slice.label} className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 shrink-0 rounded-sm"
              style={{ background: CATEGORICAL[i % CATEGORICAL.length] }}
            />
            <span className="text-foreground">{slice.label}</span>
            <span className="text-muted">
              {slice.value} · {pct(slice.value, total)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Horizontal bars for magnitude. One measure, one colour: the bars encode size,
 * not identity, so colouring each row differently would be decoration that
 * implies a category split that is not there.
 */
export function BarList({
  rows,
  color = CATEGORICAL[0],
  emptyLabel = "Nothing to show",
}: {
  rows: Slice[];
  color?: string;
  emptyLabel?: string;
}) {
  if (rows.length === 0) return <p className="text-sm text-muted">{emptyLabel}</p>;
  const max = Math.max(...rows.map((r) => r.value), 1);

  return (
    <ul className="flex flex-col gap-2">
      {rows.map((row) => (
        <li key={row.label} className="grid grid-cols-[9rem_1fr_2rem] items-center gap-3 text-sm">
          <span className="truncate text-muted" title={row.label}>
            {row.label}
          </span>
          <span className="h-2 rounded-sm bg-background" aria-hidden>
            <span
              className="block h-2 rounded-r-sm"
              style={{ width: `${Math.max((row.value / max) * 100, 2)}%`, background: color }}
            />
          </span>
          <span className="text-right tabular-nums text-foreground">{row.value}</span>
        </li>
      ))}
    </ul>
  );
}

export function Panel({
  title,
  href,
  children,
}: {
  title: string;
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 rounded border border-line bg-card p-5">
      <h2 className="font-heading text-sm uppercase tracking-wider text-primary">
        {href ? (
          <Link href={href} className="hover:underline">
            {title} →
          </Link>
        ) : (
          title
        )}
      </h2>
      {children}
    </section>
  );
}
