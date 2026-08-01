"use client";

import React, { useState, useRef, useEffect } from "react";

export interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

export const ALL_COUNTRIES: Country[] = [
  { name: "United States", code: "US", dialCode: "+1", flag: "🇺🇸" },
  { name: "Canada", code: "CA", dialCode: "+1", flag: "🇨🇦" },
  { name: "United Kingdom", code: "GB", dialCode: "+44", flag: "🇬🇧" },
  { name: "Germany", code: "DE", dialCode: "+49", flag: "🇩🇪" },
  { name: "France", code: "FR", dialCode: "+33", flag: "🇫🇷" },
  { name: "Spain", code: "ES", dialCode: "+34", flag: "🇪🇸" },
  { name: "Italy", code: "IT", dialCode: "+39", flag: "🇮🇹" },
  { name: "Switzerland", code: "CH", dialCode: "+41", flag: "🇨🇭" },
  { name: "Netherlands", code: "NL", dialCode: "+31", flag: "🇳🇱" },
  { name: "Belgium", code: "BE", dialCode: "+32", flag: "🇧🇪" },
  { name: "Sweden", code: "SE", dialCode: "+46", flag: "🇸🇪" },
  { name: "Norway", code: "NO", dialCode: "+47", flag: "🇳🇴" },
  { name: "Denmark", code: "DK", dialCode: "+45", flag: "🇩🇰" },
  { name: "Finland", code: "FI", dialCode: "+358", flag: "🇫🇮" },
  { name: "Poland", code: "PL", dialCode: "+48", flag: "🇵🇱" },
  { name: "Austria", code: "AT", dialCode: "+43", flag: "🇦🇹" },
  { name: "United Arab Emirates", code: "AE", dialCode: "+971", flag: "🇦🇪" },
  { name: "Saudi Arabia", code: "SA", dialCode: "+966", flag: "🇸🇦" },
  { name: "Qatar", code: "QA", dialCode: "+974", flag: "🇶🇦" },
  { name: "Kuwait", code: "KW", dialCode: "+965", flag: "🇰🇼" },
  { name: "Bahrain", code: "BH", dialCode: "+973", flag: "🇧🇭" },
  { name: "Oman", code: "OM", dialCode: "+968", flag: "🇴🇲" },
  { name: "Singapore", code: "SG", dialCode: "+65", flag: "🇸🇬" },
  { name: "Japan", code: "JP", dialCode: "+81", flag: "🇯🇵" },
  { name: "South Korea", code: "KR", dialCode: "+82", flag: "🇰🇷" },
  { name: "China", code: "CN", dialCode: "+86", flag: "🇨🇳" },
  { name: "India", code: "IN", dialCode: "+91", flag: "🇮🇳" },
  { name: "Australia", code: "AU", dialCode: "+61", flag: "🇦🇺" },
  { name: "New Zealand", code: "NZ", dialCode: "+64", flag: "🇳🇿" },
  { name: "Brazil", code: "BR", dialCode: "+55", flag: "🇧🇷" },
  { name: "Mexico", code: "MX", dialCode: "+52", flag: "🇲🇽" },
  { name: "Argentina", code: "AR", dialCode: "+54", flag: "🇦🇷" },
  { name: "Chile", code: "CL", dialCode: "+56", flag: "🇨🇱" },
  { name: "Colombia", code: "CO", dialCode: "+57", flag: "🇨🇴" },
  { name: "South Africa", code: "ZA", dialCode: "+27", flag: "🇿🇦" },
  { name: "Egypt", code: "EG", dialCode: "+20", flag: "🇪🇬" },
  { name: "Israel", code: "IL", dialCode: "+972", flag: "🇮🇱" },
  { name: "Turkey", code: "TR", dialCode: "+90", flag: "🇹🇷" },
  { name: "Greece", code: "GR", dialCode: "+30", flag: "🇬🇷" },
  { name: "Portugal", code: "PT", dialCode: "+351", flag: "🇵🇹" },
  { name: "Ireland", code: "IE", dialCode: "+353", flag: "🇮🇪" },
  { name: "Malaysia", code: "MY", dialCode: "+60", flag: "🇲🇾" },
  { name: "Thailand", code: "TH", dialCode: "+66", flag: "🇹🇭" },
  { name: "Indonesia", code: "ID", dialCode: "+62", flag: "🇮🇩" },
  { name: "Vietnam", code: "VN", dialCode: "+84", flag: "🇻🇳" },
  { name: "Philippines", code: "PH", dialCode: "+63", flag: "🇵🇭" },
];

/**
 * Dynamically formats phone numbers as the user types
 */
export function formatPhoneNumberDynamic(val: string): string {
  const digits = val.replace(/\D/g, "");
  if (!digits) return "";

  // 10 digit standard formatting: (xxx) xxx-xxxx
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 6) {
    return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  } else if (digits.length <= 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  } else {
    // For international longer numbers (11-15 digits), group in blocks of 3 or 4
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)} ${digits.slice(10, 15)}`.trim();
  }
}

interface InternationalPhoneInputProps {
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
  phone: string;
  onPhoneChange: (phone: string) => void;
  placeholder?: string;
  className?: string;
}

export function InternationalPhoneInput({
  countryCode,
  onCountryCodeChange,
  phone,
  onPhoneChange,
  placeholder = "555 019 9000",
}: InternationalPhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCountry =
    ALL_COUNTRIES.find((c) => c.dialCode === countryCode) || ALL_COUNTRIES[0];

  const filteredCountries = ALL_COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dialCode.includes(search) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatPhoneNumberDynamic(raw);
    onPhoneChange(formatted);
  };

  return (
    <div className="flex relative w-full bg-[#f9f9f9] rounded-xl border border-transparent focus-within:border-[#00E573] focus-within:ring-1 focus-within:ring-[#00E573] transition-all" ref={dropdownRef}>
      {/* Country Code Trigger */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setSearch("");
        }}
        className="flex items-center gap-1.5 px-3.5 py-4 border-r border-black/10 text-[13px] font-semibold text-black hover:bg-black/5 rounded-l-xl transition-colors cursor-pointer select-none"
      >
        <span className="text-base">{selectedCountry.flag}</span>
        <span>{selectedCountry.dialCode}</span>
        <svg
          className={`w-3 h-3 text-black/50 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] left-0 z-50 w-[280px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-black/10 p-2 max-h-[280px] flex flex-col">
          <div className="p-2 border-b border-black/5">
            <input
              type="text"
              placeholder="Search country or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#f4f5f7] rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-[#00E573] text-black"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto flex-1 py-1 space-y-0.5">
            {filteredCountries.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => {
                  onCountryCodeChange(c.dialCode);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer text-left ${
                  countryCode === c.dialCode
                    ? "bg-[#00E573]/20 font-bold text-black"
                    : "hover:bg-black/5 text-black/80"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{c.flag}</span>
                  <span className="truncate max-w-[150px]">{c.name}</span>
                </div>
                <span className="text-black/50 font-mono text-[11px]">{c.dialCode}</span>
              </button>
            ))}
            {filteredCountries.length === 0 && (
              <div className="py-4 text-center text-xs text-black/40">No matching country found</div>
            )}
          </div>
        </div>
      )}

      {/* Phone Number Input */}
      <input
        type="tel"
        value={phone}
        onChange={handlePhoneInput}
        placeholder={placeholder}
        className="w-full bg-transparent rounded-r-xl px-4 py-4 text-[13px] outline-none text-black"
      />
    </div>
  );
}
