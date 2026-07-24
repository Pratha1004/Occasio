"use client";

import { ChevronDown, SlidersHorizontal, LayoutGrid, Calendar, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";
import { useFilters } from "@/providers/AppProvider";
import { CATEGORY_LABELS, type DateFilter, type PriceFilter } from "@/lib/types";
import { getActiveFilterCount } from "@/lib/utils";
import { cn } from "@/lib/utils";

const dateOptions: { value: DateFilter; label: string }[] = [
  { value: "all", label: "Any Date" },
  { value: "today", label: "Today" },
  { value: "this-weekend", label: "This Weekend" },
  { value: "this-month", label: "This Month" },
];

const priceOptions: { value: PriceFilter; label: string }[] = [
  { value: "any", label: "Any Price" },
  { value: "free", label: "Free" },
  { value: "under-1000", label: "Under ₹1,000" },
  { value: "1000-2500", label: "₹1,000 – ₹2,500" },
  { value: "2500-plus", label: "₹2,500+" },
];

interface FilterSelectProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  icon: React.ComponentType<{ className?: string }>;
}

function FilterSelect<T extends string>({
  label,
  value,
  options,
  onChange,
  icon: Icon,
}: FilterSelectProps<T>) {
  const id = `filter-${label.toLowerCase().replace(/\s/g, "-")}`;
  const selectedLabel = options.find((opt) => opt.value === value)?.label || "";

  return (
    <div className="relative flex flex-1 items-center gap-2.5 sm:gap-3.5 border-b sm:border-b-0 sm:border-r border-border px-4 py-2.5 sm:px-5 hover:bg-secondary/20 transition-colors min-w-0">
      {/* Icon Left */}
      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-foreground shrink-0" aria-hidden="true" />
      
      {/* Texts Stack */}
      <div className="flex flex-col text-left select-none min-w-0 flex-1">
        <label htmlFor={id} className="text-[9px] sm:text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider leading-none mb-0.5">
          {label}
        </label>
        <span className="text-[11px] sm:text-xs font-bold text-foreground leading-none truncate">
          {selectedLabel}
        </span>
      </div>

      {/* Chevron Right */}
      <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground ml-auto shrink-0" aria-hidden="true" />

      {/* Overlay native select */}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 bg-card text-foreground"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-card text-foreground">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function FilterBar() {
  const { filters, setCategory, setDate, setPrice, setFreeOnly } = useFilters();
  const activeCount = getActiveFilterCount(filters);

  const categoryOptions = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
    value: value as typeof filters.category,
    label,
  }));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.25 }}
      className="grid grid-cols-2 sm:grid-cols-4 md:flex md:flex-nowrap items-stretch rounded-xl border border-border bg-card overflow-hidden"
      role="group"
      aria-label="Event filters"
    >
      {/* Category Filter */}
      <FilterSelect
        label="Category"
        value={filters.category}
        options={categoryOptions}
        onChange={setCategory}
        icon={LayoutGrid}
      />

      {/* Date Filter */}
      <FilterSelect
        label="Date"
        value={filters.date}
        options={dateOptions}
        onChange={setDate}
        icon={Calendar}
      />

      {/* Price Filter */}
      <FilterSelect
        label="Price"
        value={filters.price}
        options={priceOptions}
        onChange={setPrice}
        icon={IndianRupee}
      />

      {/* Free Events Switch toggle */}
      <div className="flex flex-col justify-center items-center gap-1 border-r border-border px-4 py-2.5 sm:px-6 md:flex-none">
        <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider leading-none mb-1 select-none">
          Free Events
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={filters.freeOnly}
          onClick={() => setFreeOnly(!filters.freeOnly)}
          className={cn(
            "relative h-5 w-9 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer",
            filters.freeOnly ? "bg-primary" : "bg-border",
          )}
        >
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={cn(
              "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-xs",
              filters.freeOnly ? "left-[18px]" : "left-0.5",
            )}
          />
        </button>
      </div>

      {/* Advanced Filters indicator */}
      <div className="col-span-2 sm:col-span-4 md:col-span-1 flex items-center justify-center gap-2.5 px-4 py-2.5 bg-secondary/10 md:ml-auto shrink-0 select-none border-t md:border-t-0 border-border">
        <SlidersHorizontal className="h-4 w-4 text-foreground/80" aria-hidden="true" />
        <span className="text-xs font-semibold text-muted-foreground">Filters</span>
        {activeCount > 0 && (
          <motion.span
            key={activeCount}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-xs"
          >
            {activeCount}
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}
