"use client";

import React, { useState, useRef, useEffect } from "react";
import { AsYouType } from "libphonenumber-js";

export interface Country {
  name: string;
  code: string;
  dialCode: string;
  placeholder: string;
}

export const COUNTRIES: Country[] = [
  { name: "United States", code: "US", dialCode: "+1", placeholder: "(201) 555-0123" },
  { name: "Canada", code: "CA", dialCode: "+1", placeholder: "(416) 555-0199" },
  { name: "United Kingdom", code: "GB", dialCode: "+44", placeholder: "07911 123456" },
  { name: "India", code: "IN", dialCode: "+91", placeholder: "81234 56789" },
  { name: "United Arab Emirates", code: "AE", dialCode: "+971", placeholder: "050 123 4567" },
  { name: "Saudi Arabia", code: "SA", dialCode: "+966", placeholder: "050 123 4567" },
  { name: "Germany", code: "DE", dialCode: "+49", placeholder: "0151 12345678" },
  { name: "France", code: "FR", dialCode: "+33", placeholder: "06 12 34 56 78" },
  { name: "Spain", code: "ES", dialCode: "+34", placeholder: "612 34 56 78" },
  { name: "Italy", code: "IT", dialCode: "+39", placeholder: "312 345 6789" },
  { name: "Switzerland", code: "CH", dialCode: "+41", placeholder: "078 123 45 67" },
  { name: "Netherlands", code: "NL", dialCode: "+31", placeholder: "06 12345678" },
  { name: "Sweden", code: "SE", dialCode: "+46", placeholder: "070-123 45 67" },
  { name: "Norway", code: "NO", dialCode: "+47", placeholder: "41 23 45 67" },
  { name: "Denmark", code: "DK", dialCode: "+45", placeholder: "20 12 34 56" },
  { name: "Finland", code: "FI", dialCode: "+358", placeholder: "040 1234567" },
  { name: "Poland", code: "PL", dialCode: "+48", placeholder: "512 345 678" },
  { name: "Austria", code: "AT", dialCode: "+43", placeholder: "0664 1234567" },
  { name: "Qatar", code: "QA", dialCode: "+974", placeholder: "3312 3456" },
  { name: "Kuwait", code: "KW", dialCode: "+965", placeholder: "5000 0000" },
  { name: "Bahrain", code: "BH", dialCode: "+973", placeholder: "3600 0000" },
  { name: "Oman", code: "OM", dialCode: "+968", placeholder: "9123 4567" },
  { name: "Singapore", code: "SG", dialCode: "+65", placeholder: "8123 4567" },
  { name: "Japan", code: "JP", dialCode: "+81", placeholder: "090-1234-5678" },
  { name: "South Korea", code: "KR", dialCode: "+82", placeholder: "010-1234-5678" },
  { name: "China", code: "CN", dialCode: "+86", placeholder: "138 0000 0000" },
  { name: "Australia", code: "AU", dialCode: "+61", placeholder: "0412 345 678" },
  { name: "New Zealand", code: "NZ", dialCode: "+64", placeholder: "021 123 4567" },
  { name: "Brazil", code: "BR", dialCode: "+55", placeholder: "(11) 91234-5678" },
  { name: "Mexico", code: "MX", dialCode: "+52", placeholder: "55 1234 5678" },
  { name: "Argentina", code: "AR", dialCode: "+54", placeholder: "11 1234-5678" },
  { name: "Chile", code: "CL", dialCode: "+56", placeholder: "9 1234 5678" },
  { name: "Colombia", code: "CO", dialCode: "+57", placeholder: "300 1234567" },
  { name: "South Africa", code: "ZA", dialCode: "+27", placeholder: "071 123 4567" },
  { name: "Egypt", code: "EG", dialCode: "+20", placeholder: "0100 123 4567" },
  { name: "Israel", code: "IL", dialCode: "+972", placeholder: "050-123-4567" },
  { name: "Turkey", code: "TR", dialCode: "+90", placeholder: "501 234 5678" },
  { name: "Greece", code: "GR", dialCode: "+30", placeholder: "691 234 5678" },
  { name: "Portugal", code: "PT", dialCode: "+351", placeholder: "912 345 678" },
  { name: "Ireland", code: "IE", dialCode: "+353", placeholder: "083 123 4567" },
  { name: "Malaysia", code: "MY", dialCode: "+60", placeholder: "012-345 6789" },
  { name: "Thailand", code: "TH", dialCode: "+66", placeholder: "081 234 5678" },
  { name: "Indonesia", code: "ID", dialCode: "+62", placeholder: "0812-3456-7890" },
  { name: "Vietnam", code: "VN", dialCode: "+84", placeholder: "090 123 45 67" },
  { name: "Philippines", code: "PH", dialCode: "+63", placeholder: "0917 123 4567" },
];

