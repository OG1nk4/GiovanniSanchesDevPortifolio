import { dictionaries, links, stack, type Lang } from '@/lib/content';
import { projects } from '@/lib/projects';
import { DotField } from './DotField';
import { HalftonePortrait } from './HalftonePortrait';
import { Header } from './Header';
import { Motion } from './Motion';
import { ParticleName } from './ParticleName';
import { ProjectShowcase } from './ProjectShowcase';
import { Roll } from './Roll';

const container = 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10';
const label = 'font-mono text-xs uppercase tracking-[0.2em] text-muted';

/** Button that fills from the bottom on hover; the label rolls to a copy. */
const fillButton =
  'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full transition-colors duration-500 before:absolute before:inset-0 before:translate-y-full before:rounded-full before:transition-transform before:duration-700 before:ease-out-expo hover:before:translate-y-0';

function Line({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" data-anim="line" className={`h-px bg-line ${className}`} />;
}

function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={`size-4 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 12 12 4M5.5 4H12v6.5" />
    </svg>
  );
}

function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="pb-24 md:pb-32">
      <div className={container}>
        <Line className="mb-24 md:mb-32" />
        <div className="mb-12 grid gap-4 md:mb-20 md:grid-cols-12">
          <p data-anim="up" className={`${label} md:col-span-3 md:pt-4`}>
            {eyebrow}
          </p>
          <div data-anim="up" data-delay="0.1" className="md:col-span-9">
            <h2 id={`${id}-title`} aria-label={title} data-scramble className="text-4xl font-medium tracking-tight md:text-6xl">
              {title}
            </h2>
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

function Marquee({ words }: { words: string[] }) {
  const half = [...words, ...words];
  return (
    <div aria-hidden="true" className="overflow-hidden border-t border-line py-6 md:py-10">
      <div data-marquee className="flex w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {half.map((w, i) => (
              <span key={i} className="flex items-center">
                <span
                  className={`whitespace-nowrap px-6 text-5xl font-medium tracking-tight md:px-10 md:text-8xl ${
                    i % 2 ? 'text-transparent [-webkit-text-stroke:1px_var(--color-muted)]' : ''
                  }`}
                >
                  {w}
                </span>
                <span className="size-2 rounded-full bg-accent md:size-3" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function HomePage({ lang }: { lang: Lang }) {
  const t = dictionaries[lang];
  const whatsapp = links.whatsapp(t.whatsappMessage);
  const hasProjects = projects.length > 0;

  return (
    <>
      <Motion />
      <Header t={t} lang={lang} hasProjects={hasProjects} />

      <main>
        {/* Hero */}
        <section id="top" data-hero-section className="flex min-h-svh flex-col justify-end overflow-hidden pb-12 pt-28 md:pb-16">
          <div data-hero-inner className={container}>
            <p data-hero-kicker data-anim="hero" className={label}>
              {t.hero.kicker}
            </p>

            <ParticleName
              words={['Giovanni', 'Sanches']}
              className="text-[clamp(3.25rem,17vw,14rem)] font-semibold uppercase leading-[0.86] tracking-[-0.045em]"
            />

            <div data-hero-rule data-anim="hero" aria-hidden="true" className="mt-10 h-px origin-left bg-line md:mt-14" />

            <div className="grid gap-10 pt-8 md:grid-cols-12 md:items-end">
              <p data-hero-lead data-anim="hero" className="max-w-xl text-lg leading-relaxed text-fg/85 md:col-span-6 md:text-xl">
                {t.hero.lead}
              </p>

              <div className="flex flex-col gap-5 md:col-span-6 md:items-end">
                <p data-hero-fade data-anim="hero" className="flex items-center gap-2 text-sm text-muted">
                  <span aria-hidden="true" className="relative flex size-1.5">
                    <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60" />
                    <span className="relative size-1.5 rounded-full bg-accent" />
                  </span>
                  {t.hero.availability}
                </p>
                <div data-hero-fade data-anim="hero" className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-magnetic
                    className={`${fillButton} h-12 bg-fg px-6 text-sm font-medium text-bg before:bg-accent`}
                  >
                    <span className="relative">
                      <Roll>{t.hero.ctaPrimary}</Roll>
                    </span>
                    <Arrow className="relative transition-transform duration-500 ease-out-expo group-hover:rotate-45" />
                  </a>
                  <a
                    href="#services"
                    data-magnetic
                    className={`${fillButton} h-12 border border-line px-6 text-sm hover:text-bg before:bg-fg`}
                  >
                    <span className="relative">
                      <Roll>{t.hero.ctaSecondary}</Roll>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Marquee words={t.services.items.map((s) => s.title)} />

        {/* Services */}
        <Section id="services" eyebrow={t.services.label} title={t.services.title}>
          <Line />
          <ul>
            {t.services.items.map((s) => (
              <li key={s.title} className="relative">
                <a
                  href={links.whatsapp(`${t.services.quoteMessage} ${s.title}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-anim="up"
                  className="group relative grid gap-6 py-10 md:grid-cols-12 md:py-14 before:absolute before:inset-x-[-1rem] before:inset-y-0 before:origin-bottom before:scale-y-0 before:bg-fg/[0.035] before:transition-transform before:duration-700 before:ease-out-expo hover:before:scale-y-100"
                >
                  <span className="relative flex items-start justify-between gap-4 md:col-span-4 md:col-start-4">
                    <span className="text-2xl font-medium tracking-tight transition-[color,translate] duration-700 ease-out-expo group-hover:translate-x-3 group-hover:text-accent md:text-4xl">
                      {s.title}
                    </span>
                  </span>
                  <span className="relative block md:col-span-5">
                    <span className="block text-lg leading-relaxed text-muted">{s.desc}</span>
                    <span className="mt-6 grid gap-2.5 text-sm text-fg/85">
                      {s.deliverables.map((d, i) => (
                        <span
                          key={d}
                          style={{ transitionDelay: `${i * 60}ms` }}
                          className="flex items-baseline gap-3 transition-transform duration-700 ease-out-expo group-hover:translate-x-2 before:block before:h-px before:w-3 before:shrink-0 before:translate-y-[-0.3em] before:bg-accent before:transition-[width] before:duration-700 group-hover:before:w-6"
                        >
                          {d}
                        </span>
                      ))}
                    </span>
                    <span className="mt-8 inline-flex items-center gap-2 text-sm text-accent opacity-0 transition-[opacity,translate] duration-700 ease-out-expo group-hover:translate-x-1 group-hover:opacity-100 max-md:opacity-100">
                      {t.services.quote}
                      <Arrow />
                    </span>
                  </span>
                </a>
                <Line />
              </li>
            ))}
          </ul>
          <p data-anim="up" className="mt-10 max-w-xl text-muted md:ml-[25%]">
            {t.services.note}
          </p>
        </Section>

        {/* Work — only rendered once there is at least one project in lib/projects.ts */}
        {hasProjects && (
          <Section id="work" eyebrow={t.work.label} title={t.work.title}>
            <ProjectShowcase projects={projects} lang={lang} visitLabel={t.work.visit} />
          </Section>
        )}

        {/* About */}
        <Section id="about" eyebrow={t.about.label} title={t.about.title}>
          <div className="grid gap-12 md:grid-cols-12">
            <div data-anim="clip" className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-sm md:col-span-4 md:max-w-none">
              <HalftonePortrait src="/giovanni-portrait.png" alt={t.about.photoAlt} width={571} height={1024} />
            </div>

            <div className="md:col-span-7 md:col-start-6">
              <div className="space-y-6 text-lg leading-relaxed md:text-2xl md:leading-snug">
                {t.about.paragraphs.map((p) => (
                  <p key={p} data-anim="words">
                    {p}
                  </p>
                ))}
              </div>

              <div className="mt-14">
                <Line />
                <p data-anim="up" className={`${label} mt-6`}>
                  {t.about.stackLabel}
                </p>
                <ul data-anim="stagger" className="mt-5 flex flex-wrap gap-2">
                  {stack.map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-line px-3.5 py-1.5 text-sm text-fg/85 transition-colors duration-300 hover:border-accent hover:text-accent"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={links.cv}
                download
                data-magnetic
                data-anim="up"
                className={`${fillButton} mt-10 h-12 border border-line px-6 text-sm hover:text-bg before:bg-fg`}
              >
                <span className="relative">
                  <Roll>{t.about.cv}</Roll>
                </span>
                <svg aria-hidden="true" viewBox="0 0 16 16" className="relative size-4 transition-transform duration-500 ease-out-expo group-hover:translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M8 3v9M4 8.5 8 12.5l4-4M3 14h10" />
                </svg>
              </a>
            </div>
          </div>
        </Section>

        {/* Education */}
        <Section id="education" eyebrow={t.education.label} title={t.education.title}>
          <Line />
          <ul>
            {t.education.items.map((e) => (
              <li key={e.title}>
                <div data-anim="up" className="group grid gap-2 py-7 md:grid-cols-12 md:items-baseline md:gap-6">
                  <span className="font-mono text-xs text-muted md:col-span-3">{e.period}</span>
                  <div className="md:col-span-6">
                    <h3 className="text-xl font-medium transition-transform duration-700 ease-out-expo group-hover:translate-x-2 md:text-2xl">
                      {e.title}
                    </h3>
                    <p className="mt-1 text-muted">{e.place}</p>
                  </div>
                  <span className="text-sm text-muted md:col-span-3 md:text-right">{e.status}</span>
                </div>
                <Line />
              </li>
            ))}
          </ul>

          <div className="mt-12 grid gap-4 md:grid-cols-12">
            <p data-anim="up" className={`${label} md:col-span-3`}>
              {t.education.languagesLabel}
            </p>
            <ul data-anim="stagger" className="flex flex-wrap gap-x-10 gap-y-2 md:col-span-9">
              {t.education.languages.map((l) => (
                <li key={l.name}>
                  {l.name} <span className="text-muted">— {l.level}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* Contact */}
        <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden pb-10">
          <DotField />
          <div className={`${container} relative`}>
            <Line className="mb-24 md:mb-36" />
            <p data-anim="up" className={label}>
              {t.contact.label}
            </p>
            <h2
              id="contact-title"
              data-anim="lines"
              className="mt-6 max-w-5xl text-[clamp(2.5rem,7vw,6.5rem)] font-medium leading-[0.98] tracking-[-0.035em]"
            >
              {t.contact.title}
            </h2>
            <p data-anim="up" className="mt-8 max-w-xl text-lg text-muted">
              {t.contact.sub}
            </p>

            <div data-anim="up" className="mt-10">
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                data-magnetic
                className={`${fillButton} h-16 bg-fg px-9 text-base font-medium text-bg before:bg-accent`}
              >
                <span className="relative">
                  <Roll>{t.contact.cta}</Roll>
                </span>
                <Arrow className="relative transition-transform duration-500 ease-out-expo group-hover:rotate-45" />
              </a>
            </div>

            <div className="mt-20 grid gap-4 md:grid-cols-12">
              <p data-anim="up" className={`${label} md:col-span-3 md:pt-5`}>
                {t.contact.channels}
              </p>
              <ul className="md:col-span-9">
                <Line />
                {[
                  { label: 'E-mail', value: links.email, href: `mailto:${links.email}` },
                  { label: 'LinkedIn', value: 'giovanni-sanches', href: links.linkedin },
                  { label: 'GitHub', value: 'OG1nk4', href: links.github },
                ].map((c) => (
                  <li key={c.label}>
                    <a
                      href={c.href}
                      target={c.href.startsWith('mailto:') ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      data-anim="up"
                      className="group relative flex min-h-16 items-center justify-between gap-4 py-4 before:absolute before:inset-y-0 before:left-0 before:w-full before:origin-left before:scale-x-0 before:bg-fg/[0.04] before:transition-transform before:duration-700 before:ease-out-expo hover:before:scale-x-100"
                    >
                      <span className="relative text-muted transition-[color,translate] duration-700 ease-out-expo group-hover:translate-x-3 group-hover:text-fg">
                        {c.label}
                      </span>
                      <span className="relative flex min-w-0 items-center gap-3 pr-1">
                        <span className="truncate text-lg transition-colors duration-500 group-hover:text-accent">{c.value}</span>
                        <Arrow className="shrink-0 transition-transform duration-500 ease-out-expo group-hover:rotate-45 group-hover:text-accent" />
                      </span>
                    </a>
                    <Line />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="overflow-hidden pt-16">
        <p
          aria-hidden="true"
          data-anim="chars-scrub"
          className="whitespace-nowrap text-center text-[11.2vw] font-semibold uppercase leading-[0.8] tracking-[-0.05em] text-fg/90"
        >
          Giovanni Sanches
        </p>
        <div className={`${container} mt-10 flex flex-col gap-2 border-t border-line py-8 font-mono text-xs text-muted sm:flex-row sm:justify-between`}>
          <span>© {new Date().getFullYear()} Giovanni Sanches</span>
          <span>{t.footer.location}</span>
        </div>
      </footer>
    </>
  );
}
