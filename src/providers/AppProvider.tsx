"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import initialEventsData from "@/data/events.json";
import type {
  Event,
  FilterState,
  NavigationTab,
  BookedTicket,
  AppNotification,
} from "@/lib/types";

// ─── 1. THEME PROVIDER ───
type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem("occasio-theme") as Theme | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored ?? (prefersDark ? "dark" : "light");
    setThemeState(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    localStorage.setItem("occasio-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [setTheme, theme]);

  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme }),
    [theme, toggleTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

// ─── 2. NAVIGATION PROVIDER ───
interface NavigationContextValue {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<NavigationTab>("discover");

  const value = useMemo(() => ({ activeTab, setActiveTab }), [activeTab]);

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error("useNavigation must be used within NavigationProvider");
  return ctx;
}

// ─── 3. EVENTS & DYNAMIC DATA PROVIDER ───
interface EventsContextValue {
  events: Event[];
  addEvent: (newEvent: Omit<Event, "id" | "attendees">) => Event;
}

const EventsContext = createContext<EventsContextValue | null>(null);

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(initialEventsData as Event[]);

  useEffect(() => {
    const stored = localStorage.getItem("occasio-custom-events");
    if (stored) {
      try {
        const custom: Event[] = JSON.parse(stored);
        setEvents((prev) => [...custom, ...prev]);
      } catch {
        // ignore fallback
      }
    }
  }, []);

  const addEvent = useCallback((newEventData: Omit<Event, "id" | "attendees">): Event => {
    const createdEvent: Event = {
      ...newEventData,
      id: `evt-custom-${Date.now()}`,
      attendees: 1,
    };

    setEvents((prev) => [createdEvent, ...prev]);

    // Persist custom events
    try {
      const stored = localStorage.getItem("occasio-custom-events");
      const currentCustom: Event[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem(
        "occasio-custom-events",
        JSON.stringify([createdEvent, ...currentCustom])
      );
    } catch {
      // ignore fallback
    }

    return createdEvent;
  }, []);

  const value = useMemo(() => ({ events, addEvent }), [events, addEvent]);

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error("useEvents must be used within EventsProvider");
  return ctx;
}

// ─── 4. BOOKED TICKETS PROVIDER ───
interface BookedTicketsContextValue {
  bookedTickets: BookedTicket[];
  bookTicket: (ticket: Omit<BookedTicket, "ticketId" | "bookedAt" | "qrCodeSeed">) => BookedTicket;
  cancelTicket: (ticketId: string) => void;
  isBooked: (eventId: string) => boolean;
}

const BookedTicketsContext = createContext<BookedTicketsContextValue | null>(null);

export function BookedTicketsProvider({ children }: { children: ReactNode }) {
  const [bookedTickets, setBookedTickets] = useState<BookedTicket[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("occasio-booked-tickets");
    if (stored) {
      try {
        setBookedTickets(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse booked tickets", e);
      }
    }
  }, []);

  const persist = useCallback((tickets: BookedTicket[]) => {
    localStorage.setItem("occasio-booked-tickets", JSON.stringify(tickets));
  }, []);

  const bookTicket = useCallback(
    (data: Omit<BookedTicket, "ticketId" | "bookedAt" | "qrCodeSeed">): BookedTicket => {
      const ticket: BookedTicket = {
        ...data,
        ticketId: `TCK-${Math.floor(100000 + Math.random() * 900000)}`,
        bookedAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        qrCodeSeed: `OCCASIO-${data.eventId}-${Date.now()}`,
      };

      setBookedTickets((prev) => {
        const next = [ticket, ...prev];
        persist(next);
        return next;
      });

      return ticket;
    },
    [persist]
  );

  const cancelTicket = useCallback(
    (ticketId: string) => {
      setBookedTickets((prev) => {
        const next = prev.filter((t) => t.ticketId !== ticketId);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const isBooked = useCallback(
    (eventId: string) => bookedTickets.some((t) => t.eventId === eventId),
    [bookedTickets]
  );

  const value = useMemo(
    () => ({ bookedTickets, bookTicket, cancelTicket, isBooked }),
    [bookedTickets, bookTicket, cancelTicket, isBooked]
  );

  return (
    <BookedTicketsContext.Provider value={value}>
      {children}
    </BookedTicketsContext.Provider>
  );
}

export function useBookedTickets() {
  const ctx = useContext(BookedTicketsContext);
  if (!ctx) throw new Error("useBookedTickets must be used within BookedTicketsProvider");
  return ctx;
}

// ─── 5. SAVED EVENTS PROVIDER ───
interface SavedEventsContextValue {
  savedIds: Set<string>;
  toggleSave: (id: string) => void;
  isSaved: (id: string) => boolean;
  savedCount: number;
}

const SavedEventsContext = createContext<SavedEventsContextValue | null>(null);

export function SavedEventsProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = localStorage.getItem("occasio-saved");
    if (stored) {
      try {
        setSavedIds(new Set(JSON.parse(stored) as string[]));
      } catch (e) {
        console.error("Failed to parse saved IDs", e);
      }
    }
  }, []);

  const persist = useCallback((ids: Set<string>) => {
    localStorage.setItem("occasio-saved", JSON.stringify([...ids]));
  }, []);

  const toggleSave = useCallback(
    (id: string) => {
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const isSaved = useCallback((id: string) => savedIds.has(id), [savedIds]);

  const value = useMemo(
    () => ({
      savedIds,
      toggleSave,
      isSaved,
      savedCount: savedIds.size,
    }),
    [savedIds, toggleSave, isSaved]
  );

  return (
    <SavedEventsContext.Provider value={value}>{children}</SavedEventsContext.Provider>
  );
}

export function useSavedEvents() {
  const ctx = useContext(SavedEventsContext);
  if (!ctx) throw new Error("useSavedEvents must be used within SavedEventsProvider");
  return ctx;
}

// ─── 6. MODALS PROVIDER (Event Detail & Create Event) ───
interface ModalsContextValue {
  selectedEvent: Event | null;
  openEventModal: (event: Event) => void;
  closeEventModal: () => void;
  isCreateEventOpen: boolean;
  openCreateEventModal: () => void;
  closeCreateEventModal: () => void;
}

const ModalsContext = createContext<ModalsContextValue | null>(null);

export function ModalsProvider({ children }: { children: ReactNode }) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);

  const value = useMemo(
    () => ({
      selectedEvent,
      openEventModal: (evt: Event) => setSelectedEvent(evt),
      closeEventModal: () => setSelectedEvent(null),
      isCreateEventOpen,
      openCreateEventModal: () => setIsCreateEventOpen(true),
      closeCreateEventModal: () => setIsCreateEventOpen(false),
    }),
    [selectedEvent, isCreateEventOpen]
  );

  return <ModalsContext.Provider value={value}>{children}</ModalsContext.Provider>;
}

export function useModals() {
  const ctx = useContext(ModalsContext);
  if (!ctx) throw new Error("useModals must be used within ModalsProvider");
  return ctx;
}

// ─── 7. DRAWER PROVIDER ───
interface DrawerContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((v) => !v),
    }),
    [isOpen]
  );

  return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
}

