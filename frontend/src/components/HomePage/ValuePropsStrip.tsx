export function ValuePropsStrip() {
  const items = [
    {
      label: "Made-to-measure fit",
      copy: "Tailored adjustments on every suit for a precise silhouette.",
    },
    {
      label: "Lifetime alterations",
      copy: "Complimentary tweaks as your style and measurements evolve.",
    },
    {
      label: "Concierge styling",
      copy: "One-to-one styling guidance for key occasions and wardrobes.",
    },
  ];

  return (
    <section className="border-y border-gray-200 bg-[#F9FAFB]">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8 lg:px-0">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9CA3AF]">
              The Aristino standard
            </p>
            <h2 className="mt-2 font-['Playfair_Display'] text-2xl font-semibold text-[#111827] sm:text-3xl">
              More than just the perfect suit
            </h2>
          </div>
          <p className="max-w-sm text-xs text-[#6B7280] sm:text-sm">
            Every detail is considered: from first fitting to final pressing, we
            obsess over the way each piece feels in motion.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.label}
              className="rounded-2xl bg-white/80 p-6 shadow-[0_10px_40px_rgba(15,23,42,0.04)] ring-1 ring-gray-200"
            >
              <p className="text-xs uppercase tracking-[0.28em] text-[#9CA3AF]">
                {item.label}
              </p>
              <p className="mt-3 text-sm text-[#4B5563]">{item.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


