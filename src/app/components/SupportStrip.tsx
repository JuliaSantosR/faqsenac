import { MessageCircle } from 'lucide-react';
import { WHATSAPP_HOURS, WHATSAPP_URL } from '../constants/site';

export function SupportStrip() {
  return (
    <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl bg-[#E8F8EF] px-6 py-5 sm:flex-row">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#25D366]">
          <MessageCircle className="h-6 w-6 text-white" />
        </div>
        <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
          Não encontrou sua resposta? Fale com a secretaria pelo WhatsApp — {WHATSAPP_HOURS}.
        </p>
      </div>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex flex-shrink-0 items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-[#1fb855]"
      >
        <MessageCircle className="h-5 w-5" />
        Chamar no WhatsApp
      </a>
    </div>
  );
}
