"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import { ChipGraphic, NetworkGraphic, ThreeLayers, GREEN } from "./Graphics";
import platformFirmware from "@/assets/platform-firmware.jpg";

interface Props {
  platformModule: StaticImageData;
  locale?: string;
}

export default function PlatformParallax({ platformModule, locale }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      // Track scroll progress as long as we haven't scrolled completely past it
      if (rect.top <= 0) {
        const scrolled = -rect.top;
        const total = window.innerHeight * 50; // Restore 5000vh track length
        const p = Math.max(0, Math.min(1, scrolled / total));
        setProgress(p);
      } else if (rect.top > 0) {
        setProgress(0); // Before track starts
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ┌── Interpolation helpers ──────────────────────────────────────────
  function lerp(start: number, end: number): number {
    if (progress <= start) return 0;
    if (progress >= end) return 1;
    return (progress - start) / (end - start);
  }

  function rng(inS: number, inE: number, outS: number, outE: number): number {
    const t = lerp(inS, inE);
    return outS + t * (outE - outS);
  }

  // ── Section animation values ──────────────────────────────────────────

  // S1 (0 → 0.032)
  const s1Op = 1 - lerp(0.008, 0.032);
  const s1Y = 0;
  const s1ChipOp = 1 - lerp(0.008, 0.032);
  const s1ChipX = 0;

  // S2 (0.032 → 0.14)
  const s2In = lerp(0.032, 0.04);
  const s2Out = 1 - lerp(0.132, 0.14);
  const s2Op = Math.min(s2In, s2Out);
  const s2Y = rng(0.032, 0.04, 50, 0) + rng(0.132, 0.14, 0, -50);
  const s2Quote = lerp(0.096, 0.108); // Fixed gap: text ends at 0.096
  const s2Net = lerp(0.048, 0.112); 

  // S3 (0.14 → 0.24)
  const s3In = lerp(0.14, 0.148);
  const s3Out = 1 - lerp(0.232, 0.24);
  const s3Op = Math.min(s3In, s3Out);
  const s3BoxOp = Math.min(lerp(0.14, 0.148), s3Out);
  const s3BoxW = rng(0.14, 0.152, 0, isMobile ? 100 : 45);
  const s3DiagOp = lerp(0.16, 0.208);
  const s3MobileCardsOp = isMobile ? lerp(0.176, 0.180) : 1;
  const s3MobileTranslateX = isMobile ? rng(0.180, 0.235, 0, -178) : 0;
  const s3C1Op = lerp(0.208, 0.216);
  const s3C1Y = rng(0.208, 0.216, 40, 0);
  const s3C2Op = lerp(0.216, 0.224);
  const s3C2Y = rng(0.216, 0.224, 40, 0);
  const s3C3Op = lerp(0.224, 0.232);
  const s3C3Y = rng(0.224, 0.232, 40, 0);

  // S4 (0.24 → 0.34)
  const s4In = lerp(0.24, 0.248);
  const s4Out = 1 - lerp(0.332, 0.34);
  const s4Op = Math.min(s4In, s4Out);
  const s4TextFadeOut = 1 - lerp(0.316, 0.328);
  const s4BoxScaleX = lerp(0.24, 0.26) * (1 - lerp(0.328, 0.34));
  const s4ImgOp = Math.min(lerp(0.26, 0.288), s4TextFadeOut);
  const s4Scale = rng(0.26, 0.328, 0.92, 1.06);

  // S5 (0.34 → 0.40)
  const s5In = lerp(0.34, 0.348);
  const s5Out = 1 - lerp(0.392, 0.40);
  const s5Op = Math.min(s5In, s5Out);
  const s5TitleOp = Math.min(lerp(0.34, 0.348), s5Out);
  const s5TitleY = rng(0.34, 0.348, 30, 0);
  const s5C1Op = Math.min(lerp(0.352, 0.364), s5Out);
  const s5C1X = rng(0.352, 0.364, isMobile ? -30 : -60, 0);
  const s5C2Op = Math.min(lerp(0.364, 0.376), s5Out);
  const s5C2X = rng(0.364, 0.376, isMobile ? -30 : -60, 0);
  const s5QuoteOp = Math.min(lerp(0.376, 0.380), s5Out);

  // S6: Video/Image Frame (0.40 → 0.43)
  const s6In = lerp(0.40, 0.41);
  const s6Out = 1 - lerp(0.42, 0.43);
  const s6Op = Math.min(s6In, s6Out);
  const s6ImgOp = Math.min(lerp(0.405, 0.415), 1 - lerp(0.415, 0.425));

  // S7: Firmware Text Showcase (0.43 → 0.56)
  const s7In = lerp(0.43, 0.44);
  const s7Out = 1 - lerp(0.54, 0.56);
  const s7Op = Math.min(s7In, s7Out); 
  const s7Quote = lerp(0.50, 0.52);
  const s7ImgOp = lerp(0.47, 0.50);

  // S8: 4 Cards Reveal and Upward Pan (0.56 → 0.72)
  const s8In = lerp(0.56, 0.58);
  const s8Op = s8In; 
  
  // Title & Intro (0.58 -> 0.60)
  const s8TitleOp = lerp(0.58, 0.60);
  const s8TitleY = rng(0.58, 0.60, 30, 0);
  const s8IntroOp = lerp(0.60, 0.62);
  
  // Row 1 (Cards 1 & 2) slides in (0.62 -> 0.65)
  const s8R1Op = lerp(0.62, 0.65);
  const s8C1X = rng(0.62, 0.65, isMobile ? -50 : -150, 0);
  const s8C2X = rng(0.62, 0.65, isMobile ? 50 : 150, 0);
  
  // Pan Upwards (0.66 -> 0.72)
  const maxPan = isMobile ? 0 : -45; // No panning on mobile, just center it
  const s8PanY = rng(0.66, 0.72, 0, maxPan); 
  
  // Row 2 (Cards 3 & 4) slides in as space is revealed (0.68 -> 0.72)
  const s8R2Op = lerp(0.68, 0.72);
  const s8C3X = rng(0.68, 0.72, isMobile ? -50 : -150, 0);
  const s8C4X = rng(0.68, 0.72, isMobile ? 50 : 150, 0);
  const s8MobileTranslateX = isMobile ? rng(0.62, 0.72, 0, -267) : 0;

  function TypewriterScroll({ text, start, end, className }: { text: string, start: number, end: number, className?: string }) {
    const tokens = text.split(/(\n| )/);
    let wordCount = tokens.filter(t => t !== " " && t !== "\n").length;
    let wordIdx = 0;
    
    return (
      <span className={className}>
        {tokens.map((token, i) => {
          if (token === "\n") return <br key={i} />;
          if (token === " ") return <span key={i}> </span>;
          
          const pStart = start + (wordIdx / wordCount) * (end - start);
          const pEnd = Math.min(end, pStart + (end - start) / wordCount * 2);
          const opacity = lerp(pStart, pEnd);
          wordIdx++;
          
          return <span key={i} style={{ opacity }}>{token}</span>;
        })}
      </span>
    );
  }

  const t = locale === 'es-419' ? {
    s1_title: "Conversión\nInteligente\nde Energía.",
    s1_subtitle: "Desde la entrada de red hasta la salida de precisión: una sola arquitectura integrada verticalmente.",
    s1_desc: "La Plataforma MEIRIS es una plataforma de conversión de energía de integración vertical, desarrollada con dispositivos de Carburo de Silicio (SiC) y firmware exclusivo, diseñada para convertir, gestionar y orquestar la energía con precisión a un 96 % de eficiencia del sistema.",
    
    s2_t1: "La energía está en todas partes.\nLa inteligencia no.",
    s2_t2: "La transición energética no es un problema de hardware.\nEs un problema de conversión.",
    s2_t3: "Cada megavatio de generación renovable, cada vehículo eléctrico, cada sistema de baterías requiere conversión. Cada aspecto de la generación y el consumo de electricidad implica un elemento de conversión. La energía eléctrica bruta de la red debe transformarse, regularse y suministrarse con precisión a cada carga, cada 10 ms. Con fuentes variables y perfiles de carga cambiantes, el problema de la conversión se ha vuelto más complejo. La eficiencia de esa conversión determina la eficiencia de todo el sistema energético. La eficiencia de conversión ya no se puede ignorar.",
    s2_t4: "MEIRIS se creó para solucionarlo de forma diferente.",
    s2_q: "“La brecha entre la energía eléctrica bruta y el suministro de energía inteligente y preciso es donde se construye la próxima generación de infraestructura energética.”",
    s2_qa: "— MEIRIS ENGINEERING",

    s3_t1: "ARQUITECTURA",
    s3_t2: "Tres capas.\nUna arquitectura.",
    s3_t3: "La base de silicio de los dispositivos de módulos de potencia de SiC de banda prohibida ancha, la precisión de una arquitectura de control exclusiva, la inteligencia de los algoritmos de firmware patentados que orquestan la conversión de energía en tiempo real. Cada capa de la Plataforma MEIRIS está diseñada, desarrollada y es propiedad de MEIRIS.",
    s3_c1_h: "Base de silicio",
    s3_c1_p: "Módulos de potencia bidireccionales basados en SiC. Topologías de conmutación patentadas. 30 kW por módulo, escalable en paralelo.",
    s3_c2_h: "Arquitectura de control",
    s3_c2_p: "Controlador SoC exclusivo. Conmutación en tiempo real controlada por DSP. Coordinación multimódulo y comunicación BMS.",
    s3_c3_h: "Inteligencia de firmware",
    s3_c3_p: "Algoritmos de control patentados. Enrutamiento de energía V2X. Respuesta a la demanda de la red, ISO 15118, OCPP y gestión predictiva.",

    s4_t1: "Conversión de energía,\nrepensada a nivel\nde silicio",
    s4_t2: "El núcleo de la plataforma está construido en torno al Carburo de Silicio — un semiconductor de banda prohibida ancha que opera a voltajes más altos, frecuencias de conmutación más altas y temperaturas de unión más altas que los dispositivos de silicio convencionales.",
    s4_t3: "Cada módulo integra un rectificador activo bidireccional basado en MOSFET de SiC con Corrección Activa del Factor de Potencia. El resultado:",
    s4_t4: "conversión limpia para la red, distorsión armónica mínima y cero desperdicio de energía reactiva",
    s4_t5: "en la etapa de conversión.",

    s5_t1: "La energía tiene una dirección.\nNosotros eliminamos la restricción.",
    s5_t2: "La bidireccionalidad no es una característica. Es la arquitectura.",
    s5_c1: "La bidireccionalidad es nativa de los dispositivos de SiC. El mismo firmware que gestiona la carga puede gestionar la descarga. No hay cambio de modo.",
    s5_c2: "El resultado: los sistemas impulsados por MEIRIS pueden ser simultáneamente un sistema de suministro de energía y un sistema de recuperación de energía. Una batería de VE se convierte en un recurso de red despachable. Un banco de almacenamiento se convierte en un activo de regulación de frecuencia. Un nodo de energía distribuida se convierte en un participante interactivo con la red. La física de la conversión es idéntica en ambas direcciones. La inteligencia define la dirección, la magnitud y los tiempos.",
    s5_q: "“La arquitectura que carga una batería es la misma arquitectura que despacha su energía a la red. Eso no es una capacidad añadida. Es una forma diferente de pensar sobre la conversión de energía.”",

    s7_t1: "El firmware\nhace que la\nplataforma\nsea lo que es.",
    s7_t2: "Las unidades de control, basadas en una arquitectura y un firmware exclusivos, forman la capa de inteligencia que da coherencia a la plataforma en todas las condiciones de operación, perfiles de carga y contextos de aplicación.",
    s7_t3: "El firmware patentado orquesta el control de potencia en tiempo real, la gestión dinámica de carga, la optimización predictiva de energía y la integración a la red sin la latencia del middleware.",
    s7_q: "“El hardware define el límite de lo posible. El firmware define lo que realmente sucede. MEIRIS posee ambos.”",
    s7_img: "MEIRIS Intelligence Core",

    s8_t1: "Una plataforma. Múltiples aplicaciones.",
    s8_t2: "La arquitectura de la plataforma de módulos de potencia, la topología de control y la inteligencia del firmware son consistentes en todas las aplicaciones. El comportamiento específico de la aplicación se determina en la capa de software, no mediante el rediseño del hardware.",
    s8_m_t: "MÓDULO DE POTENCIA APILADO",
    s8_m_s: "Alta densidad de potencia • Refrigeración líquida • Escalable",
    s8_c1_t: "Soluciones de carga para VE",
    s8_c1_p: "Cargadores rápidos de CC · Cargadores de CA · Cargadores a bordo",
    s8_c2_t: "Solar",
    s8_c2_p: "Inversores de alta capacidad (>100 kVA)",
    s8_c3_t: "Ferroviario (Railway)",
    s8_c3_p: "Inversores de tracción · Convertidores auxiliares",
    s8_c4_t: "BESS (Battery Energy Storage Systems)",
    s8_c4_p: "Sistema de conversión de potencia (PCS)"
  } : {
    s1_title: "Intelligent\nPower\nConversion.",
    s1_subtitle: "From grid input to precision output — a single vertically integrated architecture.",
    s1_desc: "The MEIRIS Platform is a vertically integrated power conversion platform built using Silicon Carbide (SiC) devices & proprietary firmware, engineered to convert, manage, and orchestrate energy with precision at 96% system efficiency.",
    
    s2_t1: "Energy is everywhere.\nIntelligence is not.",
    s2_t2: "The Energy Transition is not a hardware problem.\nIt is a conversion problem.",
    s2_t3: "Every megawatt of renewable generation, every EV, every battery system requires conversion. Every aspect of electricity generation and consumption involves an element of conversion. Raw electrical energy from the grid must be transformed, regulated, and delivered with precision to every load, every 10ms. With variable sources and changing load profiles the conversion problem has become more complex. The efficiency of that conversion determines the efficiency of the entire energy system. Conversion efficiency can no longer be ignored.",
    s2_t4: "MEIRIS was built to solve it differently.",
    s2_q: "“The gap between raw electrical energy and intelligent, precise power delivery is where the next generation of energy infrastructure is built.”",
    s2_qa: "— MEIRIS Engineering",

    s3_t1: "Architecture",
    s3_t2: "Three Layers.\nOne Architecture.",
    s3_t3: "The silicon foundation of wide-bandgap SiC power module devices, the precision of a proprietary control architecture, the intelligence of patented firmware algorithms that orchestrate energy conversion in real time. Every layer of the MEIRIS Platform is designed, developed, and owned by MEIRIS.",
    s3_c1_h: "Silicon Foundation",
    s3_c1_p: "SiC-based bidirectional power modules. Patented switching topologies. 30kW per module, scalable in parallel.",
    s3_c2_h: "Control Architecture",
    s3_c2_p: "Proprietary SoC controller. DSP driven real-time switching. Multi module coordination and BMS communication.",
    s3_c3_h: "Firmware Intelligence",
    s3_c3_p: "Patented control algorithms. V2X energy routing. Grid demand response, ISO 15118, OCPP, and predictive management.",

    s4_t1: "Power Conversion,\nrethought at the\nSilicon Level",
    s4_t2: "The platform's core is built around Silicon Carbide — a wide-bandgap semiconductor that operates at higher voltages, higher switching frequencies, and higher junction temperatures than conventional Silicon devices.",
    s4_t3: "Each module integrates a bidirectional active rectifier built on SiC MOSFETs with Active Power Factor Correction. The result:",
    s4_t4: "grid-clean conversion, minimal harmonic distortion, and zero reactive power waste",
    s4_t5: "at the conversion stage.",

    s5_t1: "Power has a direction.\nWe removed the constraint.",
    s5_t2: "Bidirectionality is not a feature. It is the architecture.",
    s5_c1: "Bidirectionality is native to SiC devices. The same firmware that manages charging can manage discharge. There is no mode switch.",
    s5_c2: "The result: MEIRIS-powered systems can be simultaneously a power delivery system and an energy recovery system. An EV battery becomes a dispatchable grid resource. A storage bank becomes a frequency regulation asset. A distributed energy node becomes a grid-interactive participant. The physics of conversion are identical in both directions. The intelligence defines direction, magnitude, and timing.",
    s5_q: "“The architecture that charges a battery is the same architecture that dispatches its energy to the grid. That is not a capability addition. That is a different way of thinking about power conversion.”",

    s7_t1: "The firmware\nmakes the\nplatform\nwhat it is.",
    s7_t2: "The controller units built on a proprietary architecture and firmware form the intelligence layer that makes the platform coherent across all operating conditions, load profiles, and application contexts",
    s7_t3: "Patented firmware orchestrates real-time power control, dynamic load management, predictive energy optimization, and grid integration without middleware latency.",
    s7_q: "“Hardware defines the boundary of what is possible. Firmware defines what actually happens. MEIRIS owns both.”",
    s7_img: "MEIRIS Intelligence Core",

    s8_t1: "One Platform. Multiple Applications",
    s8_t2: "The power module platform architecture, control topology, and firmware intelligence are consistent across applications. Application-specific behaviour is determined at the software layer — not through hardware redesign.",
    s8_m_t: "STACKED POWER MODULE",
    s8_m_s: "High Power Density • Liquid Cooled • Scalable",
    s8_c1_t: "EV Charging Solutions",
    s8_c1_p: "DC Fast Chargers · AC Chargers · Onboard Chargers",
    s8_c2_t: "Solar",
    s8_c2_p: "High output (>100 kVA) inverters",
    s8_c3_t: "Railway",
    s8_c3_p: "Traction inverters · Auxiliary converters",
    s8_c4_t: "BESS",
    s8_c4_p: "Power Conversion System (PCS)"
  };

  return (
    <>
      <div ref={containerRef} style={{ height: "3700vh", position: "relative" }}>
        <div style={{ position: "sticky", top: 0, width: "100%", height: "100vh", zIndex: 0, backgroundColor: "#000", overflow: "hidden" }}>

          {/* ── SECTION 1 ───────────────────────────────────── */}
          <div
            style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: isMobile ? "flex-start" : "center", justifyContent: "center",
              opacity: s1Op,
              transform: `translateY(${s1Y}px)`,
              willChange: "opacity, transform",
            }}
          >
            <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-6 px-6 md:px-8 sm:px-10 md:grid-cols-[1.15fr_1fr] md:gap-16 lg:px-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-backwards pt-28 md:pt-0">
              <div>
                <h1 className="text-[clamp(2.25rem,6vw,5.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-white">
                  {t.s1_title.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < t.s1_title.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </h1>
                <p className="mt-6 md:mt-16 max-w-xl text-[14px] md:text-[clamp(1rem,1.8vw,1.35rem)] font-semibold leading-snug text-white">
                  {t.s1_subtitle}
                </p>
                <p className="mt-4 md:mt-12 max-w-xl text-[12px] md:text-[clamp(0.85rem,1.3vw,1rem)] leading-[1.55] text-white/60">
                  {t.s1_desc}
                </p>
              </div>
              <div
                style={{ opacity: s1ChipOp, transform: `translateX(${s1ChipX}px)`, willChange: "opacity, transform" }}
                className="flex items-center justify-center md:justify-end"
              >
                <ChipGraphic />
              </div>
            </div>
          </div>

          {/* ── SECTION 2 ───────────────────────────────────── */}
          <div
            style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: s2Op,
              transform: `translateY(${s2Y}px)`,
              willChange: "opacity, transform",
            }}
          >
            <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-2 md:gap-14 px-6 md:px-8 sm:px-10 md:grid-cols-[1.1fr_1fr] lg:px-12">
              <div>
                <h2 className="text-[clamp(1.5rem,4.5vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.02em] text-white">
                  <TypewriterScroll text={t.s2_t1} start={0.032} end={0.044} />
                </h2>
                <p className="mt-2 md:mt-10 max-w-xl text-[11px] md:text-[clamp(0.95rem,1.5vw,1.15rem)] font-semibold leading-snug text-white">
                  <TypewriterScroll text={t.s2_t2} start={0.044} end={0.056} />
                </p>
                <div>
                  <p className="mt-2 md:mt-10 max-w-xl text-[10px] md:text-[clamp(0.8rem,1.2vw,0.95rem)] leading-[1.35] md:leading-[1.55] text-white/55">
                    <TypewriterScroll text={t.s2_t3} start={0.056} end={0.088} />
                  </p>
                  <p className="mt-1 md:mt-6 text-[10px] md:text-[clamp(0.85rem,1.3vw,1rem)] text-white">
                    <TypewriterScroll text={t.s2_t4} start={0.088} end={0.096} />
                  </p>
                </div>
                <div className="mt-2 md:mt-12 border-l-2 pl-3 md:pl-6" style={{ borderColor: GREEN, opacity: s2Quote }}>
                  <p className="max-w-lg text-[9px] md:text-[clamp(0.8rem,1.1vw,0.9rem)] italic leading-[1.4] md:leading-[1.8] text-white/65">
                    {t.s2_q}
                  </p>
                  <p className="mt-1 md:mt-3 text-[8px] md:text-[11px] uppercase tracking-widest" style={{ color: GREEN }}>
                    {t.s2_qa}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center md:justify-end mt-2 md:mt-0" style={{ opacity: s2Net }}>
                <div className="w-full max-w-[120px] md:max-w-none">
                  <NetworkGraphic />
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 3 ───────────────────────────────────── */}
          <div
            style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: s3Op,
              willChange: "opacity",
            }}
          >
            <div className="mx-auto w-full max-w-[1180px] flex flex-col justify-center relative px-4 md:px-6 sm:px-8 py-6 md:py-8 lg:px-10">
              <div
                className="hidden md:block absolute top-12 bottom-12 left-0 rounded-[2rem] rounded-br-none z-0"
                style={{ width: `${s3BoxW}%`, opacity: s3BoxOp, background: "#e6e6e6" }}
              />
              <div className="relative z-10 flex flex-col">
                <div className="flex flex-col md:flex-row flex-1 min-h-0">
                  <div className="w-full md:w-[38%] p-0 md:p-12 pt-0 md:pt-16 text-white md:text-black">
                    <p className="text-[9px] md:text-[10px] font-bold tracking-widest text-[#00E573] md:text-black/50 uppercase">
                      <TypewriterScroll text={t.s3_t1} start={0.152} end={0.16} />
                    </p>
                    <h2 className="mt-1 md:mt-8 text-[clamp(1.5rem,3.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-white md:text-black">
                      <TypewriterScroll text={t.s3_t2} start={0.16} end={0.176} />
                    </h2>
                    <p className="mt-2 md:mt-6 text-[10px] md:text-sm text-white/70 md:text-black/70 leading-[1.4] md:leading-relaxed">
                      <TypewriterScroll text={t.s3_t3} start={0.176} end={0.208} />
                    </p>
                  </div>
                  <div className="flex w-full md:w-[62%] items-center justify-center p-4 md:p-8" style={{ opacity: s3DiagOp }}>
                    <div className="w-full max-w-[200px] md:max-w-none">
                      <ThreeLayers />
                    </div>
                  </div>
                </div>
                <div 
                  className="flex md:grid flex-nowrap md:grid-cols-3 gap-4 px-4 md:px-12 pb-4 md:pb-8 mt-4 md:mt-6 transition-transform duration-100 ease-out" 
                  style={{ transform: isMobile ? `translateX(${s3MobileTranslateX}vw)` : "none" }}
                >
                  <div className="shrink-0 w-[85vw] md:w-auto bg-[#2c2d2e] p-6 md:p-8 text-white rounded-[1rem] md:rounded-none md:rounded-l-[1.5rem]" style={{ opacity: isMobile ? s3MobileCardsOp : s3C1Op, transform: isMobile ? "none" : `translateY(${s3C1Y}px)` }}>
                    <h3 className="text-[13px] md:text-base font-semibold">{t.s3_c1_h}</h3>
                    <p className="mt-2 md:mt-4 text-[10px] md:text-xs leading-[1.6] md:leading-relaxed text-white/50">{t.s3_c1_p}</p>
                  </div>
                  <div className="shrink-0 w-[85vw] md:w-auto bg-[#2c2d2e] p-6 md:p-8 text-white rounded-[1rem] md:rounded-none" style={{ opacity: isMobile ? s3MobileCardsOp : s3C2Op, transform: isMobile ? "none" : `translateY(${s3C2Y}px)` }}>
                    <h3 className="text-[13px] md:text-base font-semibold">{t.s3_c2_h}</h3>
                    <p className="mt-2 md:mt-4 text-[10px] md:text-xs leading-[1.6] md:leading-relaxed text-white/50">{t.s3_c2_p}</p>
                  </div>
                  <div className="shrink-0 w-[85vw] md:w-auto bg-[#2c2d2e] p-6 md:p-8 text-white rounded-[1rem] md:rounded-none md:rounded-r-[1.5rem]" style={{ opacity: isMobile ? s3MobileCardsOp : s3C3Op, transform: isMobile ? "none" : `translateY(${s3C3Y}px)` }}>
                    <h3 className="text-[13px] md:text-base font-semibold">{t.s3_c3_h}</h3>
                    <p className="mt-2 md:mt-4 text-[10px] md:text-xs leading-[1.6] md:leading-relaxed text-white/50">{t.s3_c3_p}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 4 ───────────────────────────────────── */}
          <div
            style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: s4Op,
              willChange: "opacity",
            }}
          >
            <div className="absolute inset-0 z-0 flex" style={{ opacity: s4Op }}>
              <div className="w-full bg-[#e6e6e6] md:w-1/2 h-full origin-left" style={{ transform: `scaleX(${s4BoxScaleX})` }} />
              <div className="hidden w-1/2 bg-black md:block h-full" />
            </div>
            <div className="relative z-10 grid w-full grid-cols-1 md:grid-cols-2">
              <div className="px-6 py-4 md:py-24 md:px-16 lg:px-24 xl:px-32 flex flex-col justify-center" style={{ opacity: s4TextFadeOut }}>
                <div className="w-full text-black">
                  <h2 className="text-[clamp(1.5rem,3.8vw,4rem)] font-bold leading-[1.05] tracking-tight">
                    <TypewriterScroll text={t.s4_t1} start={0.26} end={0.272} />
                  </h2>
                <p className="mt-2 md:mt-8 text-[11px] md:text-[15px] leading-[1.4] md:leading-relaxed text-black/80">
                  <TypewriterScroll text={t.s4_t2} start={0.272} end={0.284} />
                </p>
                <p className="mt-2 md:mt-6 text-[11px] md:text-[15px] leading-[1.4] md:leading-relaxed text-black/80">
                  <TypewriterScroll text={t.s4_t3} start={0.284} end={0.296} />
                  {" "}
                  <span className="font-bold text-[#00E573]">
                    <TypewriterScroll text={t.s4_t4} start={0.296} end={0.308} />
                  </span>
                  {" "}
                  <TypewriterScroll text={t.s4_t5} start={0.308} end={0.312} />
                </p>
                </div>
              </div>
              <div className="flex items-center justify-center px-6 py-2 md:py-24 md:pl-16" style={{ opacity: s4ImgOp }}>
                <div style={{ transform: `scale(${s4Scale})` }}>
                  <Image src={platformModule} alt="MEIRIS power module" className="w-full max-w-[200px] md:max-w-[560px]" placeholder="blur" />
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 5 ───────────────────────────────────── */}
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", opacity: s5Op, willChange: "opacity" }}>
            <div className="mx-auto flex w-full max-w-[1240px] flex-col justify-center px-6 sm:px-10 lg:px-12">
              <h2 className="text-[clamp(1.5rem,4vw,3.75rem)] font-bold leading-[1.05] tracking-tight text-white" style={{ transform: `translateY(${s5TitleY}px)`, opacity: s5TitleOp }}>
                <TypewriterScroll text={t.s5_t1} start={0.34} end={0.348} />
              </h2>
              <p className="mt-1 md:mt-4 text-[11px] md:text-lg font-medium text-[#00E573]" style={{ transform: `translateY(${s5TitleY}px)`, opacity: s5TitleOp }}>
                {t.s5_t2}
              </p>
              <div className="mt-4 md:mt-16 grid w-full grid-cols-1 gap-3 md:gap-6 md:grid-cols-2">
                <div className="rounded-[1rem] md:rounded-[1.5rem] border border-white/20 p-4 md:p-8" style={{ opacity: s5C1Op, transform: `translateX(${s5C1X}px)` }}>
                  <p className="text-[10px] md:text-[13px] leading-[1.4] md:leading-relaxed text-white/80">{t.s5_c1}</p>
                </div>
                <div className="rounded-[1rem] md:rounded-[1.5rem] border border-white/20 p-4 md:p-8" style={{ opacity: s5C2Op, transform: `translateX(${s5C2X}px)` }}>
                  <p className="text-[10px] md:text-[13px] leading-[1.4] md:leading-relaxed text-white/80">{t.s5_c2}</p>
                </div>
              </div>
              <div className="mt-4 md:mt-20 border-l-2 pl-3 md:pl-6" style={{ borderColor: GREEN, opacity: s5QuoteOp }}>
                <p className="max-w-4xl text-[10px] md:text-[13px] italic leading-[1.4] md:leading-relaxed text-white/80">
                  {t.s5_q}
                </p>
              </div>
            </div>
          </div>

          {/* ── SECTION 6 ───────────────────────────────────── */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyItems: "center", background: "linear-gradient(90deg, #00E573 0%, #002b5e 100%)", opacity: s6Op, willChange: "opacity" }}>
            <div className="w-full max-w-[1200px] px-8 flex justify-center mx-auto" style={{ opacity: s6ImgOp }}>
              {/* Using the platformModule as a placeholder for the video frame scroll */}
              <Image src={platformModule} alt="Video Placeholder" className="w-full max-w-[900px] h-auto object-cover opacity-80 mix-blend-screen" />
            </div>
          </div>

          {/* ── SECTION 7 ───────────────────────────────────── */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", opacity: s7Op, willChange: "opacity" }}>
            <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-4 md:gap-16 px-6 md:px-8 md:grid-cols-[1fr_1.1fr]">
              <div className="flex flex-col">
                <h2 className="text-[clamp(1.5rem,4vw,4rem)] font-bold leading-[1.05] tracking-tight text-white">
                  <TypewriterScroll text={t.s7_t1} start={0.44} end={0.46} />
                </h2>
                <p className="mt-2 md:mt-12 max-w-sm text-[11px] md:text-[13px] leading-[1.4] md:leading-relaxed text-white/70">
                  <TypewriterScroll text={t.s7_t2} start={0.46} end={0.48} />
                </p>
                <p className="mt-2 md:mt-6 max-w-sm text-[11px] md:text-[13px] leading-[1.4] md:leading-relaxed text-white/70">
                  <TypewriterScroll text={t.s7_t3} start={0.48} end={0.50} />
                </p>
                <div className="mt-3 md:mt-12 border-l-2 border-[#00E573] pl-3 md:pl-6" style={{ opacity: s7Quote }}>
                  <p className="max-w-md text-[10px] md:text-sm italic leading-[1.4] md:leading-relaxed text-white/80">
                    {t.s7_q}
                  </p>
                </div>
              </div>
              <div className="relative flex flex-col items-center mt-4 md:mt-0" style={{ opacity: s7ImgOp }}>
                <Image src={platformFirmware} alt="Glowing SiC MOSFET representing MEIRIS firmware intelligence core" className="w-full max-w-[200px] md:max-w-[600px]" placeholder="blur" />
                <div className="mt-2 md:mt-6 flex w-full max-w-[500px] items-center justify-between">
                  <p className="text-[10px] md:text-sm text-white/80">{t.s7_img}</p>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white/40">
                    <path d="M12 2l2 8 8 2-8 2-2 8-2-8-8-2 8-2z" fill="currentColor" stroke="none" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 8 ───────────────────────────────────── */}
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: isMobile ? "flex-start" : "flex-start", paddingTop: isMobile ? "90px" : "15vh", opacity: s8Op, willChange: "opacity" }}>
            <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8" style={{ transform: `translateY(${s8PanY}vh)` }}>
              
              <div style={{ opacity: s8TitleOp, transform: `translateY(${s8TitleY}px)` }}>
                <h2 className="text-[clamp(1.75rem,4vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-white">
                  {t.s8_t1}
                </h2>
              </div>
              <div style={{ opacity: s8IntroOp }}>
                <p className="mt-6 max-w-4xl text-[13px] leading-relaxed text-white/70">
                  {t.s8_t2}
                </p>
              </div>

              <div 
                className="mt-4 md:mt-12 flex md:grid flex-nowrap md:grid-cols-2 gap-4 md:gap-8 pb-6 md:pb-0 transition-transform duration-100 ease-out"
                style={{ transform: isMobile ? `translateX(${s8MobileTranslateX}vw)` : "none" }}
              >
                {/* Card 1 */}
                <div className="shrink-0 w-[85vw] md:w-auto relative aspect-[4/3] sm:aspect-square md:aspect-[5/4] overflow-hidden border border-white/10 rounded-2xl md:rounded-none" style={{ opacity: isMobile ? s8R1Op : s8R1Op, transform: isMobile ? "none" : `translateX(${s8C1X}px)` }}>
                  <Image src={platformModule} alt={t.s8_c1_t} className="absolute inset-0 h-full w-full object-cover opacity-50 grayscale transition-transform duration-700 hover:scale-105" placeholder="blur" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 p-6 md:p-10 pointer-events-none">
                    <h3 className="text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-tight text-white">{t.s8_c1_t}</h3>
                    <p className="mt-2 text-[11px] md:text-[10px] text-white/80">{t.s8_c1_p}</p>
                  </div>
                </div>
                
                {/* Card 2 */}
                <div className="shrink-0 w-[85vw] md:w-auto relative aspect-[4/3] sm:aspect-square md:aspect-[5/4] overflow-hidden border border-white/10 rounded-2xl md:rounded-none" style={{ opacity: isMobile ? s8R1Op : s8R1Op, transform: isMobile ? "none" : `translateX(${s8C2X}px)` }}>
                  <Image src={platformModule} alt={t.s8_c2_t} className="absolute inset-0 h-full w-full object-cover opacity-50 grayscale transition-transform duration-700 hover:scale-105" placeholder="blur" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 p-6 md:p-10 pointer-events-none">
                    <h3 className="text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-tight text-white">{t.s8_c2_t}</h3>
                    <p className="mt-2 text-[11px] md:text-[10px] text-white/80">{t.s8_c2_p}</p>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="shrink-0 w-[85vw] md:w-auto relative aspect-[4/3] sm:aspect-square md:aspect-[5/4] overflow-hidden border border-white/10 rounded-2xl md:rounded-none" style={{ opacity: isMobile ? s8R1Op : s8R2Op, transform: isMobile ? "none" : `translateX(${s8C3X}px)` }}>
                  <Image src={platformModule} alt={t.s8_c3_t} className="absolute inset-0 h-full w-full object-cover opacity-50 grayscale transition-transform duration-700 hover:scale-105" placeholder="blur" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 p-6 md:p-10 pointer-events-none">
                    <h3 className="text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-tight text-white">{t.s8_c3_t}</h3>
                    <p className="mt-2 text-[11px] md:text-[10px] text-white/80">{t.s8_c3_p}</p>
                  </div>
                </div>
                
                {/* Card 4 */}
                <div className="shrink-0 w-[85vw] md:w-auto relative aspect-[4/3] sm:aspect-square md:aspect-[5/4] overflow-hidden border border-white/10 rounded-2xl md:rounded-none" style={{ opacity: isMobile ? s8R1Op : s8R2Op, transform: isMobile ? "none" : `translateX(${s8C4X}px)` }}>
                  <Image src={platformModule} alt={t.s8_c4_t} className="absolute inset-0 h-full w-full object-cover opacity-50 grayscale transition-transform duration-700 hover:scale-105" placeholder="blur" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 p-6 md:p-10 pointer-events-none">
                    <h3 className="text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-tight text-white">{t.s8_c4_t}</h3>
                    <p className="mt-2 text-[11px] md:text-[10px] text-white/80">{t.s8_c4_p}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
