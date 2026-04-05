import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Olá! Bem-vindo à Central de Ajuda. Como posso ajudá-lo hoje?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Respostas automáticas simuladas
  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('matrícula') || lowerMessage.includes('matricula')) {
      return 'Para informações sobre matrícula, você precisa apresentar: RG, CPF, comprovante de residência e histórico escolar. O período de matrícula ocorre entre novembro e dezembro. Posso ajudar com mais alguma dúvida?';
    }

    if (lowerMessage.includes('horário') || lowerMessage.includes('horario')) {
      return 'A instituição funciona das 7h às 22h de segunda a sexta, e das 8h às 12h aos sábados. Temos três turnos: Manhã (7h30-12h), Tarde (13h-17h30) e Noite (18h30-22h). Precisa de mais informações?';
    }

    if (lowerMessage.includes('pagamento') || lowerMessage.includes('mensalidade')) {
      return 'Aceitamos pagamento via boleto, débito automático, cartão de crédito (até 12x) e PIX. O vencimento padrão é dia 10 de cada mês. Entre em contato com o financeiro para mais detalhes.';
    }

    if (lowerMessage.includes('bolsa') || lowerMessage.includes('desconto')) {
      return 'Sim! Oferecemos programa de bolsas por mérito acadêmico e apoio social. As inscrições ocorrem semestralmente. Consulte o edital no portal da instituição.';
    }

    if (lowerMessage.includes('contato') || lowerMessage.includes('telefone')) {
      return 'Você pode nos contatar pelos telefones (11) 1234-5678 ou (11) 98765-4321, ou pelo e-mail contato@instituicao.edu.br. Nosso horário de atendimento é de segunda a sexta, das 8h às 18h.';
    }

    if (
      lowerMessage.includes('oi') ||
      lowerMessage.includes('olá') ||
      lowerMessage.includes('ola') ||
      lowerMessage.includes('bom dia') ||
      lowerMessage.includes('boa tarde') ||
      lowerMessage.includes('boa noite')
    ) {
      return 'Olá! Como posso ajudá-lo hoje? Você pode perguntar sobre matrícula, horários, pagamentos, bolsas de estudo ou outros assuntos.';
    }

    if (lowerMessage.includes('obrigado') || lowerMessage.includes('obrigada')) {
      return 'Por nada! Fico feliz em ajudar. Se tiver mais dúvidas, estou aqui! 😊';
    }

    return 'Desculpe, não entendi sua pergunta. Você pode reformular ou escolher um dos temas: Matrícula, Horários, Financeiro, ou Calendário. Ou acesse nossa página de FAQ para mais informações.';
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Adiciona mensagem do usuário
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Simula delay de digitação do bot
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickReplies = [
    'Como faço matrícula?',
    'Qual o horário de funcionamento?',
    'Formas de pagamento',
    'Calendário acadêmico',
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Assistente Virtual</h1>
              <p className="text-sm text-green-600">● Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'bot' ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  {message.sender === 'bot' ? (
                    <Bot className="w-5 h-5 text-white" />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`flex-1 max-w-2xl ${message.sender === 'user' ? 'text-right' : ''}`}>
                  <div
                    className={`inline-block px-4 py-3 rounded-2xl ${
                      message.sender === 'bot'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 px-2">{formatTime(message.timestamp)}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 2 && (
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-3">Perguntas rápidas:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInputValue(reply);
                    }}
                    className="text-left px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors text-sm"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t py-4 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 transition-colors"
              aria-label="Digite sua mensagem"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="w-12 h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center transition-colors"
              aria-label="Enviar mensagem"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            As respostas são automáticas baseadas no FAQ institucional
          </p>
        </div>
      </div>
    </div>
  );
}
