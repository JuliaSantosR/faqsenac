import { AlertCircle, Calendar, Clock } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useContent } from '../context/ContentContext';

export function Comunicados() {
  const {
    content: { announcements },
  } = useContent();

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

  const sortedAnnouncements = [...announcements].sort((left, right) =>
    right.date.localeCompare(left.date),
  );

  const formatDate = (value: string) =>
    new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR');

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="border-b bg-white py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center justify-center gap-3">
            <AlertCircle className="h-10 w-10 text-blue-600" />
            <h1 className="text-3xl text-gray-900 md:text-4xl">Comunicados</h1>
          </div>
          <p className="text-center text-gray-600">
            Fique por dentro das novidades e informações importantes
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {sortedAnnouncements.length > 0 ? (
            sortedAnnouncements.map((announcement) => (
              <Card key={announcement.id} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="mb-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 flex-shrink-0 text-gray-400" />
                      <span className="text-sm text-gray-500">{formatDate(announcement.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{announcement.category}</Badge>
                      <Badge
                        className={priorityColors[announcement.priority]}
                        variant="outline"
                      >
                        {priorityLabels[announcement.priority]}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-xl md:text-2xl">{announcement.title}</CardTitle>
                  <CardDescription className="text-base">{announcement.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <p className="leading-relaxed text-gray-700">{announcement.details}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                Nenhum comunicado oficial foi publicado até o momento.
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-12 rounded-lg border border-blue-200 bg-blue-50 p-6">
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-6 w-6 flex-shrink-0 text-blue-600" />
            <div>
              <h3 className="mb-2 font-bold text-gray-900">Quer receber notificações?</h3>
              <p className="mb-3 text-gray-700">
                Consulte a secretaria para ativar o recebimento de comunicados por e-mail ou outros
                canais oficiais.
              </p>
              <span className="inline-flex items-center gap-1 font-medium text-blue-600">
                Atendimento disponível em horário comercial.
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
