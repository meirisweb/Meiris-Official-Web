import React from "react";

export const GREEN = "oklch(0.78 0.19 155)";

export function ChipGraphic() {
  return (
    <svg viewBox="0 0 400 400" className="h-auto w-full max-w-[220px] md:max-w-[420px]" aria-hidden>
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={GREEN} stopOpacity="0.8" />
          <stop offset="40%" stopColor={GREEN} stopOpacity="0.3" />
          <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Background Grid */}
      <g stroke={GREEN} strokeWidth="1" opacity="0.2">
        <line x1="50" y1="50" x2="350" y2="50" />
        <line x1="50" y1="350" x2="350" y2="350" />
        <line x1="50" y1="50" x2="50" y2="350" />
        <line x1="350" y1="50" x2="350" y2="350" />
      </g>
      {/* Glow */}
      <rect x="150" y="150" width="100" height="100" fill="url(#glow)" />
      {/* Central Square Box */}
      <rect x="110" y="110" width="180" height="180" fill="none" stroke={GREEN} strokeWidth="2" />
      {/* Corner dots */}
      <circle cx="110" cy="110" r="5" fill={GREEN} />
      <circle cx="290" cy="110" r="5" fill={GREEN} />
      <circle cx="110" cy="290" r="5" fill={GREEN} />
      <circle cx="290" cy="290" r="5" fill={GREEN} />
      {/* Pins - Top */}
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={`t${i}`} x1={135 + i * 26} y1={50} x2={135 + i * 26} y2={110} stroke={GREEN} strokeWidth="2" />
      ))}
      {/* Pins - Bottom */}
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={`b${i}`} x1={135 + i * 26} y1={290} x2={135 + i * 26} y2={350} stroke={GREEN} strokeWidth="2" />
      ))}
      {/* Pins - Left */}
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={`l${i}`} x1={50} y1={135 + i * 26} x2={110} y2={135 + i * 26} stroke={GREEN} strokeWidth="2" />
      ))}
      {/* Pins - Right */}
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={`r${i}`} x1={290} y1={135 + i * 26} x2={350} y2={135 + i * 26} stroke={GREEN} strokeWidth="2" />
      ))}
      {/* Text */}
      <text x="200" y="200" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">SiC MOSFET</text>
      <text x="200" y="240" textAnchor="middle" fill={GREEN} fontSize="12">30 kW : 650 V</text>
    </svg>
  );
}

export function NetworkGraphic() {
  const nodes = [
    [70, 70], [190, 90], [310, 60], [360, 140],
    [110, 190], [240, 170], [320, 260],
    [50, 280], [160, 270], [250, 350],
  ];
  const edges = [
    [0, 1], [0, 4], [1, 2], [1, 5], [2, 3], [3, 6],
    [4, 5], [4, 7], [5, 6], [5, 8], [6, 9], [7, 8], [8, 9]
  ];
  return (
    <svg viewBox="0 0 400 400" className="h-auto w-full max-w-[240px] md:max-w-[520px]" aria-hidden>
      <g stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none">
        {edges.map(([a, b], i) => (
          <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} />
        ))}
      </g>
      {nodes.map(([x, y], i) => (
        <g key={i}>
          {i === 5 ? (
            <>
              <circle cx={x} cy={y} r="22" fill="none" stroke="#ef4444" strokeWidth="1.5" />
              <circle cx={x} cy={y} r="14" fill="none" stroke={GREEN} strokeWidth="1.5" />
            </>
          ) : (
             <circle cx={x} cy={y} r="14" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          )}
          <circle cx={x} cy={y} r="5" fill={GREEN} />
        </g>
      ))}
    </svg>
  );
}

export function ThreeLayers() {
  return (
    <svg viewBox="0 0 400 300" className="h-auto w-full max-w-[200px] md:max-w-[360px]" aria-hidden>
      <defs>
        <radialGradient id="greenGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={GREEN} stopOpacity="0.2" />
          <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="blueGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <line x1="200" y1="50" x2="200" y2="250" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 4" />
      <g fontFamily="system-ui" textAnchor="middle">
        <g transform="translate(0, 40)">
          <polygon points="200,0 320,40 200,80 80,40" fill="url(#greenGlow)" stroke={GREEN} strokeWidth="1.5" />
          <polygon points="200,0 320,40 200,80 80,40" fill="rgba(0,0,0,0.6)" />
          <text x="200" y="38" fill="white" fontSize="12" fontWeight="bold">Firmware Intelligence</text>
          <text x="200" y="54" fill={GREEN} fontSize="9">AI Scheduling - DCPP</text>
        </g>
        <g transform="translate(0, 110)">
          <polygon points="200,0 320,40 200,80 80,40" fill="url(#blueGlow)" stroke="#3b82f6" strokeWidth="1.5" />
          <polygon points="200,0 320,40 200,80 80,40" fill="rgba(0,0,0,0.6)" />
          <text x="200" y="38" fill="white" fontSize="12" fontWeight="bold">Control Architecture</text>
          <text x="200" y="54" fill="#3b82f6" fontSize="9">Real-Time DSP</text>
        </g>
        <g transform="translate(0, 180)">
          <polygon points="200,0 320,40 200,80 80,40" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          <polygon points="200,0 320,40 200,80 80,40" fill="rgba(0,0,0,0.6)" />
          <text x="200" y="38" fill="white" fontSize="12" fontWeight="bold">Silicon Foundation</text>
          <text x="200" y="54" fill="rgba(255,255,255,0.5)" fontSize="9">SiC MOSFET - 850V</text>
        </g>
      </g>
    </svg>
  );
}
