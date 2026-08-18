"use client";

import { useState, useEffect, useRef } from "react";
import CloudinaryVideo from "./CloudinaryVideo";

const markersDataEn = [
  {
    id: 1,
    title: "Fragmented vendors & approvals",
    desc: "Getting a depot charging setup live often means coordinating civil work, electrical infrastructure, DISCOM approvals, charger procurement and software integration across separate vendors – with no single point of accountability if timelines don't line up.",
    top: "41%",
    left: "10%",
    align: "left"
  },
  {
    id: 2,
    title: "Peak load & transformer sizing",
    desc: "Sizing a transformer for multiple vehicles charging in overlapping shifts is hard to get right. Oversize it and you've sunk capex into unused capacity; undersize it and you risk tripping, demand penalties and stranded vehicles at shift-start.",
    top: "45%",
    left: "30%"
  },
  {
    id: 5,
    title: "Uptime affects schedules & revenue",
    desc: "One charger down overnight can mean a vehicle misses its first trip. Even an hour or two of charger downtime per week can cascade into missed routes, idle drivers and lost revenue.",
    top: "34%",
    left: "56%"
  },
  {
    id: 3,
    title: "Over-heating & de-rating",
    desc: "Back-to-back charging sessions in extreme heat push chargers past their thermal limits. Once they de-rate, charging slows down – exactly when the depot needs every vehicle topped up before its next shift.",
    top: "48%",
    left: "40%"
  },
  {
    id: 4,
    title: "Lower efficiency, lower margins",
    desc: "Conversion losses and idle-time draw quietly inflate the energy cost per km – eroding the very fuel-cost savings that justified moving the fleet to EVs.",
    top: "53%",
    left: "52%"
  },
  {
    id: 6,
    title: "Fault-finding & serviceability",
    desc: "When a charger trips, depot staff often can't tell if the fault lies with the charger, the cable, the vehicle's onboard charger, or the grid supply – leading to slow diagnosis and repeat site visits.",
    top: "44%",
    left: "74%"
  },
  {
    id: 7,
    title: "Manual data collection",
    desc: "Energy consumed, charging duration and faults are often logged by hand on paper or WhatsApp – making it slow and error-prone to reconcile electricity bills against vehicle- or route-level usage.",
    top: "50%",
    left: "83%"
  },
  {
    id: 8,
    title: "Unit economics\nhard to establish",
    desc: "Without vehicle-wise, route-wise or shift-wise cost data, fleet operators struggle to build the cost-per-km business case for EVs – a critical input when planning fleet expansion.",
    top: "62%",
    left: "95%",
    align: "right"
  }
];

const markersDataEs = [
  {
    id: 1,
    title: "Proveedores y aprobaciones\nfragmentados",
    desc: "Poner en marcha un patio de carga suele implicar la coordinación de obras civiles, infraestructura eléctrica, aprobaciones de la distribuidora eléctrica, adquisición de cargadores e integración de software entre distintos proveedores, sin un único responsable si los cronogramas no se alinean.",
    top: "41%",
    left: "10%",
    align: "left"
  },
  {
    id: 2,
    title: "Carga pico y dimensionamiento\ndel transformador",
    desc: "Dimensionar un transformador para la carga de múltiples vehículos en turnos superpuestos es difícil de acertar. Sobredimensionarlo implica hundir CapEx en capacidad no utilizada; subdimensionarlo conlleva el riesgo de disparos, penalizaciones por demanda y vehículos varados al inicio del turno.",
    top: "49%",
    left: "30%"
  },
  {
    id: 5,
    title: "El tiempo de actividad afecta\nlos horarios y los ingresos",
    desc: "Un cargador inactivo durante la noche puede significar que un vehículo pierda su primer viaje. Incluso una o dos horas de inactividad del cargador por semana pueden desencadenar una reacción en cadena de rutas perdidas, conductores inactivos y pérdida de ingresos.",
    top: "34%",
    left: "56%"
  },
  {
    id: 3,
    title: "Sobrecalentamiento y\nreducción de potencia",
    desc: "Las sesiones de carga consecutivas en condiciones de calor extremo llevan a los cargadores más allá de sus límites térmicos. Una vez que reducen su potencia, la carga se ralentiza, justo cuando el patio de carga necesita que cada vehículo esté completamente cargado antes de su siguiente turno.",
    top: "48%",
    left: "40%"
  },
  {
    id: 4,
    title: "Menor eficiencia, menores\nmárgenes",
    desc: "Las pérdidas de conversión y el consumo en reposo aumentan silenciosamente el costo energético por kilómetro, erosionando los mismos ahorros en combustible que justificaron la transición de la flota a vehículos eléctricos.",
    top: "53%",
    left: "52%"
  },
  {
    id: 6,
    title: "Detección de fallas y\nfacilidad de mantenimiento",
    desc: "Cuando un cargador se dispara, el personal del patio a menudo no puede determinar si la falla radica en el cargador, el cable, el cargador a bordo del vehículo o el suministro de la red eléctrica, lo que conduce a diagnósticos lentos y visitas repetidas al sitio.",
    top: "44%",
    left: "74%"
  },
  {
    id: 7,
    title: "Recopilación manual\nde datos",
    desc: "La energía consumida, la duración de la carga y las fallas a menudo se registran a mano en papel o por WhatsApp, lo que hace que sea un proceso lento y propenso a errores conciliar las facturas de electricidad con el uso a nivel de vehículo o de ruta.",
    top: "50%",
    left: "83%"
  },
  {
    id: 8,
    title: "Economía unitaria\ndifícil de establecer",
    desc: "Sin datos de costos por vehículo, por ruta o por turno, los operadores de flotas tienen dificultades para construir el caso de negocio del costo por kilómetro para los vehículos eléctricos, un factor crítico al planificar la expansión de la flota.",
    top: "62%",
    left: "95%",
    align: "right"
  }
];

export default function DepotInfrastructureMap({ src, locale }: { src: string, locale?: string }) {
  const [activeId, setActiveId] = useState<number | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const isEs = locale === 'es-419' || locale === 'es';
  const markersData = isEs ? markersDataEs : markersDataEn;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mapRef.current && !mapRef.current.contains(event.target as Node)) {
        setActiveId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={mapRef} className={`w-full h-full relative font-sans transition-all duration-300 ${activeId ? 'z-[100]' : 'z-20'}`}>
      {/* Background Video */}
      <CloudinaryVideo src={src} />

      {/* Overlay to dim the rest of the website when a marker is active */}
      <div
        onClick={() => setActiveId(null)}
        className={`fixed inset-0 bg-black/80 transition-opacity duration-300 z-[60] ${activeId ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Markers */}
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
