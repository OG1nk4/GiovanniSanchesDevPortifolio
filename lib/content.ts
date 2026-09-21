export type Lang = 'pt' | 'en';

const WHATSAPP_NUMBER = '5511940658904';

export const links = {
  email: 'ginkasanches@gmail.com',
  github: 'https://github.com/OG1nk4',
  linkedin: 'https://linkedin.com/in/giovanni-sanches-9b3371348/',
  cv: '/cv-giovanni-sanches.pdf',
  whatsapp: (message: string) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
};

export const stack = [
  'TypeScript', 'JavaScript', 'React', 'Next.js', 'Angular', 'Node.js',
  'Python', 'Java', 'Supabase', 'MySQL', 'Docker', 'n8n', 'Git',
];

const pt = {
  meta: {
    title: 'Giovanni Sanches — Desenvolvedor full-stack',
    description:
      'Sites, sistemas web e automações para pequenos negócios e empresas. Desenvolvedor full-stack em Guarulhos, SP.',
  },
  nav: {
    services: 'Serviços',
    work: 'Projetos',
    about: 'Sobre',
    education: 'Formação',
    contact: 'Contato',
    switchLang: 'EN',
    switchLangLabel: 'Read in English',
  },
  whatsappMessage: 'Olá Giovanni, vi seu site e queria conversar sobre um projeto.',
  hero: {
    kicker: 'Desenvolvedor full-stack · Guarulhos, SP',
    lead:
      'Crio sites, sistemas web e automações para pequenos negócios e empresas. Do primeiro rascunho ao site no ar, você fala direto com quem escreve o código.',
    ctaPrimary: 'Pedir orçamento no WhatsApp',
    ctaSecondary: 'Ver serviços',
    availability: 'Agenda aberta para novos projetos',
  },
  services: {
    label: 'Serviços',
    title: 'O que eu faço',
    items: [
      {
        title: 'Sites e landing pages',
        desc: 'Para restaurantes, clínicas, escritórios e lojas que precisam ser encontrados no Google e receber contatos pelo WhatsApp.',
        deliverables: [
          'Layout feito para o seu negócio',
          'Rápido e bem resolvido no celular',
          'Otimizado para aparecer no Google',
          'Domínio e hospedagem configurados',
        ],
      },
      {
        title: 'Sistemas web sob medida',
        desc: 'Para quando planilha e caderno já não dão conta: agendamentos, cadastro de clientes, painéis e áreas restritas.',
        deliverables: [
          'Login e níveis de acesso',
          'Banco de dados com Supabase ou MySQL',
          'Painel administrativo',
          'Pagamentos via Pix',
        ],
      },
      {
        title: 'Automações',
        desc: 'Tarefas repetitivas rodando sozinhas: mensagens, planilhas, relatórios e atendimento.',
        deliverables: [
          'Fluxos no n8n',
          'Scripts em Python',
          'Integração com WhatsApp e Google Sheets',
          'Atendimento com IA',
        ],
      },
    ],
    note: 'Não trabalho com pacote fechado. O orçamento sai depois de uma conversa sobre o que você precisa.',
    quote: 'Pedir orçamento',
    quoteMessage: 'Olá Giovanni, vi seu site e queria um orçamento de:',
  },
  work: {
    label: 'Projetos',
    title: 'Trabalhos recentes',
    visit: 'Abrir projeto',
  },
  about: {
    label: 'Sobre',
    title: 'Quem escreve o código',
    paragraphs: [
      'Sou o Giovanni. Estou no 4º semestre de Análise e Desenvolvimento de Sistemas na Faculdade Eniac, depois de passar pelo técnico em TI. Em 2025 estagiei no próprio Eniac, trabalhando com IA, automação, web e mobile.',
      'No dia a dia uso TypeScript, React e Next.js no front, Node e Supabase no back, e Python quando o assunto é automação ou dados. Prefiro entregar algo pequeno que já funciona e ir melhorando junto com quem usa.',
    ],
    stackLabel: 'Ferramentas',
    cv: 'Baixar currículo (PDF)',
    photoAlt: 'Giovanni Sanches de braços cruzados, vestindo blazer azul-marinho',
  },
  education: {
    label: 'Formação',
    title: 'Trajetória',
    items: [
      { period: '2025 — 2026', title: 'Análise e Desenvolvimento de Sistemas', place: 'Faculdade Eniac · conclusão prevista em dez/2026', status: 'Em curso' },
      { period: '2025', title: 'Estágio em TI', place: 'Centro Universitário Eniac · fev a jul · IA, automação, web e mobile', status: 'Concluído' },
      { period: '2024', title: 'Técnico em TI', place: 'Colégio Eniac', status: 'Concluído' },
    ],
    languagesLabel: 'Idiomas',
    languages: [
      { name: 'Português', level: 'nativo' },
      { name: 'Inglês', level: 'intermediário' },
      { name: 'Espanhol', level: 'básico' },
    ],
  },
  contact: {
    label: 'Contato',
    title: 'Vamos conversar sobre o seu projeto',
    sub: 'Me conta o que você precisa pelo WhatsApp ou por e-mail. Respondo em até um dia útil.',
    cta: 'Chamar no WhatsApp',
    channels: 'Outros canais',
  },
  footer: { location: 'Guarulhos, SP' },
};

