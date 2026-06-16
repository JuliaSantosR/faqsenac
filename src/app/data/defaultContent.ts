import type { SiteContent } from '../types/content';

export const defaultSiteContent: SiteContent = {
  home: {
    heroTitle: 'Sua vaga no Senac começa aqui.',
    heroSubtitle:
      'Central de ajuda para candidatos do Programa Senac de Gratuidade (PSG). Para quem tem renda familiar per capita de até 2 salários mínimos.',
    featuredTitle: '',
    featuredDescription: '',
    faqSectionTitle: 'Categorias',
    announcementsSectionTitle: 'Comunicados e avisos',
  },
  faqCategories: [
    {
      id: 'renda',
      label: 'Renda',
      summary: 'Cálculo per capita e limites',
      description: 'Como calcular a renda familiar per capita e quais comprovantes são aceitos.',
      icon: 'DollarSign',
      items: [
        {
          id: 'renda-elegibilidade',
          question: 'Quem pode concorrer a uma bolsa do PSG?',
          answer:
            'Podem concorrer candidatos com renda familiar mensal per capita de até 2 salários mínimos federais, conforme critérios do edital vigente. A triagem é feita pela secretaria com base nos documentos apresentados.',
          imageUrl: '',
          videoUrl: '',
        },
        {
          id: 'renda-calculo',
          question: 'Como faço o cálculo da renda per capita?',
          answer:
            'Some a renda bruta mensal de todos os membros da família que moram na mesma residência e divida pelo número de pessoas. O resultado não pode ultrapassar 2 salários mínimos por pessoa.',
          imageUrl: '',
          videoUrl: '',
        },
        {
          id: 'renda-autonomo',
          question: 'Trabalho como autônomo ou MEI. Como comprovo minha renda?',
          answer:
            'Apresente a autodeclaração de renda assinada, acompanhada de extratos bancários, declaração do Imposto de Renda ou notas fiscais dos últimos meses, conforme orientação do edital.',
          imageUrl: '',
          videoUrl: '',
        },
        {
          id: 'renda-beneficios',
          question: 'Bolsa-família, BPC e benefícios entram no cálculo da renda?',
          answer:
            'Sim. Todos os benefícios e rendimentos recebidos pelos membros da família devem ser considerados no cálculo da renda per capita, incluindo programas sociais.',
          imageUrl: '',
          videoUrl: '',
        },
      ],
    },
    {
      id: 'editais',
      label: 'Editais',
      summary: 'Prazos e regras vigentes',
      description: 'Prazos e regras vigentes dos processos seletivos do PSG.',
      icon: 'FileText',
      items: [
        {
          id: 'editais-onde',
          question: 'Onde encontro o edital do PSG?',
          answer:
            'Os editais são publicados nesta central de ajuda, no site institucional da Faculdade Senac Palhoça e nos comunicados oficiais. Acompanhe as datas de abertura e encerramento.',
          imageUrl: '',
          videoUrl: '',
        },
        {
          id: 'editais-prazos',
          question: 'Quais são os prazos do processo seletivo?',
          answer:
            'Os prazos variam conforme o edital de cada turma (Jovem Aprendiz, Jovem Programador, Ensino Médio). Consulte o comunicado mais recente ou o edital vigente para datas de inscrição, provas e resultado.',
          imageUrl: '',
          videoUrl: '',
        },
        {
          id: 'editais-modalidades',
          question: 'Quais modalidades o PSG oferece em Palhoça?',
          answer:
            'O Programa Senac de Gratuidade em Palhoça contempla as modalidades Jovem Aprendiz, Jovem Programador e Ensino Médio, conforme disponibilidade de vagas em cada edital.',
          imageUrl: '',
          videoUrl: '',
        },
      ],
    },
    {
      id: 'documentacao',
      label: 'Documentação',
      summary: 'RG, CPF e comprovantes',
      description: 'RG, CPF, comprovantes de residência e renda exigidos na triagem.',
      icon: 'FileCheck',
      items: [
        {
          id: 'doc-obrigatorios',
          question: 'Quais documentos devo levar na inscrição?',
          answer:
            'RG e CPF do candidato, comprovante de residência atualizado, comprovantes de renda de todos os membros da família, autodeclaração de renda e termo de compromisso assinado.',
          imageUrl: '',
          videoUrl: '',
        },
        {
          id: 'doc-residencia',
          question: 'Qual comprovante de residência é aceito?',
          answer:
            'São aceitas contas de água, luz, telefone ou correspondência bancária emitidas nos últimos 90 dias, em nome do candidato ou de um responsável que more no mesmo endereço.',
          imageUrl: '',
          videoUrl: '',
        },
        {
          id: 'doc-autodeclaracao',
          question: 'Como preencher a autodeclaração de renda?',
          answer:
            'A autodeclaração deve ser preenchida com a renda bruta mensal de cada membro da família. Baixe o modelo atualizado nos comunicados ou solicite na secretaria.',
          imageUrl: '',
          videoUrl: '',
        },
        {
          id: 'doc-termo',
          question: 'O que é o termo de compromisso?',
          answer:
            'É o documento em que o candidato (ou responsável, se menor) declara ciência das regras do PSG e compromete-se a apresentar informações verdadeiras. Sem ele, a inscrição não é validada.',
          imageUrl: '',
          videoUrl: '',
        },
        {
          id: 'doc-copias',
          question: 'Preciso levar originais ou cópias?',
          answer:
            'Leve os documentos originais para conferência e cópias para entrega. A secretaria pode solicitar cópias autenticadas conforme o edital.',
          imageUrl: '',
          videoUrl: '',
        },
      ],
    },
    {
      id: 'inscricoes',
      label: 'Inscrições',
      summary: 'Passo a passo online',
      description: 'Passo a passo para se inscrever online no processo seletivo.',
      icon: 'ClipboardList',
      items: [
        {
          id: 'inscricao-como',
          question: 'Como faço minha inscrição no PSG?',
          answer:
            'Acesse o portal de inscrições indicado no edital, preencha o formulário com seus dados, anexe os documentos digitalizados e confirme o envio dentro do prazo estabelecido.',
          imageUrl: '',
          videoUrl: '',
        },
        {
          id: 'inscricao-portal',
          question: 'Tive problemas no portal de inscrição. O que fazer?',
          answer:
            'Em caso de instabilidade, aguarde alguns minutos e tente novamente. Se o problema persistir, entre em contato com a secretaria pelo WhatsApp ou e-mail antes do encerramento das inscrições.',
          imageUrl: '',
          videoUrl: '',
        },
        {
          id: 'inscricao-confirmacao',
          question: 'Como sei se minha inscrição foi confirmada?',
          answer:
            'Após o envio, você receberá um comprovante por e-mail. Guarde esse documento. Em caso de dúvida, consulte a secretaria com o número do protocolo.',
          imageUrl: '',
          videoUrl: '',
        },
      ],
    },
    {
      id: 'selecao',
      label: 'Seleção',
      summary: 'Critérios de desempate',
      description: 'Critérios de classificação e desempate no processo seletivo.',
      icon: 'Users',
      items: [
        {
          id: 'selecao-criterios',
          question: 'Como funciona a seleção dos candidatos?',
          answer:
            'A seleção considera a renda per capita, o cumprimento dos requisitos do edital e, quando aplicável, desempenho em provas ou entrevistas. A lista final é publicada nos comunicados oficiais.',
          imageUrl: '',
          videoUrl: '',
        },
        {
          id: 'selecao-desempate',
          question: 'Quais são os critérios de desempate?',
          answer:
            'Em caso de empate, prevalece o candidato com maior idade. Persistindo o empate, a preferência segue a ordem definida no edital vigente (geralmente renda per capita mais baixa).',
          imageUrl: '',
          videoUrl: '',
        },
        {
          id: 'selecao-resultado',
          question: 'Quando e onde vejo o resultado?',
          answer:
            'O resultado é divulgado na data prevista no edital, nesta central de ajuda e no mural de comunicados. Candidatos aprovados recebem orientações sobre matrícula.',
          imageUrl: '',
          videoUrl: '',
        },
      ],
    },
  ],
  announcements: [
    {
      id: 'announcement-1',
      title: 'Abertura de Edital: Jovem Programador 2024',
      date: '2024-01-23',
      category: 'EDITAL',
      priority: 'high',
      description:
        'As inscrições para a nova turma de programação iniciam nesta segunda-feira. Tenha em mãos os comprovantes de residência e de renda.',
      details:
        'Inscrições: 29/01 a 09/02. Prova de lógica: 15/02. Resultado preliminar: 22/02. Matrícula dos aprovados: 26/02 a 01/03.',
    },
    {
      id: 'announcement-2',
      title: 'Prorrogação de Matrícula — Ensino Médio',
      date: '2024-01-22',
      category: 'MATRÍCULA',
      priority: 'medium',
      description:
        'O prazo para entrega física dos documentos foi estendido por mais 48 horas devido à instabilidade no portal.',
      details:
        'O novo prazo encerra às 18h de quinta-feira. Documentos devem ser entregues na secretaria com cópias e originais para conferência.',
    },
    {
      id: 'announcement-3',
      title: 'Guia de Comprovação de Renda atualizado',
      date: '2024-01-20',
      category: 'DOCUMENTAÇÃO',
      priority: 'low',
      description:
        'Baixe o novo PDF explicativo sobre como declarar renda para profissionais autônomos e MEI.',
      details:
        'O guia está disponível na seção de documentação. Candidatos que já se inscreveram podem atualizar a declaração se necessário.',
    },
  ],
};
