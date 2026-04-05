import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export function Comunicados() {
  const announcements = [
    {
      id: 1,
      title: 'Recesso de Meio de Ano',
      date: '20/03/2026',
      category: 'Calendário',
      priority: 'high',
      description:
        'Informamos que haverá recesso escolar de 01 a 07 de julho de 2026. As aulas serão retomadas no dia 08 de julho.',
      details:
        'Durante o período de recesso, a secretaria funcionará em horário reduzido (8h às 14h). Em caso de urgência, utilize o e-mail contato@instituicao.edu.br ou o telefone de plantão disponível no portal.',
    },
    {
      id: 2,
      title: 'Reunião de Pais - 1º Bimestre',
      date: '18/03/2026',
      category: 'Evento',
      priority: 'high',
      description:
        'Reunião de pais e responsáveis para apresentação dos resultados do 1º bimestre no dia 30/03 às 19h.',
      details:
        'A reunião será realizada nas dependências da instituição. É importante a presença de pelo menos um responsável por aluno. Serão apresentados os resultados acadêmicos e comportamentais, além de informações sobre o próximo bimestre.',
    },
    {
      id: 3,
      title: 'Novo Portal do Aluno',
      date: '15/03/2026',
      category: 'Sistema',
      priority: 'medium',
      description:
        'Já está disponível a nova versão do Portal do Aluno com interface renovada e mais funcionalidades.',
      details:
        'O novo portal conta com: visualização de notas em tempo real, área de mensagens com professores, calendário integrado, boletos digitais, acompanhamento de frequência e muito mais. Acesse com seu login e senha habituais.',
    },
    {
      id: 4,
      title: 'Feriado - Corpus Christi',
      date: '10/03/2026',
      category: 'Calendário',
      priority: 'low',
      description:
        'Não haverá aula no dia 19/06/2026 (quinta-feira) devido ao feriado de Corpus Christi.',
      details:
        'As aulas serão normalmente retomadas na sexta-feira, dia 20/06. A instituição estará fechada no dia do feriado.',
    },
    {
      id: 5,
      title: 'Campanha de Vacinação',
      date: '08/03/2026',
      category: 'Saúde',
      priority: 'medium',
      description:
        'Campanha de vacinação contra gripe será realizada na instituição nos dias 25 e 26/03.',
      details:
        'A vacinação é gratuita e aberta para todos os alunos, professores e funcionários. É necessário apresentar carteira de vacinação. A equipe da Secretaria Municipal de Saúde estará presente das 9h às 16h.',
    },
    {
      id: 6,
      title: 'Prazo para Renovação de Matrícula',
      date: '05/03/2026',
      category: 'Matrícula',
      priority: 'high',
      description:
        'O prazo para renovação de matrícula para 2027 vai até 30/11/2026.',
      details:
        'A renovação deve ser feita através do Portal do Aluno. Após o prazo, as vagas poderão ser disponibilizadas para novos alunos. Em caso de dúvidas, procure a secretaria.',
    },
  ];

  const priorityColors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200',
  };

  const priorityLabels = {
    high: 'Urgente',
    medium: 'Importante',
    low: 'Informativo',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertCircle className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl md:text-4xl text-gray-900">Comunicados</h1>
          </div>
          <p className="text-gray-600 text-center">
            Fique por dentro das novidades e informações importantes
          </p>
        </div>
      </section>

      {/* Announcements List */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-500">{announcement.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{announcement.category}</Badge>
                    <Badge
                      className={priorityColors[announcement.priority as keyof typeof priorityColors]}
                      variant="outline"
                    >
                      {priorityLabels[announcement.priority as keyof typeof priorityLabels]}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-xl md:text-2xl">{announcement.title}</CardTitle>
                <CardDescription className="text-base">{announcement.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{announcement.details}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Quer receber notificações?</h3>
              <p className="text-gray-700 mb-3">
                Configure suas preferências no Portal do Aluno para receber comunicados por e-mail
                ou SMS.
              </p>
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
              >
                Configurar notificações →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
