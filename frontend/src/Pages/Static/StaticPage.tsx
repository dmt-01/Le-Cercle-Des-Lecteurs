import type { Section } from "../../types";

type Props = {
  category: string;
  title: string;
  subtitle: string;
  sections: Section[];
};

function StaticPage({ category, title, subtitle, sections }: Props) {
  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-20">
        {/* ── En-tête ── */}
        <p className="text-[10px] uppercase tracking-widest text-secondary font-medium mb-2">
          {category}
        </p>
        <h1 className="text-4xl font-serif italic text-primary mb-4 leading-tight">
          {title}
        </h1>
        <p className="text-primary/50 text-sm leading-relaxed mb-10 max-w-lg">
          {subtitle}
        </p>

        {/* ── Sections ── */}
        <div className="flex flex-col gap-5">
          {sections.map((s) => (
            <div
              key={s.heading}
              className="bg-white rounded-2xl border border-beige-medium p-6"
            >
              <h2 className="text-lg font-serif italic text-primary mb-3">
                {s.heading}
              </h2>
              <p className="text-sm text-primary/60 leading-relaxed">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StaticPage;
