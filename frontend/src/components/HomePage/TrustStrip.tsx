export function TrustStrip() {
  return (
    <section className="border-b border-black/5 bg-[#050509]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-4 text-xs text-slate-200 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-0">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <span className="tracking-[0.24em] uppercase text-slate-400">
            ARISTINO · MENSWEAR
          </span>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] sm:text-xs">
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
            Được hơn 20.000 khách hàng tin tưởng
          </p>
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
            Miễn phí chỉnh sửa cho mọi bộ vest
          </p>
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            Giao hàng nhanh trong 48 giờ
          </p>
        </div>
      </div>
    </section>
  );
}


