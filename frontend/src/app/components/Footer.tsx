import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router';
import {
  ADDRESS,
  EMAIL,
  INSTITUTION_NAME,
  PHONE,
  SITE_NAME,
} from '../constants/site';

export function Footer() {
  return (
    <footer id="contato" className="mt-auto bg-[#0B1629] text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">{SITE_NAME}</h3>
            <p className="text-sm leading-relaxed text-gray-400">
              {INSTITUTION_NAME}. Central de ajuda dedicada a candidatos do Programa Senac de
              Gratuidade.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Links úteis</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/faq" className="text-gray-400 transition-colors hover:text-white">
                  Perguntas frequentes
                </Link>
              </li>
              <li>
                <Link
                  to="/comunicados"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  Comunicados
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 transition-colors hover:text-white">
                  Portal da Transparência
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 transition-colors hover:text-white">
                  Privacidade
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Endereço</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
                <span>{ADDRESS}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0 text-gray-500" />
                <a href={`tel:${PHONE.replace(/\D/g, '')}`} className="hover:text-white">
                  {PHONE}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0 text-gray-500" />
                <a href={`mailto:${EMAIL}`} className="hover:text-white">
                  {EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 sm:flex-row">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} {INSTITUTION_NAME}. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Instagram" className="text-gray-500 hover:text-white">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Facebook" className="text-gray-500 hover:text-white">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-gray-500 hover:text-white">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
