import { MessageCircle } from 'lucide-react';
import { WHATSAPP_HOURS, WHATSAPP_URL } from '../constants/site';

export function SupportWidget() {
  return (
    <aside className="rounded-2xl bg-[#E8F8EF] p-8 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366]">
        <MessageCircle className="h-7 w-7 text-white" />
      </div>

      <h3 className="mb-2 text-xl font-bold text-gray-900">Dúvida rápida?</h3>
      <p className="mb-6 text-sm leading-relaxed text-gray-600">
        Nossa secretaria está online para ajudar você com o processo do PSG.
      </p>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#1fb855]"
      >
        <MessageCircle className="h-5 w-5" />
        Chamar no WhatsApp
      </a>

      <p className="mt-4 text-xs text-gray-500">Atendimento: {WHATSAPP_HOURS}</p>
    </aside>
  );
}
