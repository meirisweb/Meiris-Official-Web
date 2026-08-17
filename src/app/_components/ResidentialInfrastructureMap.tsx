"use client";

import { useState, useEffect, useRef } from "react";
import CloudinaryVideo from "./CloudinaryVideo";

const markersDataEn = [
  {
    id: 1,
    title: "EV charging is now a buyer question",
    desc: "Buyers increasingly ask about charging at the site visit. Developments that don't offer it are losing ground to those that do — especially in the premium segment.",
    top: "65%",
    left: "7%",
    align: "left"
  },
  {
    id: 2,
    title: "Harder and costlier to add later",
    desc: "Getting charging infrastructure right during construction — conduit runs, switchgear, load planning — costs a fraction of retrofitting it after handover. Most developers don't know what to specify or who to ask at the design stage.",
    top: "61%",
    left: "29%"
  },
  {
    id: 3,
    title: "Who maintains it after handover?",
    desc: "Once the society takes over, who handles the charger that's not working? Developers want to hand off a working, supported asset — not leave a vendor relationship and a maintenance problem for the committee.",
    top: "60%",
    left: "48%"
  },
  {
    id: 4,
    title: "Who pays for what? (RWA)",
    desc: "The hardest problem in multi-unit residential charging is ensuring each resident pays only for their own consumption — without shared metering disputes at the society level.",
    top: "52%",
    left: "75%"
  },
  {
    id: 5,
    title: "Retrofitting in a lived-in building (RWA)",
    desc: "Running cable, mounting switchgear and installing chargers in an occupied building requires careful planning and society buy-in. Poorly planned retrofits cause disruption, delays and committee friction.",
    top: "40%",
    left: "86%",
    align: "right"
  }
];

const markersDataEs = [
  {
    id: 1,
    title: "La carga de VE es ahora una pregunta de los compradores",
    desc: "Los compradores preguntan cada vez más sobre la carga durante la visita al sitio. Los desarrollos que no la ofrecen están perdiendo terreno frente a los que sí lo hacen, especialmente en el segmento premium.",
    top: "65%",
    left: "7%",
    align: "left"
  },
  {
    id: 2,
    title: "Más difícil y costoso de añadir después",
    desc: "Hacer bien la infraestructura de carga durante la construcción (tendido de conductos, tableros de distribución, planificación de carga) cuesta una fracción de lo que cuesta adaptarla después de la entrega. La mayoría de los desarrolladores no saben qué especificar o a quién consultar en la etapa de diseño.",
    top: "61%",
    left: "29%"
  },
  {
    id: 3,
    title: "¿Quién lo mantiene después de la entrega?",
    desc: "Una vez que la administración asume el control, ¿quién se encarga del cargador que no funciona? Los desarrolladores quieren entregar un activo funcional y con respaldo, no dejarle al comité una relación con un proveedor y un problema de mantenimiento.",
    top: "60%",
    left: "48%"
  },
  {
    id: 4,
    title: "¿Quién paga qué? (Asociaciones de residentes)",
    desc: "El problema más difícil en la carga residencial de unidades múltiples es garantizar que cada residente pague solo por su propio consumo, sin disputas por medición compartida a nivel de la asociación de residentes.",
    top: "52%",
    left: "75%"
  },
  {
    id: 5,
    title: "Adaptación en un edificio habitado (Asociaciones de residentes)",
    desc: "Tender cables, montar tableros de distribución e instalar cargadores en un edificio ocupado requiere una planificación cuidadosa y la aprobación de la asociación de residentes. Las adaptaciones mal planificadas causan interrupciones, retrasos y fricciones en el comité.",
    top: "40%",
    left: "86%",
    align: "right"
  }
];

export default function ResidentialInfrastructureMap({ src, locale }: { src: string, locale?: string }) {
  const [activeId, setActiveId] = useState<number | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const isEs = locale === 'es-419' || locale === 'es';
  const markersData = isEs ? markersDataEs : markersDataEn;

  // Handle clicks outside to close the active marker
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mapRef.current && !mapRef.current.contains(event.target as Node)) {
        setActiveId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={mapRef} className={`w-full h-full relative font-sans transition-all duration-300 ${activeId ? 'z-[100]' : 'z-20'}`}>
      {/* Background Video (Secure API route to hide Cloudinary URL) */}
      <CloudinaryVideo src={src} />

      {/* Overlay to dim the rest of the website when a marker is active */}
      <div
        onClick={() => setActiveId(null)}
        className={`fixed inset-0 bg-black/80 transition-opacity duration-300 z-[60] ${activeId ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Markers Container */}
      {markersData.map((marker) => {
        const isActive = activeId === marker.id;

        return (
          <div
            key={marker.id}
            className={`absolute transition-all duration-300 ${isActive ? 'z-[70]' : 'z-10'}`}
            style={{ top: marker.top, left: marker.left, transform: 'translate(-50%, -50%)' }}
          >
            {/* The Dot (Concentric Circles) */}
            <button
              onClick={() => setActiveId(isActive ? null : marker.id)}
              className={`relative flex items-center justify-center rounded-full transition-all duration-300 group ${isActive
                ? 'w-7 h-7 md:w-8 md:h-8 border-2 border-[#00E573] shadow-[0_0_20px_rgba(0,229,115,0.6)] scale-110'
                : 'w-5 h-5 md:w-6 md:h-6 border-[1.5px] border-white/70 hover:border-[#00E573] shadow-lg'
                }`}
            >
              <div className={`rounded-full transition-colors duration-300 ${isActive
                ? 'w-3 h-3 md:w-4 md:h-4 bg-[#00E573]'
                : 'w-2.5 h-2.5 md:w-3 md:h-3 bg-white group-hover:bg-[#00E573]'
                }`} />
            </button>

            {/* The Heading (Always visible above the icon) */}
            <div className={`absolute bottom-full mb-3 ${marker.align === 'left' ? 'left-0 text-left' : marker.align === 'right' ? 'right-0 text-right' : 'left-1/2 -translate-x-1/2 text-center'} w-[120px] md:w-[160px] whitespace-pre-line text-white font-bold text-[10px] md:text-[11px] leading-tight tracking-wide z-20 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] pointer-events-none transition-all duration-300 ${isActive ? '-translate-y-2 text-[#00E573]' : ''}`}>
              {marker.title}
            </div>

            {/* The Popup Description (Below the icon) */}
            {isActive && (
              <div
                className={`absolute top-full mt-4 ${marker.align === 'left' ? 'left-0' : marker.align === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2'} w-[280px] md:w-[320px] bg-[#0c0c0c]/95 backdrop-blur-md border border-[#00E573]/30 p-4 md:p-5 rounded-xl shadow-2xl z-50 flex flex-col gap-2 animate-in fade-in slide-in-from-top-4 duration-300`}
              >
                <p className="text-white/75 text-[10px] md:text-[13px] leading-relaxed font-sans">
                  {marker.desc}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