export type Dictionary = typeof pt;

const en: Dictionary = {
  meta: {
    title: 'Giovanni Sanches — Full-stack developer',
    description:
      'Websites, web systems and automations for small businesses and companies. Full-stack developer based in Guarulhos, Brazil.',
  },
  nav: {
    services: 'Services',
    work: 'Work',
    about: 'About',
    education: 'Education',
    contact: 'Contact',
    switchLang: 'PT',
    switchLangLabel: 'Ler em português',
  },
  whatsappMessage: 'Hi Giovanni, I saw your website and would like to talk about a project.',
  hero: {
    kicker: 'Full-stack developer · Guarulhos, Brazil',
    lead:
      'I build websites, web systems and automations for small businesses and companies. From the first sketch to launch, you talk directly to the person writing the code.',
    ctaPrimary: 'Get a quote on WhatsApp',
    ctaSecondary: 'See services',
    availability: 'Currently taking new projects',
  },
  services: {
    label: 'Services',
    title: 'What I do',
    items: [
      {
        title: 'Websites and landing pages',
        desc: 'For restaurants, clinics, offices and shops that need to be found on Google and get contacted on WhatsApp.',
        deliverables: [
          'Layout designed for your business',
          'Fast and polished on mobile',
          'Optimized to show up on Google',
          'Domain and hosting set up',
        ],
      },
      {
        title: 'Custom web systems',
        desc: 'For when spreadsheets and notebooks stop being enough: scheduling, customer records, dashboards and private areas.',
        deliverables: [
          'Login and access levels',
          'Database with Supabase or MySQL',
          'Admin dashboard',
          'Pix payments',
        ],
      },
      {
        title: 'Automations',
        desc: 'Repetitive tasks that run on their own: messages, spreadsheets, reports and customer support.',
        deliverables: [
          'n8n workflows',
          'Python scripts',
          'WhatsApp and Google Sheets integrations',
          'AI-assisted support',
        ],
      },
    ],
    note: 'No fixed packages. I quote after we talk about what you need.',
    quote: 'Get a quote',
    quoteMessage: 'Hi Giovanni, I saw your website and would like a quote for:',
  },
  work: {
    label: 'Work',
    title: 'Recent projects',
    visit: 'Open project',
  },
  about: {
    label: 'About',
    title: 'Who writes the code',
    paragraphs: [
      "I'm Giovanni. I'm in the 4th semester of Systems Analysis and Development at Faculdade Eniac, after an IT technical course. In 2025 I interned at Eniac, working on AI, automation, web and mobile.",
      'Day to day I use TypeScript, React and Next.js on the front end, Node and Supabase on the back end, and Python for automation and data. I like shipping something small that works, then improving it together with the people using it.',
    ],
    stackLabel: 'Tools',
    cv: 'Download résumé (PDF)',
    photoAlt: 'Giovanni Sanches with arms crossed, wearing a navy blazer',
  },
  education: {
    label: 'Education',
    title: 'Background',
    items: [
      { period: '2025 — 2026', title: 'Systems Analysis and Development', place: 'Faculdade Eniac · expected Dec 2026', status: 'In progress' },
      { period: '2025', title: 'IT Intern', place: 'Centro Universitário Eniac · Feb to Jul · AI, automation, web and mobile', status: 'Completed' },
      { period: '2024', title: 'IT Technical Course', place: 'Colégio Eniac', status: 'Completed' },
    ],
    languagesLabel: 'Languages',
    languages: [
      { name: 'Portuguese', level: 'native' },
      { name: 'English', level: 'intermediate' },
      { name: 'Spanish', level: 'basic' },
    ],
  },
  contact: {
    label: 'Contact',
    title: "Let's talk about your project",
    sub: 'Tell me what you need on WhatsApp or by email. I reply within one business day.',
    cta: 'Message me on WhatsApp',
    channels: 'Other channels',
  },
  footer: { location: 'Guarulhos, Brazil' },
};

export const dictionaries: Record<Lang, Dictionary> = { pt, en };
