"use client";

import { useState, useEffect } from "react";
import {
  Compass, LayoutGrid, Calendar, Map, Bookmark,
  Ticket, Users, Plus, HelpCircle, X, Gift, Moon, Sun, Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Logo } from "@/components/ui/Logo";
import {
  useTheme, useSavedEvents, useDrawer, useNavigation,
  useModals, useBookedTickets,
} from "@/providers/AppProvider";
import { cn } from "@/lib/utils";
import type { NavigationTab } from "@/lib/types";

const navItems: {
  id: NavigationTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: "saved" | "tickets";
}[] = [
  { id: "discover",   label: "Discover",       icon: Compass },
  { id: "categories", label: "Categories",     icon: LayoutGrid },
  { id: "calendar",   label: "Calendar",       icon: Calendar },
  { id: "map",        label: "Map",            icon: Map },
  { id: "saved",      label: "Saved",          icon: Bookmark, badge: "saved" },
  { id: "tickets",    label: "My Tickets",     icon: Ticket,   badge: "tickets" },
  { id: "organizers", label: "For Organizers", icon: Users },
];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const { savedCount } = useSavedEvents();
  const { bookedTickets } = useBookedTickets();
  const { open: openDrawer } = useDrawer();
  const { theme, toggleTheme } = useTheme();
  const { activeTab, setActiveTab } = useNavigation();
  const { openCreateEventModal } = useModals();

  const [copiedInvite, setCopiedInvite] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSendInvite = async () => {
    const inviteUrl = typeof window !== "undefined" ? window.location.origin : "https://occasio.app";
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(inviteUrl);
      }
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2500);
  };

  const handleNavClick = (itemId: NavigationTab) => {
    if (itemId === "saved") openDrawer();
    else setActiveTab(itemId);
    onMobileClose();
  };

  const getBadgeCount = (badge?: "saved" | "tickets") => {
    if (!mounted) return 0;
    if (badge === "saved") return savedCount;
    if (badge === "tickets") return bookedTickets.length;
    return 0;
  };

  const content = (
    <aside
      className="flex h-full w-[220px] shrink-0 flex-col border-r border-border bg-sidebar"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="border-b border-border px-5 py-4 shrink-0">
        <button
          type="button"
          onClick={() => handleNavClick("discover")}
          className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
          title="Go to Discover Main Page"
        >
          <Logo showTagline size="sm" />
        </button>
      </div>

      {/* Navigation section label */}
      <div className="px-4 pt-5 pb-1 shrink-0">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
          Navigation
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-none px-2 pb-3" role="navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const badgeCount = getBadgeCount(item.badge);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={cn(
                "relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary mt-0.5",
                isActive
                  ? "bg-sidebar-active text-primary font-semibold"
                  : "text-muted-foreground hover:bg-surface hover:text-foreground font-medium"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="flex-1">{item.label}</span>
              {item.badge && badgeCount > 0 && (
                <span className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums leading-none",
                  isActive
                    ? "bg-primary text-white"
                    : "bg-border text-muted-foreground"
                )}>
                  {badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-4 border-t border-border my-2 shrink-0" />

      {/* Create Event */}
      <div className="px-3 mb-4 shrink-0">
        <button
          type="button"
          onClick={() => { openCreateEventModal(); onMobileClose(); }}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary bg-primary/5 py-2.5 text-[13px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Create Event
        </button>
      </div>

      {/* Invite card — clean, no characters */}
      <div className="mx-3 mb-3 rounded-xl border border-border bg-card overflow-hidden shrink-0">
        <div className="p-4">
          <p className="text-[13px] font-semibold text-foreground leading-snug">
            Invite your team
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
            Share Occasio with colleagues and get access to exclusive group features.
          </p>
          <button
            type="button"
            onClick={handleSendInvite}
            className={cn(
              "mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border py-2 text-[11px] font-semibold transition-all cursor-pointer",
              copiedInvite
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-border bg-surface text-foreground hover:bg-border"
            )}
          >
            {copiedInvite ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                Invite Link Copied!
              </>
            ) : (
              <>
                <Gift className="h-3.5 w-3.5 text-muted-foreground" />
                Send Invite
              </>
            )}
          </button>
        </div>
      </div>

      {/* Theme toggle */}
      <div className="px-3 mb-2 shrink-0">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] text-muted-foreground border border-border bg-card hover:bg-surface transition-colors"
          aria-label="Toggle colour scheme"
        >
          {theme === "dark" ? (
            <Sun className="h-3.5 w-3.5 shrink-0" />
          ) : (
            <Moon className="h-3.5 w-3.5 shrink-0" />
          )}
          <span className="text-[12px] font-medium">
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </span>
          <div className={cn(
            "ml-auto relative h-[18px] w-8 rounded-full transition-colors",
            theme === "dark" ? "bg-primary" : "bg-border"
          )}>
            <div className={cn(
              "absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white shadow transition-transform",
              theme === "dark" ? "translate-x-[14px]" : "translate-x-0.5"
            )} />
          </div>
        </button>
      </div>

      {/* Help */}
      <div className="px-3 pb-5 shrink-0">
        <button
          type="button"
          className="flex w-full items-center gap-2 px-2 py-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none"
        >
          <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
          Help & Support
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden lg:block h-full">{content}</div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={onMobileClose}
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <button
                type="button"
                onClick={onMobileClose}
                className="absolute right-3 top-3 z-10 rounded-lg p-2 text-muted-foreground hover:bg-surface focus-visible:outline-none"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function MobileMenuButton({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        className
      )}
      aria-label="Open navigation menu"
    >
      <svg className="h-4 w-4 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
}
