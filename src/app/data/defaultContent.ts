import type { SiteContent } from '../types/content';

export const defaultSiteContent: SiteContent = {
  home: {
    heroTitle: 'Central de Ajuda',
    heroSubtitle: 'Encontre respostas rápidas para as principais dúvidas da escola.',
    featuredTitle: 'Atendimento simplificado para famílias e estudantes',
    featuredDescription:
      'Consulte perguntas frequentes, acompanhe comunicados oficiais e use o chatbot para obter apoio inicial a qualquer momento.',
    faqSectionTitle: 'Categorias de Dúvidas',
    announcementsSectionTitle: 'Comunicados Recentes',
    chatbotTitle: 'Precisa de ajuda rápida?',
    chatbotDescription: 'Use nosso chatbot para orientações iniciais e navegue pelo conteúdo oficial.',
    chatbotButtonLabel: 'Abrir Chatbot',
  },
  faqCategories: [
    {
      id: 'matricula',
      label: 'Matrícula',
      description: 'Dúvidas sobre processo de matrícula, renovação e documentação.',
      icon: 'FileText',
      items: [
        {
          id: 'matricula-documentos',
          question: 'Quais documentos são necessários para matrícula?',
          answer:
            'Para realizar a matrícula, apresente RG e CPF do aluno, certidão de nascimento ou casamento, comprovante de residência atualizado, histórico escolar para transferidos e duas fotos 3x4.',
          imageUrl: '',
          videoUrl: '',
        },
        {
          id: 'matricula-renovacao',
          question: 'Como faço para renovar a matrícula?',
          answer:
            'A renovação é feita pela secretaria e confirmada pelo responsável dentro do prazo informado pela escola. Sempre acompanhe os comunicados oficiais para conferir documentos e datas.',
          imageUrl: '',
          videoUrl: '',
        },
        {
          id: 'matricula-periodo',
          question: 'Existe período específico para matrícula?',
          answer:
            'Sim. O período de matrícula costuma ocorrer entre novembro e dezembro para o ano letivo seguinte. Em caso de vagas remanescentes, a secretaria divulga novas orientações.',
          imageUrl: '',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        },
      ],
    },
    {
      id: 'horarios',
      label: 'Horários',
      description: 'Informações sobre horários de aula, funcionamento e atendimento.',
      icon: 'Clock',
      items: [
        {
          id: 'horarios-funcionamento',
          question: 'Qual o horário de funcionamento da escola?',
          answer:
            'A instituição funciona das 7h às 22h de segunda a sexta-feira e das 8h às 12h aos sábados. A secretaria atende das 8h às 18h em dias úteis.',
          imageUrl: '',
          videoUrl: '',
        },
        {
          id: 'horarios-turnos',
          question: 'Como são divididos os turnos?',
          answer:
            'A escola trabalha com três turnos: manhã, tarde e noite. Cada segmento recebe a grade detalhada no início do período letivo.',
          imageUrl: '',
          videoUrl: '',
        },
      ],
    },
    {
      id: 'financeiro',
      label: 'Financeiro',
      description: 'Mensalidades, bolsas, boletos e formas de pagamento.',
      icon: 'DollarSign',
      items: [
        {
          id: 'financeiro-pagamento',
          question: 'Quais são as formas de pagamento?',
          answer:
            'Aceitamos boleto bancário, débito automático, cartão de crédito parcelado e PIX. Em caso de dúvidas, procure o setor financeiro.',
          imageUrl: '',
          videoUrl: '',
        },
        {
          id: 'financeiro-vencimento',
          question: 'Qual a data de vencimento das mensalidades?',
          answer:
            'O vencimento padrão é no dia 10 de cada mês. Solicitações de ajuste podem ser tratadas diretamente com o setor financeiro.',
          imageUrl: '',
          videoUrl: '',
        },
        {
          id: 'financeiro-bolsas',
          question: 'A instituição oferece bolsas de estudo?',
          answer:
            'Sim. Existem programas de bolsas por mérito acadêmico e critérios sociais, conforme edital publicado ao longo do ano.',
          imageUrl: '',
          videoUrl: '',
        },
      ],
    },
    {
      id: 'calendario',
      label: 'Calendário',
      description: 'Datas importantes do ano letivo, recessos e eventos escolares.',
      icon: 'Calendar',
      items: [
        {
          id: 'calendario-onde',
          question: 'Onde encontro o calendário acadêmico?',
          answer:
            'O calendário acadêmico fica disponível nos comunicados oficiais e também pode ser enviado pela secretaria sempre que necessário.',
          imageUrl: '',
          videoUrl: '',
        },
        {
          id: 'calendario-recessos',
          question: 'Quais são os feriados e recessos previstos?',
          answer:
            'A instituição segue o calendário oficial de feriados e comunica recessos com antecedência por meio da página de comunicados.',
          imageUrl: '',
          videoUrl: '',
        },
      ],
    },
  ],
  announcements: [
    {
      id: 'announcement-1',
      title: 'Recesso de Meio de Ano',
      date: '2026-07-01',
      category: 'Calendário',
      priority: 'high',
      description: 'O recesso escolar ocorrerá de 1º a 7 de julho de 2026.',
      details:
        'Durante o período de recesso, a secretaria funcionará em horário reduzido. As aulas serão retomadas normalmente no dia 8 de julho de 2026.',
    },
    {
      id: 'announcement-2',
      title: 'Reunião de Pais',
      date: '2026-03-30',
      category: 'Evento',
      priority: 'high',
      description: 'Encontro com famílias e responsáveis no auditório da escola às 19h.',
      details:
        'A reunião apresenta resultados do bimestre, próximos projetos pedagógicos e orientações sobre acompanhamento escolar.',
    },
    {
      id: 'announcement-3',
      title: 'Novo Portal do Aluno',
      date: '2026-03-15',
      category: 'Sistema',
      priority: 'medium',
      description: 'A nova versão do portal já está disponível com mais serviços digitais.',
      details:
        'O portal reúne notas, frequência, calendário e comunicados em uma interface renovada. O acesso continua com as credenciais habituais.',
    },
  ],
};
