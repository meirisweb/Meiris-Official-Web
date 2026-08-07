"use client";

import { useState, useEffect, useRef } from "react";
import CloudinaryVideo from "./CloudinaryVideo";

const markersDataEn = [
  {
    id: 1,
    title: "Charging is becoming table stakes",
    desc: "Guests and employees increasingly expect EV charging, and competitors are already offering it. Absence is becoming a reason to choose a different hotel or workplace — especially in the premium segment.",
    top: "74%",
    left: "11%",
    align: "left"
  },
  {
    id: 2,
    title: "Billing and access complexity",
    desc: "How does a hotel bill a guest's room charge for their overnight charging session? How does an employer distinguish personal from business use? How do multiple tenants in a shared office building split costs fairly?",
    top: "67%",
    left: "34%"
  },
  {
    id: 3,
    title: "Electrical load conflicts",
    desc: "Kitchens, HVAC, lifts and other building systems already put pressure on available supply. Adding chargers without load management risks tripping breakers or triggering demand penalties.",
    top: "56%",
    left: "77%"
  },
  {
    id: 4,
    title: "Aesthetics & integration",
    desc: "Chargers in lobbies, hotel car parks and corporate driveways visible to guests need to match the property's look and feel. Industrial-grade hardware designed for forecourts stands out for the wrong reasons.",
    top: "66%",
    left: "49%"
  },
  {
    id: 5,
    title: "No in-house technical team",
    desc: "The facilities manager doesn't want to manage a charger vendor, handle faults, or explain charger downtime to a hotel GM. EV charging needs to run invisibly, like any other building system.",
    top: "74%",
    left: "69%"
  },
  {
    id: 6,
    title: "Multi-property management",
    desc: "Hotel chains and large corporates with multiple sites need central visibility and control — not a separate conversation, contract or CMS login per property.",
    top: "11%",
    left: "77%",
    align: "right"
  }
];

const markersDataEs = [
  {
    id: 1,
    title: "La carga se está convirtiendo en un requisito indispensable",
    desc: "Los huéspedes y empleados esperan cada vez más contar con carga para vehículos eléctricos (VE), y los competidores ya lo están ofreciendo. Su ausencia se está convirtiendo en un motivo para elegir un hotel o lugar de trabajo diferente, especialmente en el segmento premium.",
    top: "74%",
    left: "11%",
    align: "left"
  },
  {
    id: 2,
    title: "Complejidad en la facturación y el acceso",
    desc: "¿Cómo factura un hotel a la habitación de un huésped su sesión de carga nocturna? ¿Cómo distingue un empleador el uso personal del comercial? ¿Cómo dividen los costos de manera justa los múltiples inquilinos en un edificio de oficinas compartido?",
    top: "67%",
    left: "34%"
  },
  {
    id: 3,
    title: "Conflictos de carga eléctrica",
    desc: "Las cocinas, los sistemas de climatización (HVAC), los ascensores y otros sistemas del edificio ya ejercen presión sobre el suministro disponible. Añadir cargadores sin gestión de carga conlleva el riesgo de disparar los disyuntores o desencadenar penalizaciones por exceso de demanda.",
    top: "56%",
    left: "77%"
  },
  {
    id: 4,
    title: "Estética e integración",
    desc: "Los cargadores en vestíbulos, estacionamientos de hoteles y entradas corporativas visibles para los visitantes deben estar en sintonía con la imagen y el ambiente de la propiedad. El hardware de grado industrial diseñado para estaciones de servicio resalta por las razones equivocadas.",
    top: "66%",
    left: "49%"
  },
  {
    id: 5,
    title: "Falta de equipo técnico interno",
    desc: "El gerente de instalaciones no quiere lidiar con un proveedor de cargadores, gestionar fallas o explicar el tiempo de inactividad de un equipo al gerente general (GM) del hotel. La carga de vehículos eléctricos debe funcionar de manera invisible, como cualquier otro sistema del edificio.",
    top: "74%",
    left: "69%"
  },
  {
    id: 6,
    title: "Gestión de múltiples propiedades",
    desc: "Las cadenas hoteleras y las grandes corporaciones con múltiples ubicaciones necesitan visibilidad y control centralizados; no una conversación, un contrato o un inicio de sesión de CMS distinto para cada propiedad.",
    top: "11%",
    left: "77%",
    align: "right"
  }
];

interface HospitalityInfrastructureMapProps {
  src: string;
  locale?: string;
}

export default function HospitalityInfrastructureMap({ src, locale }: HospitalityInfrastructureMapProps) {
  const [activeId, setActiveId] = useState<number | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const markersData = locale === "es-419" ? markersDataEs : markersDataEn;

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
    <div ref={mapRef} className="w-full h-full relative z-20 font-sans">
      {/* Background Video (Secure API route to hide Cloudinary URL) */}
      <CloudinaryVideo src={src} />

      {/* Overlay to dim video when a marker is active */}
      <div
        onClick={() => setActiveId(null)}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 z-0 ${activeId ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Markers Container */}
      {markersData.map((marker) => {
        const isActive = activeId === marker.id;

        return (
          <div
            key={marker.id}
            className={`absolute transition-all duration-300 ${isActive ? 'z-50' : 'z-10'}`}
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
