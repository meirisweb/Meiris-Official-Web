"use client";

import { useState, useEffect, useRef } from "react";
import CloudinaryVideo from "./CloudinaryVideo";

const markersDataEn = [
  {
    id: 1,
    title: "Site selection & rollout complexity",
    desc: "Identifying viable highway sites – with the right footfall, grid availability and land/lease terms – and managing approvals and installation across multiple locations adds significant time and cost when scaling site by site rather than as a coordinated rollout.",
    top: "40%",
    left: "22%",
    align: "left"
  },
  {
    id: 2,
    title: "Product quality",
    desc: "Chargers run outdoors, 24x7, through heat, dust and monsoon. Frequent component failures translate directly into downtime, repair costs and bad reviews from drivers.",
    top: "30%",
    left: "60%"
  },
  {
    id: 3,
    title: "Speed of service / serviceability",
    desc: "Every hour a charger is down on a highway corridor is lost revenue and a frustrated driver, often far from the operator's base. Waiting days for a technician or spare part is one of the biggest drags on profitability.",
    top: "44%",
    left: "40%"
  },
  {
    id: 4,
    title: "CMS & compatibility issues",
    desc: "Chargers locked to a single CMS, or running non-standard OCPP, make it hard to switch providers, join roaming networks, or plug into aggregator apps and fleet-billing systems later.",
    top: "12%",
    left: "75%"
  },
  {
    id: 5,
    title: "Data collection & analytics",
    desc: "Without granular, station-wise utilisation, revenue and fault data, CPOs can't identify their best sites, fine-tune pricing, or make a data-backed case to landowners and investors for expansion.",
    top: "53%",
    left: "74%",
    align: "right"
  }
];

const markersDataEs = [
  {
    id: 1,
    title: "Selección de sitios y complejidad de implementación",
    desc: "Identificar sitios viables en autopistas (con la afluencia de tráfico adecuada, disponibilidad de red eléctrica y condiciones de terreno o arrendamiento) y gestionar las aprobaciones y la instalación en múltiples ubicaciones agrega tiempo y costos significativos cuando se escala sitio por sitio en lugar de hacerlo como una implementación coordinada.",
    top: "40%",
    left: "22%",
    align: "left"
  },
  {
    id: 2,
    title: "Calidad del producto",
    desc: "Los cargadores funcionan al aire libre, 24/7, soportando calor, polvo y lluvias torrenciales. Las fallas frecuentes de los componentes se traducen directamente en tiempo de inactividad, costos de reparación y malas reseñas por parte de los conductores.",
    top: "30%",
    left: "60%"
  },
  {
    id: 3,
    title: "Velocidad de servicio y facilidad de mantenimiento",
    desc: "Cada hora que un cargador está inactivo en un corredor de autopista representa pérdida de ingresos y un conductor frustrado, a menudo lejos de la base del operador. Esperar días por un técnico o una pieza de repuesto es uno de los mayores obstáculos para la rentabilidad.",
    top: "44%",
    left: "40%"
  },
  {
    id: 4,
    title: "Problemas de CMS y compatibilidad",
    desc: "Los cargadores bloqueados a un solo CMS, o que operan con protocolos OCPP no estándar, dificultan el cambio de proveedores, la integración a redes de roaming o la conexión futura con aplicaciones integradoras y sistemas de facturación de flotas.",
    top: "12%",
    left: "75%"
  },
  {
    id: 5,
    title: "Recopilación de datos y analítica",
    desc: "Sin datos granulares por estación sobre la utilización, los ingresos y las fallas, los CPO (operadores de puntos de carga) no pueden identificar sus mejores sitios, ajustar de forma precisa los precios o presentar un caso de negocio respaldado por datos ante propietarios e inversores para futuras expansiones.",
    top: "53%",
    left: "74%",
    align: "right"
  }
];

export default function CpoInfrastructureMap({ src, locale }: { src: string, locale?: string }) {
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
