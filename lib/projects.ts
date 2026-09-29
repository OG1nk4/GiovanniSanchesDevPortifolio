import type { Lang } from './content';

export type Project = {
  title: string;
  /** Short description per language. */
  description: Record<Lang, string>;
  /** Image in /public, e.g. '/projects/nome.webp' (ideal 16:10, ~1600px wide). */
  image: string;
  /** Live site or repository (optional: without it the row is not a link). */
  href?: string;
  /** Short label shown in the first column, e.g. the year or the category. */
  year: string | Record<Lang, string>;
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
export const projects: Project[] = [
  {
    title: "NutriAI",
    description: {
      pt: "App full-stack de saúde com reconhecimento de imagem por IA, cálculo automático de calorias e chat com histórico em tempo real.",
      en: "Full-stack health app with AI image recognition, automatic calorie calculation and real-time chat history.",
    },
    image: '/projects/nutriai.webp',
    year: { pt: 'FULL-STACK · IA', en: 'FULL-STACK · AI' },
    stack: ["Next.js", "Node.js", "Supabase", "Machine Learning"],
  },
  {
    title: "Agregador de Vagas TI",
    description: {
      pt: "Aplicação Python que coleta, centraliza e exibe vagas de TI atualizadas de várias plataformas via web scraping.",
      en: "Python app that collects, centralizes and displays IT jobs from multiple platforms via web scraping.",
    },
    image: '/projects/vagas-ti.webp',
    year: { pt: 'AUTOMAÇÃO · SCRAPING', en: 'AUTOMATION · SCRAPING' },
    stack: ["Python", "BeautifulSoup", "Flask"],
  },
  {
    title: "Sorteios Automáticos",
    description: {
      pt: "Plataforma para campanhas promocionais com pagamento automatizado via Pix, painel administrativo e acompanhamento ao vivo.",
      en: "Platform for promotional campaigns with automated Pix payments, admin panel and live tracking.",
    },
    image: '/projects/sorteios.webp',
    year: "FINTECH · PIX",
    stack: ["Next.js", "Node.js", "Pix API"],
  },
  {
    title: "Chatbot IA para ONG",
    description: {
      pt: "Chatbot para uma ONG que organiza a comunicação com investidores, doadores e colaboradores.",
      en: "Chatbot for an NGO that organizes communication with investors, donors and collaborators.",
    },
    image: '/projects/chatbot-ong.webp',
    year: { pt: 'IA · ONG', en: 'AI · NGO' },
    stack: ["Python", "Machine Learning", "n8n"],
  },
  {
    title: "Gestão de Tarefas",
    description: {
      pt: "App Android nativo para organização de tarefas em equipe, com sincronização e notificações.",
      en: "Native Android app for team task organization with sync and notifications.",
    },
    image: '/projects/tarefas.webp',
    year: "MOBILE · ANDROID",
    stack: ["Java", "Android", "MySQL"],
  },
  {
    title: "Redes Neurais",
    description: {
      pt: "Redes neurais para reconhecimento de imagem e processamento de linguagem natural, com pipelines de treinamento.",
      en: "Neural networks for image recognition and natural language processing, with training pipelines.",
    },
    image: '/projects/redes-neurais.webp',
    year: "ML · NLP",
    stack: ["Python", "PyTorch", "NLP"],
  },
];
