type PageHeroProps = {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
};

export function PageHero({
  eyebrow,
  title,
  accent,
  description,
}: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="page-container relative py-20 sm:py-24">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display-title mt-5 max-w-4xl text-5xl leading-[0.98] text-stone-100 sm:text-6xl lg:text-7xl">
          {title} <span className="text-amber-400">{accent}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-stone-400 sm:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}
