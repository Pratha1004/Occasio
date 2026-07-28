"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Ticket, Bookmark, Moon, Sun, LogOut, User, Settings } from "lucide-react";
import { useTheme, useDrawer, useNavigation, useBookedTickets } from "@/providers/AppProvider";
import { cn } from "@/lib/utils";

export function UserProfileDropdown() {
  const { theme, toggleTheme } = useTheme();
  const { open: openDrawer } = useDrawer();
  const { setActiveTab } = useNavigation();
  const { bookedTickets } = useBookedTickets();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const menuItems = [
    {
      icon: Ticket,
      label: "My Tickets",
      badge: bookedTickets.length || null,
      action: () => { setActiveTab("tickets"); setOpen(false); },
    },
    {
      icon: Bookmark,
      label: "Saved Events",
      action: () => { openDrawer(); setOpen(false); },
    },
    {
      icon: theme === "dark" ? Sun : Moon,
      label: theme === "dark" ? "Light Mode" : "Dark Mode",
      action: () => { toggleTheme(); setOpen(false); },
    },
    {
      icon: Settings,
      label: "Account Settings",
      action: () => setOpen(false),
    },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        suppressHydrationWarning
        className="flex items-center gap-2 rounded-lg border border-border bg-card px-2 py-1.5 transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="User profile menu"
        aria-expanded={open}
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background text-[11px] font-bold">
          PS
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-11 z-50 w-52 rounded-xl border border-border bg-card shadow-[var(--shadow-hover)] overflow-hidden"
          >
            {/* Profile Header */}
            <div className="px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-background text-[11px] font-bold">
                  PS
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-foreground">Prabh Singh</p>
                  <p className="text-[10px] text-muted-foreground">prabh@occasio.app</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1.5">
              {menuItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={item.action}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-secondary/40 transition-colors"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Logout */}
            <div className="border-t border-border py-1.5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50/60 dark:hover:bg-red-950/30 transition-colors"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
