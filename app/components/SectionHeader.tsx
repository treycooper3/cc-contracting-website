interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export default function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div>
        <span className="mb-3 block font-heading text-sm font-bold uppercase tracking-[0.3em] text-primary">
          {eyebrow}
        </span>
        <h2 className="font-heading text-3xl font-extrabold uppercase leading-tight text-foreground md:text-4xl">
          {title}
        </h2>
      </div>
      {description && <p className="max-w-sm text-muted md:text-right">{description}</p>}
    </div>
  );
}
