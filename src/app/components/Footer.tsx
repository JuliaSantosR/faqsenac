import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contato */}
          <div>
            <h3 className="font-bold text-white mb-4">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p>(11) 1234-5678</p>
                  <p>(11) 98765-4321</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p>contato@instituicao.edu.br</p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p>Rua da Educação, 123<br />São Paulo - SP</p>
              </div>
            </div>
          </div>

          {/* Horário de Atendimento */}
          <div>
            <h3 className="font-bold text-white mb-4">Horário de Atendimento</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p>Segunda a Sexta: 8h às 18h</p>
                  <p>Sábado: 8h às 12h</p>
                </div>
              </div>
            </div>
          </div>

          {/* Links Úteis */}
          <div>
            <h3 className="font-bold text-white mb-4">Links Úteis</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Portal do Aluno
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Área do Responsável
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Calendário Acadêmico
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Política de Privacidade
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} Instituição Educacional. Todos os direitos reservados.</p>
          <p className="mt-2 text-gray-400">
            Os conteúdos publicados são de responsabilidade dos administradores do sistema.
          </p>
        </div>
      </div>
    </footer>
  );
}
