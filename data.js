// ===== i18n + DATA =====
export const I18N = {
  pt: {
    nav: { about: "Sobre", stack: "Stack", work: "Projetos", services: "Serviços", contact: "Contato", cta: "Vamos conversar" },
    hero: {
      role: "FULL-STACK · AI · AUTOMATION",
      typing: [
        { type: "comment", text: "// Inicializando portfólio v3.0..." },
        { type: "code", text: 'const dev = await new Developer({\n  name: "Giovanni Sanches",\n  role: "Full-Stack & AI Engineer",\n  location: "São Paulo, Brasil",\n  status: "available_for_hire"\n});' },
        { type: "comment", text: "// Stack:" },
        { type: "code", text: 'dev.stack(["TypeScript", "React", "Next.js", "Python", "Node", "Llama 3"]);' },
        { type: "comment", text: "// Pronto." },
        { type: "code", text: "dev.shipIt(); ✓" }
      ],
      scroll: "ROLE PARA EXPLORAR"
    },
    about: {
      eyebrow: "01 — Sobre",
      title: ["Construo software com ", "propósito"],
      p1: "Sou estudante de **Análise e Desenvolvimento de Sistemas (4º semestre)** apaixonado por transformar problemas complexos em interfaces e sistemas que funcionam — de verdade.",
      p2: "Meu campo de jogo: **desenvolvimento full-stack**, **inteligência artificial**, **automação com Python** e **front-end com cuidado obsessivo pelos detalhes**. Já levei à produção apps de saúde com IA, agregadores via web scraping, plataformas de pagamento via Pix e chatbots para ONGs.",
      stats: [
        { n: "10+", lbl: "Projetos entregues" },
        { n: "4°", lbl: "Semestre / ADS" },
        { n: "∞", lbl: "Cafés" }
      ],
      meta_a: "GUARULHOS · SP",
      meta_b: "Disponível para projetos"
    },
    stack: {
      eyebrow: "02 — Toolkit",
      title: ["Tecnologias que ", "domino"],
      sub: "Da prototipação rápida até produção escalável — uma stack moderna e pragmática.",
      cats: [
        { num: "01", title: "Linguagens", items: ["TypeScript", "JavaScript", "Python", "Java"] },
        { num: "02", title: "Frontend", items: ["React", "Next.js", "Angular", "HTML / CSS"] },
        { num: "03", title: "Backend & DB", items: ["Node.js", "Supabase", "MySQL", "SQL"] },
        { num: "04", title: "AI & DevOps", items: ["Llama 3 API", "Deep Learning", "Docker", "n8n"] }
      ]
    },
    projects: {
      eyebrow: "03 — Projetos",
      title: ["Trabalhos ", "selecionados"],
      sub: "Cada projeto resolve um problema real. Role lateralmente para explorar.",
      list: [
        {
          tag: "FULL-STACK · IA",
          title: "NutriAI — App de Nutrição",
          desc: "App full-stack de saúde com reconhecimento de imagem por IA, cálculo automático de calorias e chat com histórico em tempo real.",
          stack: ["Next.js", "Node.js", "Supabase", "Llama 3"],
          link: "Ver case"
        },
        {
          tag: "AUTOMATION · SCRAPING",
          title: "Agregador de Vagas TI",
          desc: "Aplicação Python que coleta, centraliza e exibe vagas de TI atualizadas de múltiplas plataformas via web scraping.",
          stack: ["Python", "BeautifulSoup", "Flask"],
          link: "Ver case"
        },
        {
          tag: "FINTECH · PIX",
          title: "Plataforma de Rifa de PC",
          desc: "Site completo para gerenciar rifas com integração de pagamento automatizado via Pix, painel de admin e tracking ao vivo.",
          stack: ["Next.js", "Node", "Pix API"],
          link: "Ver case"
        },
        {
          tag: "AI · ONG",
          title: "Chatbot IA para ONG",
          desc: "Chatbot inteligente para uma ONG, otimizando comunicação com investidores, doadores e colaboradores em escala.",
          stack: ["Python", "Llama 3", "n8n"],
          link: "Ver case"
        },
        {
          tag: "MOBILE · ANDROID",
          title: "Gestão de Tarefas",
          desc: "App Android nativo para organização de tarefas em equipes, com sincronização e notificações inteligentes.",
          stack: ["Java", "Android", "MySQL"],
          link: "Ver case"
        },
        {
          tag: "ML · NLP",
          title: "Redes Neurais",
          desc: "Construção de redes neurais para reconhecimento de imagem e processamento de linguagem natural com pipelines de treinamento.",
          stack: ["Python", "PyTorch", "NLP"],
          link: "Ver case"
        }
      ]
    },
    services: {
      eyebrow: "04 — Serviços",
      title: ["O que posso ", "construir pra você"],
      sub: "Para empresas que querem mover rápido sem sacrificar qualidade.",
      list: [
        { num: "01", t: "Web Apps Full-Stack", d: "Aplicações modernas com Next.js, React e Node — do MVP à produção, com foco em performance e UX." },
        { num: "02", t: "Integrações com IA", d: "LLMs (Llama 3, GPT) integrados ao seu produto: chatbots, busca semântica, classificação e visão computacional." },
        { num: "03", t: "Automações Python", d: "Scripts e pipelines que eliminam trabalho manual: scraping, ETL, automação Office, n8n e workflows custom." },
        { num: "04", t: "Front-end UI/UX", d: "Interfaces que clientes lembram. Animações fluidas, micro-interações e atenção obsessiva aos detalhes." },
        { num: "05", t: "Backend & APIs", d: "APIs REST/GraphQL escaláveis com Node, Supabase e MySQL. Auth, pagamentos (Pix), webhooks." },
        { num: "06", t: "Consultoria Técnica", d: "Code review, arquitetura, escolha de stack e mentoria para times que estão começando." }
      ]
    },
    edu: {
      eyebrow: "05 — Trajetória",
      title: ["Formação & ", "experiência"],
      list: [
        { year: "2026", t: "Análise e Desenvolvimento de Sistemas", p: "Faculdade Eniac — Tecnólogo · Conclusão prevista Dez/2026", status: "Em curso", active: true },
        { year: "2025", t: "Estagiário de TI", p: "Centro Universitário ENIAC · Fev–Jul 2025 · IA, Automação, Web e Mobile", status: "Concluído" },
        { year: "2025", t: "Ensino Médio", p: "Colégio Eniac · Conclusão Dez/2025", status: "Concluído" },
        { year: "2024", t: "Técnico em TI", p: "Colégio Eniac · Concluído Dez/2024", status: "Concluído" }
      ],
      langs_title: "Idiomas",
      langs: [
        { name: "Português", level: "Nativo", pct: 100 },
        { name: "Inglês", level: "Intermediário", pct: 65 },
        { name: "Espanhol", level: "Básico", pct: 30 }
      ],
      tools_title: "Ambientes & Ferramentas",
      tools: ["Git", "VS Code", "Cursor", "Docker", "Android Studio", "n8n", "Antigravity AI"]
    },
    contact: {
      title: ["Vamos ", "construir algo", " juntos."],
      sub: "Aberto a vagas júnior, estágio, freelance e contratos. Resposta em até 24h.",
      cta: "Iniciar conversa",
      channels: [
        { label: "ginkasanches@gmail.com", href: "mailto:ginkasanches@gmail.com", icon: "mail" },
        { label: "+55 11 94065-8904", href: "tel:+5511940658904", icon: "phone" },
        { label: "github.com/OG1nk4", href: "https://github.com/OG1nk4", icon: "github" },
        { label: "LinkedIn", href: "https://linkedin.com/in/giovanni-sanches-9b3371348/", icon: "linkedin" }
      ]
    },
    footer: { left: "© 2026 Giovanni Sanches. Construído com café e cuidado.", right: "Guarulhos / SP / BR" }
  },
  en: {
    nav: { about: "About", stack: "Stack", work: "Work", services: "Services", contact: "Contact", cta: "Let's talk" },
    hero: {
      role: "FULL-STACK · AI · AUTOMATION",
      typing: [
        { type: "comment", text: "// Booting portfolio v3.0..." },
        { type: "code", text: 'const dev = await new Developer({\n  name: "Giovanni Sanches",\n  role: "Full-Stack & AI Engineer",\n  location: "São Paulo, Brazil",\n  status: "available_for_hire"\n});' },
        { type: "comment", text: "// Stack:" },
        { type: "code", text: 'dev.stack(["TypeScript", "React", "Next.js", "Python", "Node", "Llama 3"]);' },
        { type: "comment", text: "// Ready." },
        { type: "code", text: "dev.shipIt(); ✓" }
      ],
      scroll: "SCROLL TO EXPLORE"
    },
    about: {
      eyebrow: "01 — About",
      title: ["I build software with ", "purpose"],
      p1: "I'm a **Computer Systems student (4th semester)** obsessed with turning hard problems into interfaces and systems that actually work.",
      p2: "My playground: **full-stack development**, **artificial intelligence**, **Python automation**, and **front-end with obsessive attention to detail**. Shipped: AI-powered health apps, web-scraping aggregators, Pix payment platforms and chatbots for NGOs.",
      stats: [
        { n: "10+", lbl: "Shipped projects" },
        { n: "4th", lbl: "Semester / CS" },
        { n: "∞", lbl: "Coffees" }
      ],
      meta_a: "GUARULHOS · SP",
      meta_b: "Available for work"
    },
    stack: {
      eyebrow: "02 — Toolkit",
      title: ["Technologies I ", "master"],
      sub: "From rapid prototyping to scalable production — modern, pragmatic stack.",
      cats: [
        { num: "01", title: "Languages", items: ["TypeScript", "JavaScript", "Python", "Java"] },
        { num: "02", title: "Frontend", items: ["React", "Next.js", "Angular", "HTML / CSS"] },
        { num: "03", title: "Backend & DB", items: ["Node.js", "Supabase", "MySQL", "SQL"] },
        { num: "04", title: "AI & DevOps", items: ["Llama 3 API", "Deep Learning", "Docker", "n8n"] }
      ]
    },
    projects: {
      eyebrow: "03 — Work",
      title: ["Selected ", "work"],
      sub: "Each project solves a real problem. Scroll horizontally to explore.",
      list: [
        { tag: "FULL-STACK · AI", title: "NutriAI — Nutrition App", desc: "Full-stack health app with AI image recognition, automatic calorie calculation and real-time chat history.", stack: ["Next.js", "Node.js", "Supabase", "Llama 3"], link: "View case" },
        { tag: "AUTOMATION · SCRAPING", title: "IT Jobs Aggregator", desc: "Python app that collects, centralizes and displays IT jobs from multiple platforms via web scraping.", stack: ["Python", "BeautifulSoup", "Flask"], link: "View case" },
        { tag: "FINTECH · PIX", title: "PC Raffle Platform", desc: "Full site to manage raffles with automated Pix payment integration, admin panel and live tracking.", stack: ["Next.js", "Node", "Pix API"], link: "View case" },
        { tag: "AI · NGO", title: "AI Chatbot for NGO", desc: "Smart chatbot for an NGO, optimizing communication with investors, donors and collaborators at scale.", stack: ["Python", "Llama 3", "n8n"], link: "View case" },
        { tag: "MOBILE · ANDROID", title: "Task Management", desc: "Native Android app for team task organization with sync and smart notifications.", stack: ["Java", "Android", "MySQL"], link: "View case" },
        { tag: "ML · NLP", title: "Neural Networks", desc: "Built neural nets for image recognition and natural language processing with training pipelines.", stack: ["Python", "PyTorch", "NLP"], link: "View case" }
      ]
    },
    services: {
      eyebrow: "04 — Services",
      title: ["What I can ", "build for you"],
      sub: "For companies that want to move fast without sacrificing quality.",
      list: [
        { num: "01", t: "Full-Stack Web Apps", d: "Modern apps with Next.js, React and Node — from MVP to production, focused on performance and UX." },
        { num: "02", t: "AI Integrations", d: "LLMs (Llama 3, GPT) baked into your product: chatbots, semantic search, classification and computer vision." },
        { num: "03", t: "Python Automations", d: "Scripts and pipelines that kill manual work: scraping, ETL, Office automation, n8n and custom workflows." },
        { num: "04", t: "Front-end UI/UX", d: "Interfaces clients remember. Fluid animations, micro-interactions and obsessive attention to detail." },
        { num: "05", t: "Backend & APIs", d: "Scalable REST/GraphQL APIs with Node, Supabase and MySQL. Auth, payments (Pix), webhooks." },
        { num: "06", t: "Tech Consulting", d: "Code review, architecture, stack decisions and mentoring for teams getting started." }
      ]
    },
    edu: {
      eyebrow: "05 — Path",
      title: ["Education & ", "experience"],
      list: [
        { year: "2026", t: "BS in Computer Systems", p: "Eniac University — Technologist · Expected Dec/2026", status: "In progress", active: true },
        { year: "2025", t: "IT Intern", p: "Eniac University Center · Feb–Jul 2025 · AI, Automation, Web & Mobile", status: "Completed" },
        { year: "2025", t: "High School", p: "Eniac College · Completed Dec/2025", status: "Completed" },
        { year: "2024", t: "IT Technical Degree", p: "Eniac College · Completed Dec/2024", status: "Completed" }
      ],
      langs_title: "Languages",
      langs: [
        { name: "Portuguese", level: "Native", pct: 100 },
        { name: "English", level: "Intermediate", pct: 65 },
        { name: "Spanish", level: "Basic", pct: 30 }
      ],
      tools_title: "Tools & Environment",
      tools: ["Git", "VS Code", "Cursor", "Docker", "Android Studio", "n8n", "Antigravity AI"]
    },
    contact: {
      title: ["Let's ", "build something", " together."],
      sub: "Open to junior roles, internships, freelance and contracts. Reply within 24h.",
      cta: "Start the conversation",
      channels: [
        { label: "ginkasanches@gmail.com", href: "mailto:ginkasanches@gmail.com", icon: "mail" },
        { label: "+55 11 94065-8904", href: "tel:+5511940658904", icon: "phone" },
        { label: "github.com/OG1nk4", href: "https://github.com/OG1nk4", icon: "github" },
        { label: "LinkedIn", href: "https://linkedin.com/in/giovanni-sanches-9b3371348/", icon: "linkedin" }
      ]
    },
    footer: { left: "© 2026 Giovanni Sanches. Built with coffee and care.", right: "Guarulhos / SP / BR" }
  }
};

// Removed window assignment for ESM

