import { useState } from 'react';
import { SearchBar } from '../components/SearchBar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { FileText, DollarSign, Clock, Calendar, BookOpen, Users } from 'lucide-react';

export function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');

  const faqData = {
    matricula: [
      {
        question: 'Quais documentos são necessários para matrícula?',
        answer: 'Para realizar a matrícula, você precisará dos seguintes documentos: RG e CPF do aluno, Certidão de Nascimento ou Casamento, comprovante de residência atualizado, histórico escolar (para alunos transferidos), 2 fotos 3x4 recentes.',
        image: null,
        video: null,
      },
      {
        question: 'Como faço para renovar a matrícula?',
        answer: 'A renovação de matrícula é feita automaticamente para alunos já matriculados. Você receberá um comunicado por e-mail com as instruções e o prazo para confirmar a renovação através do Portal do Aluno.',
        image: null,
        video: null,
      },
      {
        question: 'Existe período específico para matrícula?',
        answer: 'Sim, o período de matrícula ocorre geralmente entre novembro e dezembro para o ano letivo seguinte. Para novas vagas, consulte a secretaria sobre disponibilidade.',
        image: null,
        video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
    ],
    horarios: [
      {
        question: 'Qual o horário de funcionamento da escola?',
        answer: 'A instituição funciona das 7h às 22h de segunda a sexta-feira, e das 8h às 12h aos sábados. O horário de atendimento da secretaria é das 8h às 18h.',
        image: null,
        video: null,
      },
      {
        question: 'Como são divididos os turnos?',
        answer: 'Temos três turnos: Manhã (7h30 às 12h), Tarde (13h às 17h30) e Noite (18h30 às 22h). Cada período possui intervalos específicos.',
        image: null,
        video: null,
      },
    ],
    financeiro: [
      {
        question: 'Quais são as formas de pagamento?',
        answer: 'Aceitamos pagamento via boleto bancário, débito automático, cartão de crédito (parcelado em até 12x) e PIX. Consulte a secretaria para mais detalhes sobre cada modalidade.',
        image: null,
        video: null,
      },
      {
        question: 'Qual a data de vencimento das mensalidades?',
        answer: 'O vencimento padrão das mensalidades é dia 10 de cada mês. Para alteração da data de vencimento, entre em contato com o setor financeiro.',
        image: null,
        video: null,
      },
      {
        question: 'A instituição oferece bolsas de estudo?',
        answer: 'Sim, oferecemos programa de bolsas de estudo por mérito acadêmico e apoio social. As inscrições ocorrem semestralmente. Consulte o edital no portal da instituição.',
        image: null,
        video: null,
      },
    ],
    calendario: [
      {
        question: 'Onde encontro o calendário acadêmico?',
        answer: 'O calendário acadêmico completo está disponível no Portal do Aluno e também pode ser baixado na seção de Comunicados. Ele contém todas as datas importantes do ano letivo.',
        image: null,
        video: null,
      },
      {
        question: 'Quais são os feriados e recessos previstos?',
        answer: 'A instituição segue o calendário oficial de feriados nacionais e municipais. Também há recesso de meio de ano (julho) e recesso de fim de ano (dezembro/janeiro). Datas específicas são comunicadas com antecedência.',
        image: null,
        video: null,
      },
    ],
  };

  const categories = [
    { id: 'matricula', label: 'Matrícula', icon: FileText },
    { id: 'horarios', label: 'Horários', icon: Clock },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
    { id: 'calendario', label: 'Calendário', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-white border-b py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl text-gray-900 text-center mb-3">
            Perguntas Frequentes
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Encontre respostas para as dúvidas mais comuns
          </p>
          <SearchBar onSearch={setSearchQuery} />
        </div>
      </section>

      {/* FAQ Content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="matricula" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 h-auto">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex items-center gap-2 py-3"
              >
                <category.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{category.label}</span>
                <span className="sm:hidden">{category.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl mb-6 flex items-center gap-2 text-gray-900">
                  <category.icon className="w-6 h-6 text-blue-600" />
                  {category.label}
                </h2>
                
                <Accordion type="single" collapsible className="space-y-4">
                  {faqData[category.id as keyof typeof faqData].map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="border rounded-lg px-6"
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-4">
                        <span className="font-medium text-gray-900">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 pb-4">
                        <p className="mb-4">{faq.answer}</p>
                        
                        {faq.image && (
                          <img
                            src={faq.image}
                            alt="Ilustração"
                            className="rounded-lg max-w-full h-auto mb-4"
                          />
                        )}
                        
                        {faq.video && (
                          <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                            <iframe
                              src={faq.video}
                              title="Vídeo explicativo"
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Help Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-xl mb-3 text-gray-900">Não encontrou o que procura?</h3>
          <p className="text-gray-600 mb-6">
            Entre em contato conosco ou utilize o chatbot para ajuda personalizada
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/chatbot"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Falar com Chatbot
            </a>
            <a
              href="mailto:contato@instituicao.edu.br"
              className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 px-6 py-3 rounded-lg transition-colors"
            >
              Enviar E-mail
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
