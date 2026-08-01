"use client";

import React, { useState, useEffect, useRef } from "react";
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, X, Check } from "lucide-react";

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const SHORT_WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// Business hours: 8 AM to 6 PM
const AM_HOURS = ["08", "09", "10", "11"];
const PM_HOURS = ["12", "01", "02", "03", "04", "05", "06"];
const MINUTES = ["00", "15", "30", "45"];

export default function DateTimePicker({
  value,
  onChange,
  placeholder = "Select preferred date & time",
  className = "",
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Internal selection state
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const [selectedDay, setSelectedDay] = useState<number | null>(() => {
    // If today is Sunday (0), default to tomorrow
    if (today.getDay() === 0) {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return tomorrow.getDate();
    }
    return today.getDate();
  });
  const [selectedMonth, setSelectedMonth] = useState<number>(() => {
    if (today.getDay() === 0) {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return tomorrow.getMonth();
    }
    return today.getMonth();
  });
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    if (today.getDay() === 0) {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return tomorrow.getFullYear();
    }
    return today.getFullYear();
  });

  const [hour, setHour] = useState<string>("10");
  const [minute, setMinute] = useState<string>("00");
  const [period, setPeriod] = useState<"AM" | "PM">("AM");

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calendar math
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  // Navigation
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Check if day is disabled (past date OR Sunday)
  const isDayDisabled = (year: number, month: number, day: number) => {
    const checkDate = new Date(year, month, day);
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (checkDate < todayMidnight) return true; // Past day
    if (checkDate.getDay() === 0) return true; // Sunday locked
    return false;
  };

  // Handle AM/PM switch and keep hour within 8 AM - 6 PM
  const handlePeriodChange = (newPeriod: "AM" | "PM") => {
    setPeriod(newPeriod);
    if (newPeriod === "AM" && !AM_HOURS.includes(hour)) {
      setHour("10"); // Default AM working hour
    } else if (newPeriod === "PM" && !PM_HOURS.includes(hour)) {
      setHour("02"); // Default PM working hour
    }
  };

  // Format date & time
  const formatDateTime = (
    y: number,
    m: number,
    d: number,
    h: string,
    min: string,
    p: string
  ) => {
    const dateObj = new Date(y, m, d);
    const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
    const monthName = dateObj.toLocaleDateString("en-US", { month: "short" });
    return `${dayName}, ${monthName} ${d} at ${h}:${min} ${p}`;
  };

  const handleDayClick = (day: number) => {
    if (isDayDisabled(currentYear, currentMonth, day)) return;
    setSelectedDay(day);
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
  };

  const handleConfirm = () => {
    let d = selectedDay;
    let m = selectedMonth;
    let y = selectedYear;

    if (d === null) {
      // Find first available non-Sunday from today
      let check = new Date();
      while (check.getDay() === 0) {
        check.setDate(check.getDate() + 1);
      }
      d = check.getDate();
      m = check.getMonth();
      y = check.getFullYear();
      setSelectedDay(d);
      setSelectedMonth(m);
      setSelectedYear(y);
    }

    const formatted = formatDateTime(y, m, d!, hour, minute, period);
    onChange(formatted);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setIsOpen(false);
  };

  const availableHours = period === "AM" ? AM_HOURS : PM_HOURS;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#f9f9f9] text-gray-900 rounded-xl px-4 py-3.5 text-[13px] border border-black/10 focus-within:border-[#00E573] transition-all cursor-pointer flex items-center justify-between gap-2 select-none hover:bg-[#f2f2f2] ${className}`}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <CalendarIcon className="w-4 h-4 text-[#00E573] flex-shrink-0" />
          <span className={`truncate font-medium ${value ? "text-gray-900" : "text-gray-400"}`}>
            {value || placeholder}
          </span>
        </div>
        {value ? (
          <button
            type="button"
            onClick={handleClear}
            className="w-5 h-5 rounded-full hover:bg-black/10 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
        )}
      </div>

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute bottom-full mb-2 right-0 sm:left-0 z-[200] bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 w-[290px] sm:w-[320px] text-gray-900 animate-in fade-in zoom-in-95 duration-200">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-bold tracking-tight text-gray-900">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="text-[10px] text-gray-500 font-medium mb-3">
            Working Hours: Mon–Sat (8:00 AM – 6:00 PM)
          </div>

          {/* Weekday Names */}
          <div className="grid grid-cols-7 gap-1 mb-1 text-center">
            {SHORT_WEEKDAYS.map((day, idx) => (
              <span
                key={day}
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  idx === 0 ? "text-red-400/70" : "text-gray-400"
                }`}
              >
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4 text-center">
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-8" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const disabled = isDayDisabled(currentYear, currentMonth, dayNum);
              const isSelected =
                selectedDay === dayNum &&
                selectedMonth === currentMonth &&
                selectedYear === currentYear;
              const isToday =
                dayNum === today.getDate() &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear();

              return (
                <button
                  key={dayNum}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleDayClick(dayNum)}
                  className={`h-8 w-8 rounded-full text-xs font-semibold flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-[#00E573] text-black shadow-md font-bold scale-105"
                      : isToday
                      ? "border border-[#00E573] text-[#00E573]"
                      : disabled
                      ? "text-gray-300 cursor-not-allowed opacity-50"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 my-3" />

          {/* Time Picker Section (Locked 8 AM to 6 PM) */}
          <div className="flex flex-col gap-2 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Select Time (8 AM – 6 PM)
            </span>
            <div className="flex items-center justify-between gap-1.5">
              {/* Hour */}
              <div className="flex-1">
                <select
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2 text-xs font-bold text-gray-800 outline-none focus:border-[#00E573]"
                >
                  {availableHours.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
              <span className="text-gray-400 font-bold">:</span>
              {/* Minute */}
              <div className="flex-1">
                <select
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2 text-xs font-bold text-gray-800 outline-none focus:border-[#00E573]"
                >
                  {MINUTES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              {/* AM/PM Toggle */}
              <div className="flex bg-gray-100 p-0.5 rounded-xl border border-gray-200">
                <button
                  type="button"
                  onClick={() => handlePeriodChange("AM")}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold transition-all ${
                    period === "AM"
                      ? "bg-white text-black shadow-sm"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => handlePeriodChange("PM")}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold transition-all ${
                    period === "PM"
                      ? "bg-white text-black shadow-sm"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  PM
                </button>
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full bg-[#0a0a0a] text-white py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-[#00E573] hover:text-black hover:shadow-[0_0_15px_rgba(0,229,115,0.35)] transition-all duration-300 flex items-center justify-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Confirm Date & Time</span>
          </button>
        </div>
      )}
    </div>
  );
}