interface IntlPhoneInputProps {
  value: string;
  onChange: (phone: string) => void;
  onCountryChange?: (dialCode: string, countryCode: string) => void;
  className?: string;
}

export function IntlPhoneInput({
  value,
  onChange,
  onCountryChange,
  className = "",
}: IntlPhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCode, setSelectedCode] = useState<string>("IN");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCountry =
    COUNTRIES.find((c) => c.code === selectedCode) || COUNTRIES[0];

  const filteredCountries = COUNTRIES.filter(
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

  useEffect(() => {
    if (onCountryChange && selectedCountry) {
      onCountryChange(selectedCountry.dialCode, selectedCountry.code);
    }
  }, [selectedCode]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    try {
      const formatter = new AsYouType(selectedCountry.code as any);
      const formatted = formatter.input(raw);
      onChange(formatted);
    } catch {
      onChange(raw);
    }
  };

  const selectCountry = (country: Country) => {
    setSelectedCode(country.code);
    setIsOpen(false);
    setSearch("");
    if (value) {
      try {
        const formatter = new AsYouType(country.code as any);
        const formatted = formatter.input(value.replace(/\D/g, ""));
        onChange(formatted);
      } catch {
        onChange(value);
      }
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={`flex relative w-full bg-[#f9f9f9] rounded-xl border border-transparent focus-within:border-[#00E573] focus-within:ring-1 focus-within:ring-[#00E573] transition-all ${className}`}
    >
      {/* Country Selector Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setSearch("");
        }}
        className="flex items-center gap-2 px-4 py-4 border-r border-black/10 text-[13px] font-semibold text-black hover:bg-black/5 rounded-l-xl transition-colors cursor-pointer select-none"
      >
        <img
          src={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png`}
          alt={selectedCountry.name}
          className="w-5 h-3.5 object-cover rounded-[2px] shadow-sm flex-shrink-0"
        />
        <span className="font-mono font-bold text-black">{selectedCountry.dialCode}</span>
        <svg
          className={`w-3 h-3 text-black/50 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Card - uses data-lenis-prevent and stopPropagation so Lenis never intercepts wheel events */}
      {isOpen && (
        <div
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          className="absolute top-[calc(100%+6px)] left-0 z-[99999] w-full min-w-[280px] max-w-[340px] bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] border border-black/10 p-2.5 flex flex-col"
        >
          {/* Search Input */}
          <div className="relative mb-2">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#f5f6f8] rounded-xl pl-9 pr-4 py-2 text-xs outline-none focus:ring-1 focus:ring-[#00E573] text-black border border-black/5"
              autoFocus
            />
          </div>

          {/* Scrollable Country List */}
          <div
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            className="max-h-[180px] overflow-y-auto space-y-0.5 pr-1"
            style={{ overscrollBehavior: "contain" }}
          >
            {filteredCountries.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => selectCountry(c)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors cursor-pointer text-left ${
                  selectedCode === c.code
                    ? "bg-[#00E573]/20 font-bold text-black"
                    : "hover:bg-black/5 text-black/85"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`}
                    alt={c.name}
                    className="w-5 h-3.5 object-cover rounded-[2px] shadow-sm flex-shrink-0"
                  />
                  <span className="truncate">{c.name}</span>
                </div>
                <span className="text-black/60 font-mono text-[11px] font-semibold ml-2">
                  {c.dialCode}
                </span>
              </button>
            ))}
            {filteredCountries.length === 0 && (
              <div className="py-6 text-center text-xs text-black/40">No matching country found</div>
            )}
          </div>
        </div>
      )}

      {/* Phone Number Input */}
      <input
        type="tel"
        value={value}
        onChange={handlePhoneChange}
        placeholder={selectedCountry.placeholder}
        className="w-full bg-transparent rounded-r-xl px-4 py-4 text-[13px] outline-none text-black font-medium placeholder:text-black/40"
      />
    </div>
  );
}
