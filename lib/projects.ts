import type { Lang } from './content';

export type Project = {
  title: string;
  /** Short description per language. */
  description: Record<Lang, string>;
  /** Image in /public, e.g. '/projects/nome.webp' (ideal 16:10, ~1600px wide). */
  image: string;
  /** Live site or repository. */
  href: string;
  year: string;
  stack: string[];
};

/**
 * The "Projetos" section only appears when this list has at least one item.
 * To add a project: put the screenshot in public/projects/ and add an entry here.
 *
 * {
 *   title: 'Nome do projeto',
 *   description: { pt: 'O que é e para quem.', en: 'What it is and who it is for.' },
 *   image: '/projects/nome.webp',
 *   href: 'https://...',
 *   year: '2026',
 *   stack: ['Next.js', 'Supabase'],
 * },
 */
export const projects: Project[] = [];
