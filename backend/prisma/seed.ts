import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Iniciando seed do banco de dados...');

  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@senac.local' },
    update: {},
    create: {
      email: 'admin@senac.local',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });
  console.log(`Usuário admin criado: ${admin.email}`);

  const categories = await Promise.all([
    prisma.fAQCategory.upsert({
      where: { label: 'Critérios de Renda' },
      update: {},
      create: {
        label: 'Critérios de Renda',
        description:
          'Informações sobre o critério de renda familiar per capita para participar do PSG.',
      },
    }),
    prisma.fAQCategory.upsert({
      where: { label: 'Editais e Prazos' },
      update: {},
      create: {
        label: 'Editais e Prazos',
        description:
          'Calendário de inscrições, datas de divulgação e vigência dos editais PSG.',
      },
    }),
    prisma.fAQCategory.upsert({
      where: { label: 'Documentação Necessária' },
      update: {},
      create: {
        label: 'Documentação Necessária',
        description:
          'Lista de documentos exigidos para a triagem socioeconômica e matrícula PSG.',
      },
    }),
    prisma.fAQCategory.upsert({
      where: { label: 'Processo de Inscrição' },
      update: {},
      create: {
        label: 'Processo de Inscrição',
        description:
          'Passo a passo para se inscrever em uma das modalidades do PSG.',
      },
    }),
    prisma.fAQCategory.upsert({
      where: { label: 'Critérios de Seleção' },
      update: {},
      create: {
        label: 'Critérios de Seleção',
        description:
          'Como funciona a análise e seleção dos candidatos inscritos no PSG.',
      },
    }),
  ]);
  console.log(`${categories.length} categorias de FAQ criadas.`);

  const [rendaId, editaisId, docId, inscricaoId, selecaoId] = categories.map(
    (c) => c.id,
  );

  await prisma.fAQEntry.createMany({
    skipDuplicates: true,
    data: [
      {
        categoryId: rendaId,
        question: 'Qual é o limite de renda familiar per capita para o PSG?',
        answer:
          'A renda familiar mensal per capita deve ser igual ou inferior a 2 (dois) salários mínimos federais vigentes. O cálculo considera a soma das rendas brutas de todos os moradores do domicílio dividida pelo número de pessoas que vivem na residência.',
      },
      {
        categoryId: rendaId,
        question: 'O que é considerado renda para fins de triagem PSG?',
        answer:
          'São considerados rendimentos: salários, pró-labore, pensão alimentícia, aposentadoria, benefícios previdenciários (INSS), Bolsa Família e outras transferências governamentais, aluguéis recebidos e rendimentos de trabalho informal. Rendas esporádicas são avaliadas individualmente pela equipe de triagem.',
      },
      {
        categoryId: editaisId,
        question: 'Como fico sabendo quando um novo edital PSG é publicado?',
        answer:
          'Os editais são divulgados no site oficial da Faculdade Senac Palhoça, nesta plataforma UniFAQ e nas redes sociais institucionais. Recomendamos acompanhar os comunicados desta página para receber as informações mais atualizadas sobre prazos e vagas disponíveis.',
      },
      {
        categoryId: editaisId,
        question: 'Posso me inscrever após o prazo do edital?',
        answer:
          'Não. As inscrições encerram rigorosamente na data e horário indicados no edital. Não há prorrogação de prazo. Acompanhe os comunicados desta plataforma para não perder as datas de abertura de novas turmas.',
      },
      {
        categoryId: docId,
        question: 'Quais documentos preciso apresentar na triagem socioeconômica?',
        answer:
          'Os documentos básicos exigidos são: RG e CPF do candidato; comprovante de residência atualizado (últimos 3 meses); holerites, contracheques ou declaração de renda dos últimos 3 meses de todos os moradores que possuem renda; Termo de Compromisso assinado; Autodeclaração de Renda preenchida e assinada. Documentos complementares podem ser solicitados pela secretaria.',
      },
      {
        categoryId: docId,
        question: 'Como preencho a Autodeclaração de Renda?',
        answer:
          'A Autodeclaração de Renda é um formulário disponibilizado pela Faculdade Senac Palhoça no momento da triagem. Você deve informar todos os moradores da sua residência, suas idades e as rendas individuais de cada um. O documento deve ser assinado pelo candidato ou pelo responsável legal, caso seja menor de idade. A equipe de triagem pode solicitar documentos comprobatórios adicionais.',
      },
      {
        categoryId: inscricaoId,
        question: 'Como faço para me inscrever no PSG?',
        answer:
          'Acompanhe a publicação do edital correspondente à modalidade desejada (Jovem Aprendiz, Jovem Programador ou Ensino Médio). Durante o período de inscrições, acesse o link indicado no edital, preencha o formulário online com seus dados pessoais e socioeconômicos e aguarde o contato da secretaria para agendar a triagem presencial ou online.',
      },
      {
        categoryId: inscricaoId,
        question: 'Posso me inscrever em mais de uma modalidade do PSG ao mesmo tempo?',
        answer:
          'Não. Cada candidato pode se inscrever em apenas uma modalidade por edital. Caso haja interesse em outra modalidade, o candidato deverá aguardar um novo processo seletivo referente àquela modalidade específica.',
      },
      {
        categoryId: selecaoId,
        question: 'Como é feita a seleção dos candidatos inscritos no PSG?',
        answer:
          'A seleção é realizada em duas etapas: triagem socioeconômica (análise da documentação e verificação do critério de renda) e, quando o número de candidatos aprovados na triagem supera o número de vagas, aplicação de critérios de desempate definidos no edital (como menor renda per capita ou sorteio). Todos os candidatos são comunicados do resultado pelo e-mail informado na inscrição.',
      },
      {
        categoryId: selecaoId,
        question: 'Fui reprovado na triagem. O que devo fazer?',
        answer:
          'Caso não atenda aos critérios do PSG, você pode verificar outras modalidades de bolsa oferecidas pelo Senac. Se acreditar que houve erro na análise, entre em contato com a secretaria da Faculdade Senac Palhoça pelo e-mail institucional ou WhatsApp para solicitar revisão, apresentando a documentação comprobatória.',
      },
    ],
  });
  console.log('10 entradas de FAQ criadas.');

  await prisma.announcement.createMany({
    skipDuplicates: false,
    data: [
      {
        title: 'Abertura de inscrições PSG — Jovem Aprendiz 2025',
        description:
          'Estão abertas as inscrições para o Programa Senac de Gratuidade na modalidade Jovem Aprendiz. Os candidatos devem acessar o formulário disponível no site e apresentar a documentação completa até o prazo indicado no edital. Vagas limitadas.',
      },
      {
        title: 'Resultado da triagem — turma Jovem Programador',
        description:
          'Os candidatos aprovados na triagem socioeconômica da turma Jovem Programador foram notificados por e-mail. Confirmem a matrícula na secretaria dentro do prazo de 5 dias úteis. A lista de espera será acionada conforme as vagas disponíveis.',
      },
      {
        title: 'Atualização nos critérios de renda PSG 2025',
        description:
          'Em função do reajuste do salário mínimo federal, o limite de renda familiar per capita para o PSG foi atualizado. Candidatos com inscrições pendentes de triagem serão avaliados com base no novo valor vigente. Consulte o edital atualizado para mais informações.',
      },
      {
        title: 'Mutirão de triagem — atendimento presencial',
        description:
          'A Faculdade Senac Palhoça realizará um mutirão de triagem socioeconômica para candidatos com documentação pendente. O atendimento ocorrerá na secretaria da unidade. Agendamento prévio obrigatório pelo WhatsApp institucional.',
      },
      {
        title: 'Novo edital PSG — Ensino Médio publicado',
        description:
          'Foi publicado o edital para o Programa Senac de Gratuidade na modalidade Ensino Médio. As inscrições estão abertas a candidatos que atendam ao critério de renda. Acesse a seção de editais para baixar o documento completo com todas as regras e cronograma.',
      },
    ],
  });
  console.log('5 comunicados criados.');

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((error) => {
    console.error('Erro no seed:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
