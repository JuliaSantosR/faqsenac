import { Link } from 'react-router';
import { SearchBar } from '../components/SearchBar';
import { HelpCircle, FileText, MessageCircle, Calendar, DollarSign, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export function Home() {
  const faqCategories = [
    {
      icon: FileText,
      title: 'Matrícula',
      description: 'Dúvidas sobre processo de matrícula e documentação',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Clock,
      title: 'Horários',
      description: 'Informações sobre horários de aula e funcionamento',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: DollarSign,
      title: 'Financeiro',
      description: 'Mensalidades, boletos e formas de pagamento',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: Calendar,
      title: 'Calendário',
      description: 'Datas importantes, feriados e eventos',
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  const recentAnnouncements = [
    {
      title: 'Recesso de Meio de Ano',
      date: '20/03/2026',
      description: 'Informamos que haverá recesso escolar de 01 a 07 de julho.',
    },
    {
      title: 'Reunião de Pais',
      date: '18/03/2026',
      description: 'Reunião de pais e responsáveis no dia 30/03 às 19h.',
    },
    {
      title: 'Novo Portal do Aluno',
      date: '15/03/2026',
      description: 'Já está disponível a nova versão do Portal do Aluno com mais funcionalidades.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl mb-4">Central de Ajuda</h1>
            <p className="text-xl text-blue-100 mb-8">
              Encontre respostas rápidas para suas dúvidas
            </p>
          </div>
          <SearchBar />
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl text-gray-900">Categorias de Dúvidas</h2>
          <Link
            to="/faq"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            Ver todas
            <HelpCircle className="w-5 h-5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {faqCategories.map((category) => (
            <Link key={category.title} to="/faq" className="group">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-3`}>
                    <category.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="group-hover:text-blue-600 transition-colors">
                    {category.title}
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Announcements */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl text-gray-900">Comunicados Recentes</h2>
          <Link
            to="/comunicados"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            Ver todos
            <FileText className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentAnnouncements.map((announcement, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">{announcement.date}</span>
                </div>
                <CardTitle className="text-lg">{announcement.title}</CardTitle>
                <CardDescription>{announcement.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Access */}
      <section className="bg-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl text-gray-900 mb-3">
              Precisa de Ajuda Rápida?
            </h2>
            <p className="text-gray-600">
              Use nosso chatbot inteligente para respostas instantâneas
            </p>
          </div>
          
          <div className="flex justify-center">
            <Link
              to="/chatbot"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg flex items-center gap-2 transition-colors shadow-lg"
            >
              <MessageCircle className="w-6 h-6" />
              Abrir Chatbot
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
