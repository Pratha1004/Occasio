"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, Ticket, Megaphone, Star, X, CheckCheck } from "lucide-react";
import { useNotifications } from "@/providers/AppProvider";
import { cn } from "@/lib/utils";
import type { AppNotification } from "@/lib/types";

const NOTIF_ICONS: Record<AppNotification["type"], typeof Bell> = {
  ticket: Ticket,
  promo: Star,
  system: Megaphone,
};

const NOTIF_COLORS: Record<AppNotification["type"], string> = {
  ticket: "bg-blue-500/10 text-blue-500",
  promo: "bg-amber-500/10 text-amber-500",
  system: "bg-violet-500/10 text-violet-500",
};

export function NotificationsDropdown() {
  const { notifications, unreadCount, markAsRead, clearAll } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label={`Notifications, ${unreadCount} unread`}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-12 z-50 w-76 rounded-xl border border-border bg-card shadow-[var(--shadow-hover)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="text-sm font-extrabold text-foreground">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => notifications.filter(n => !n.read).forEach(n => markAsRead(n.id))}
                    className="flex items-center gap-1 text-[10px] font-semibold text-primary hover:underline"
                  >
                    <CheckCheck className="h-3 w-3" />
                    Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-[10px] font-semibold text-muted-foreground hover:text-red-500 ml-2"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            {/* Notification list */}
            <div className="max-h-72 overflow-y-auto scrollbar-thin">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
                  <Bell className="h-8 w-8 text-muted-foreground/40" />
                  <p className="text-xs text-muted-foreground">All caught up!</p>
                </div>
              ) : (
                notifications.map((notif) => {
                  const Icon = NOTIF_ICONS[notif.type];
                  return (
                    <div
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={cn(
                        "flex items-start gap-3 px-4 py-3 cursor-pointer border-b border-border/60 last:border-0 transition-colors",
                        notif.read ? "bg-card" : "bg-primary/5 hover:bg-primary/8"
                      )}
                    >
                      <div className={cn(
                        "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
                        NOTIF_COLORS[notif.type]
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn("text-xs font-bold text-foreground leading-tight", !notif.read && "text-foreground")}>
                            {notif.title}
                          </p>
                          {!notif.read && (
                            <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-muted-foreground/60 mt-1 block">
                          {notif.time}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
