import Link from "next/link";
import { useLocale } from "next-intl";

export default function NotFound() {
  const locale = useLocale();

  // Simple localized dictionary for the 404 page
  const content = {
    en: {
      title: "Page not found",
      description: "The page you are looking for doesn't exist or has been moved to a new infrastructure.",
      button: "RETURN TO PLATFORM"
    },
    'es-419': {
      title: "Página no encontrada",
      description: "La página que busca no existe o ha sido movida a una nueva infraestructura.",
      button: "VOLVER A LA PLATAFORMA"
    }
  };

  const t = content[locale as keyof typeof content] || content.en;

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-4 text-center">
      <div className="max-w-xl mx-auto space-y-8 flex flex-col items-center">
        {/* Animated 404 text */}
        <h1 className="text-[8rem] md:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#00E573] to-[#0a0a0a] leading-none tracking-tighter select-none">
          404
        </h1>
        
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            {t.title}
          </h2>
          <p className="text-gray-500 text-lg md:text-xl max-w-md mx-auto leading-relaxed">
            {t.description}
          </p>
        </div>

        <div className="pt-8">
          <Link 
            href={`/${locale}`}
            className="inline-flex items-center gap-2 cursor-pointer bg-[#0a0a0a] text-white px-10 py-4 rounded-full text-[13px] font-bold shadow-lg hover:bg-[#00E573] hover:text-black hover:shadow-[0_0_18px_rgba(0,211,132,0.35)] transition-all duration-300 hover:-translate-y-0.5 tracking-wide"
          >
            {t.button}
            <span className="text-lg leading-none">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
