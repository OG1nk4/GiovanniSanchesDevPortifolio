import Image from 'next/image';
import { dictionaries, links, stack, type Lang } from '@/lib/content';
import { projects } from '@/lib/projects';
import { Header } from './Header';
import { ProjectShowcase } from './ProjectShowcase';
import { ScrambleText } from './ScrambleText';

const container = 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10';

function Section({
  id,
  label,
  title,
  children,
}: {
  id: string;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="border-t border-line py-24 md:py-32">
      <div className={container}>
        <div className="mb-12 grid gap-4 md:mb-20 md:grid-cols-12">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted md:col-span-3 md:pt-4">{label}</p>
          <div id={`${id}-title`} className="md:col-span-9">
            <ScrambleText as="h2" text={title} className="text-4xl font-medium tracking-tight md:text-6xl" />
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={`size-4 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 12 12 4M5.5 4H12v6.5" />
    </svg>
  );
}

export function HomePage({ lang }: { lang: Lang }) {
  const t = dictionaries[lang];
  const whatsapp = links.whatsapp(t.whatsappMessage);
  const hasProjects = projects.length > 0;

  return (
    <>
      <Header t={t} lang={lang} hasProjects={hasProjects} />

      <main>
        {/* Hero */}
        <section className="flex min-h-svh flex-col justify-end pb-12 pt-28 md:pb-16">
          <div className={container}>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{t.hero.kicker}</p>

            <h1
              aria-label="Giovanni Sanches"
              className="mt-6 text-[clamp(3.25rem,17vw,14rem)] font-semibold uppercase leading-[0.86] tracking-[-0.045em]"
            >
              <ScrambleText text="Giovanni" trigger="mount" duration={1100} className="block" />
              <ScrambleText text="Sanches" trigger="mount" duration={1100} delay={150} className="block" />
            </h1>

            <div className="mt-10 grid gap-10 border-t border-line pt-8 md:mt-14 md:grid-cols-12 md:items-end">
              <p className="max-w-xl text-lg leading-relaxed text-fg/85 md:col-span-6 md:text-xl">{t.hero.lead}</p>

              <div className="flex flex-col gap-5 md:col-span-6 md:items-end">
                <p className="flex items-center gap-2 text-sm text-muted">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                  {t.hero.availability}
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-fg px-6 text-sm font-medium text-bg transition-colors hover:bg-accent"
                  >
                    {t.hero.ctaPrimary}
                    <Arrow className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                  <a
                    href="#services"
                    className="inline-flex h-12 items-center justify-center rounded-full border border-line px-6 text-sm transition-colors hover:border-fg"
                  >
                    {t.hero.ctaSecondary}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <Section id="services" label={t.services.label} title={t.services.title}>
          <ul className="border-t border-line">
            {t.services.items.map((s) => (
              <li key={s.title} className="group grid gap-6 border-b border-line py-10 md:grid-cols-12 md:py-14">
                <h3 className="text-2xl font-medium tracking-tight transition-colors duration-300 group-hover:text-accent md:col-span-4 md:col-start-4 md:text-4xl">
                  {s.title}
                </h3>
                <div className="md:col-span-5">
                  <p className="text-lg leading-relaxed text-muted">{s.desc}</p>
                  <ul className="mt-6 grid gap-2.5 text-sm text-fg/85">
                    {s.deliverables.map((d) => (
                      <li key={d} className="flex items-baseline gap-3 before:block before:h-px before:w-3 before:shrink-0 before:translate-y-[-0.3em] before:bg-accent">
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-xl text-muted md:ml-[25%]">{t.services.note}</p>
        </Section>

        {/* Work — only rendered once there is at least one project in lib/projects.ts */}
        {hasProjects && (
          <Section id="work" label={t.work.label} title={t.work.title}>
            <ProjectShowcase projects={projects} lang={lang} visitLabel={t.work.visit} />
          </Section>
        )}

        {/* About */}
        <Section id="about" label={t.about.label} title={t.about.title}>
          <div className="grid gap-12 md:grid-cols-12">
            <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-sm md:col-span-4 md:max-w-none">
              <Image
                src="/giovanni-portrait.png"
                alt={t.about.photoAlt}
                fill
                sizes="(min-width: 768px) 30vw, 90vw"
                className="object-cover object-top"
              />
            </div>

            <div className="md:col-span-7 md:col-start-6">
              <div className="space-y-6 text-lg leading-relaxed text-fg/85 md:text-xl">
                {t.about.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>

              <div className="mt-12 border-t border-line pt-6">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{t.about.stackLabel}</p>
                <p className="mt-4 leading-loose text-fg/85">{stack.join('  /  ')}</p>
              </div>

              <a
                href={links.cv}
                download
                className="mt-10 inline-flex h-12 items-center gap-2 rounded-full border border-line px-6 text-sm transition-colors hover:border-fg"
              >
                {t.about.cv}
                <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M8 3v9M4 8.5 8 12.5l4-4M3 14h10" />
                </svg>
              </a>
            </div>
          </div>
        </Section>

        {/* Education */}
        <Section id="education" label={t.education.label} title={t.education.title}>
          <ul className="border-t border-line">
            {t.education.items.map((e) => (
              <li key={e.title} className="grid gap-2 border-b border-line py-7 md:grid-cols-12 md:items-baseline md:gap-6">
                <span className="font-mono text-xs text-muted md:col-span-3">{e.period}</span>
                <div className="md:col-span-6">
                  <h3 className="text-xl font-medium md:text-2xl">{e.title}</h3>
                  <p className="mt-1 text-muted">{e.place}</p>
                </div>
                <span className="text-sm text-muted md:col-span-3 md:text-right">{e.status}</span>
              </li>
            ))}
          </ul>

          <div className="mt-12 grid gap-4 md:grid-cols-12">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted md:col-span-3">{t.education.languagesLabel}</p>
            <ul className="flex flex-wrap gap-x-10 gap-y-2 md:col-span-9">
              {t.education.languages.map((l) => (
                <li key={l.name}>
                  {l.name} <span className="text-muted">— {l.level}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* Contact */}
        <section id="contact" aria-labelledby="contact-title" className="border-t border-line pb-16 pt-24 md:pt-36">
          <div className={container}>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{t.contact.label}</p>
            <div id="contact-title" className="mt-6 max-w-5xl">
              <ScrambleText
                as="h2"
                text={t.contact.title}
                duration={1200}
                className="text-[clamp(2.5rem,7vw,6.5rem)] font-medium leading-[0.95] tracking-[-0.035em]"
              />
            </div>
            <p className="mt-8 max-w-xl text-lg text-muted">{t.contact.sub}</p>

            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-10 inline-flex h-14 items-center gap-3 rounded-full bg-fg px-8 text-base font-medium text-bg transition-colors hover:bg-accent"
            >
              {t.contact.cta}
              <Arrow className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>

            <div className="mt-20 grid gap-4 md:grid-cols-12">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted md:col-span-3 md:pt-5">{t.contact.channels}</p>
              <ul className="border-t border-line md:col-span-9">
                {[
                  { label: 'E-mail', value: links.email, href: `mailto:${links.email}` },
                  { label: 'LinkedIn', value: 'giovanni-sanches', href: links.linkedin },
                  { label: 'GitHub', value: 'OG1nk4', href: links.github },
                ].map((c) => (
                  <li key={c.label} className="border-b border-line">
                    <a
                      href={c.href}
                      target={c.href.startsWith('mailto:') ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      className="group flex min-h-16 items-center justify-between gap-4 py-4 transition-colors hover:text-accent"
                    >
                      <span className="text-muted transition-colors group-hover:text-accent">{c.label}</span>
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="truncate text-lg">{c.value}</span>
                        <Arrow className="shrink-0" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className={`${container} flex flex-col gap-2 border-t border-line py-8 font-mono text-xs text-muted sm:flex-row sm:justify-between`}>
        <span>© {new Date().getFullYear()} Giovanni Sanches</span>
        <span>{t.footer.location}</span>
      </footer>
    </>
  );
}
