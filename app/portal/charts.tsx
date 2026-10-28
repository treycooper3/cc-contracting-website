/**
 * Chart primitives for the portal. Plain SVG and CSS, no chart library: four
 * forms on one internal page does not justify the dependency.
 *
 * The categorical palette below was validated, not eyeballed — all five hues
 * pass the lightness band (OKLCH L 0.48-0.67), chroma floor, CVD separation,
 * normal-vision floor and 3:1 contrast against BOTH card surfaces (C&C #161b22,
 * TnD #1e1e1e). If you add a sixth series, re-run the validator rather than
 * picking a hue.
 *
 * The danger red (--danger) is deliberately NOT in this list. It is reserved
 * for status (overdue, attention), so a status colour never reads as "series 6",
 * and it never travels alone: every red mark has a word beside it.
 */

import Link from "next/link";

export const CATEGORICAL = ["#c08a12", "#4a86c9", "#4f9c5f", "#a25fbe", "#cc6046"];

export type Slice = { label: string; value: number };

const pct = (value: number, total: number) =>
  total === 0 ? 0 : Math.round((value / total) * 100);

const card = "rounded-lg border border-line bg-card";

/**
 * One figure. The value uses the font's proportional digits on purpose:
 * tabular-nums is for columns that must align, and a lone "121" set tabular
 * looks loose at display size.
 */
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
      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">{label}</span>
      <span className={`font-heading text-3xl leading-none ${alert ? "text-danger" : "text-foreground"}`}>
        {value}
      </span>
      {hint && (
        <span className={`text-xs ${alert ? "text-danger" : "text-muted"}`}>
          {alert && <span aria-hidden="true">▲ </span>}
          {hint}
        </span>
      )}
    </>
  );
  const cls = `${card} flex flex-col gap-2 p-4`;
  if (href) {
    return (
      <Link
        href={href}
        className={`${cls} transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
      >
        {body}
      </Link>
    );
  }
  return <div className={cls}>{body}</div>;
}

/** A titled surface. `href` adds a quiet "View" action on the right, so the
 * heading stays a heading and the link looks like one. */
export function Panel({
  title,
  href,
  hrefLabel = "View",
  aside,
  children,
}: {
  title: string;
  href?: string;
  hrefLabel?: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className={`${card} flex flex-col gap-4 p-5`}>
      <header className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className="font-heading text-sm uppercase tracking-[0.12em] text-foreground">{title}</h2>
        {aside}
        {href && (
          <Link href={href} className="whitespace-nowrap text-xs text-primary hover:underline">
            {hrefLabel} →
          </Link>
        )}
      </header>
      {children}
    </section>
  );
}

/** What an empty panel says. Centred and bounded so it reads as a state, not
 * as a sentence that fell out of the layout. */
export function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
      {children}
    </p>
  );
}

/** Shared table chrome. Cells keep their own padding via `cell`. */
export const cell = "px-3 py-2";
export const head = "px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted";

export function Table({ children, minWidth = "40rem" }: { children: React.ReactNode; minWidth?: string }) {
  return (
    <div className={`${card} overflow-x-auto`}>
      <table className="w-full text-sm" style={{ minWidth }}>
        {children}
      </table>
    </div>
  );
}

/**
 * Donut for categorical identity. Segments are stroked arcs with a 2px surface
 * gap between them, and every segment is also named and numbered in the legend,
 * so identity never rests on colour alone.
 */
export function Donut({
  slices,
  label,
  unit = "leads",
  size = 168,
}: {
  slices: Slice[];
  label: string;
  unit?: string;
  size?: number;
}) {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  const stroke = 24;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg width={size} height={size} role="img" aria-label={label}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" className="stroke-card-raised" strokeWidth={stroke} />
          {slices.map((slice, i) => {
            const length = (slice.value / (total || 1)) * circumference;
            const gap = slices.length > 1 ? 2 : 0;
            const visible = Math.max(length - gap, 0);
            const el = (
              <circle
                key={slice.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={CATEGORICAL[i % CATEGORICAL.length]}
                strokeWidth={stroke}
                strokeDasharray={`${visible} ${circumference - visible}`}
                strokeDashoffset={-offset}
              >
                <title>{`${slice.label}: ${slice.value} (${pct(slice.value, total)}%)`}</title>
              </circle>
            );
            offset += length;
            return el;
          })}
        </g>
        <text x="50%" y="48%" textAnchor="middle" className="fill-foreground font-heading" style={{ fontSize: 28 }}>
          {total}
        </text>
        <text x="50%" y="61%" textAnchor="middle" className="fill-muted" style={{ fontSize: 11 }}>
          {unit}
        </text>
      </svg>

      <ul className="flex flex-col gap-2 text-sm">
        {slices.map((slice, i) => (
          <li key={slice.label} className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 shrink-0 rounded-sm" style={{ background: CATEGORICAL[i % CATEGORICAL.length] }} />
            <span className="text-foreground">{slice.label}</span>
            <span className="tabular-nums text-muted">
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
  format = (value: number) => String(value),
  emptyLabel = "Nothing to show",
}: {
  rows: Slice[];
  color?: string;
  format?: (value: number) => string;
  emptyLabel?: string;
}) {
  if (rows.length === 0) return <Empty>{emptyLabel}</Empty>;
  const max = Math.max(...rows.map((r) => r.value), 1);

  return (
    <ul className="flex flex-col gap-2.5">
      {rows.map((row) => (
        <li key={row.label} className="grid grid-cols-[8rem_1fr_auto] items-center gap-3 text-sm">
          <span className="truncate text-muted" title={row.label}>
            {row.label}
          </span>
          <span className="h-2 rounded-sm bg-card-raised" aria-hidden>
            <span
              className="block h-2 rounded-r-sm"
              style={{ width: `${Math.max((row.value / max) * 100, 2)}%`, background: color }}
            />
          </span>
          <span className="min-w-[2rem] text-right tabular-nums text-foreground">{format(row.value)}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Columns over time, one series. CSS flex rather than SVG so the bars stay
 * 24px wide at any viewport instead of scaling with a viewBox. Only the
 * largest and the latest column carry a value; every column has a tooltip and
 * the table under the chart carries the rest. An incomplete period is drawn
 * lighter and says so.
 */
export function Columns({
  points,
  format,
  color = CATEGORICAL[1],
}: {
  points: { label: string; value: number; complete?: boolean; title?: string }[];
  format: (value: number) => string;
  color?: string;
}) {
  if (points.length === 0) return <Empty>No data yet.</Empty>;
  const max = Math.max(...points.map((p) => p.value), 1);
  const maxIndex = points.findIndex((p) => p.value === max);
  const last = points.length - 1;

  return (
    // No gap between columns: each column draws its own bit of baseline, and a
    // gap would turn the one line into dashes.
    <div className="flex items-end" role="img" aria-label="Column chart">
      {points.map((p, i) => {
        const labelled = i === maxIndex || i === last;
        return (
          <div key={p.label} className="flex min-w-0 flex-1 flex-col items-center gap-1.5" title={p.title ?? `${p.label}: ${format(p.value)}`}>
            <span className={`h-4 text-xs tabular-nums ${labelled ? "text-foreground" : "text-transparent"}`}>
              {labelled ? format(p.value) : "·"}
            </span>
            <div className="flex h-36 w-full items-end justify-center border-b border-line">
              <div
                className="w-6 max-w-full rounded-t"
                style={{
                  height: `${Math.max((p.value / max) * 100, p.value > 0 ? 2 : 0)}%`,
                  background: color,
                  opacity: p.complete === false ? 0.45 : 1,
                }}
              />
            </div>
            <span className="truncate text-xs text-muted">{p.label}</span>
            {p.complete === false && <span className="-mt-1 text-[10px] text-muted">to date</span>}
          </div>
        );
      })}
    </div>
  );
}