export function useDrawer() {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error("useDrawer must be used within DrawerProvider");
  return ctx;
}

// ─── 8. FILTERS PROVIDER ───
const defaultFilters: FilterState = {
  search: "",
  category: "all",
  date: "all",
  price: "any",
  freeOnly: false,
};

interface FiltersContextValue {
  filters: FilterState;
  setSearch: (search: string) => void;
  setCategory: (category: FilterState["category"]) => void;
  setDate: (date: FilterState["date"]) => void;
  setPrice: (price: FilterState["price"]) => void;
  setFreeOnly: (freeOnly: boolean) => void;
  resetFilters: () => void;
}

const FiltersContext = createContext<FiltersContextValue | null>(null);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const value = useMemo(
    () => ({
      filters,
      setSearch: (search: string) => setFilters((f) => ({ ...f, search })),
      setCategory: (category: FilterState["category"]) =>
        setFilters((f) => ({ ...f, category })),
      setDate: (date: FilterState["date"]) => setFilters((f) => ({ ...f, date })),
      setPrice: (price: FilterState["price"]) => setFilters((f) => ({ ...f, price })),
      setFreeOnly: (freeOnly: boolean) => setFilters((f) => ({ ...f, freeOnly })),
      resetFilters: () => setFilters(defaultFilters),
    }),
    [filters]
  );

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error("useFilters must be used within FiltersProvider");
  return ctx;
}

// ─── 9. NOTIFICATIONS PROVIDER ───
const initialNotifications: AppNotification[] = [
  {
    id: "notif-1",
    title: "Ticket Confirmed! 🎉",
    message: "Your pass for The Weeknd - After Hours Tour is confirmed.",
    time: "10m ago",
    read: false,
    type: "ticket",
  },
  {
    id: "notif-2",
    title: "Early Bird Alert ⚡",
    message: "20% off on Future of AI Summit ends tonight!",
    time: "2h ago",
    read: false,
    type: "promo",
  },
  {
    id: "notif-3",
    title: "Welcome to Occasio ✨",
    message: "Discover concerts, workshops, food festivals and more near you.",
    time: "1d ago",
    read: true,
    type: "system",
  },
];

interface NotificationsContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  clearAll: () => void;
  addNotification: (notif: Omit<AppNotification, "id" | "time" | "read">) => void;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const addNotification = useCallback(
    (notif: Omit<AppNotification, "id" | "time" | "read">) => {
      const newNotif: AppNotification = {
        ...notif,
        id: `notif-${Date.now()}`,
        time: "Just now",
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    },
    []
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const value = useMemo(
    () => ({ notifications, unreadCount, markAsRead, clearAll, addNotification }),
    [notifications, unreadCount, markAsRead, clearAll, addNotification]
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}

// ─── 10. TOAST PROVIDER ───
export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextValue {
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "success") => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className={cn(
                "flex items-center gap-3 rounded-2xl border px-4 py-3.5 shadow-lg backdrop-blur-md pointer-events-auto",
                toast.type === "success" &&
                  "border-green-100 bg-white/95 dark:bg-slate-900/95 dark:border-green-900/30 text-slate-800 dark:text-slate-100",
                toast.type === "error" &&
                  "border-red-100 bg-white/95 dark:bg-slate-900/95 dark:border-red-900/30 text-slate-800 dark:text-slate-100",
                toast.type === "info" &&
                  "border-blue-100 bg-white/95 dark:bg-slate-900/95 dark:border-blue-900/30 text-slate-800 dark:text-slate-100"
              )}
            >
              {toast.type === "success" && (
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
              )}
              {toast.type === "error" && (
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
              )}
              {toast.type === "info" && (
                <Info className="h-5 w-5 text-primary shrink-0" />
              )}

              <p className="text-xs font-semibold leading-relaxed flex-1">
                {toast.message}
              </p>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-lg shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

// ─── MASTER APP PROVIDER ───
export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <NavigationProvider>
          <EventsProvider>
            <BookedTicketsProvider>
              <SavedEventsProvider>
                <ModalsProvider>
                  <DrawerProvider>
                    <NotificationsProvider>
                      <FiltersProvider>{children}</FiltersProvider>
                    </NotificationsProvider>
                  </DrawerProvider>
                </ModalsProvider>
              </SavedEventsProvider>
            </BookedTicketsProvider>
          </EventsProvider>
        </NavigationProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
