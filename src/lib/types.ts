export type EventCategory =
  | "music"
  | "tech"
  | "food"
  | "art"
  | "sports"
  | "workshops"
  | "festival"
  | "electronic";

export type DateFilter = "all" | "today" | "this-weekend" | "this-month";
export type PriceFilter = "any" | "free" | "under-1000" | "1000-2500" | "2500-plus";
export type NavigationTab = "discover" | "categories" | "calendar" | "map" | "saved" | "tickets" | "organizers";

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  tags: string[];
  date: string;
  dateLabel: string;
  month: string;
  day: string;
  time: string;
  location: string;
  venue: string;
  price: number;
  priceLabel: string;
  isFree: boolean;
  isFeatured?: boolean;
  attendees: number;
  image: string;
  imageAlt: string;
  bookmarkColor: string;
  organizer?: string;
}

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  description: string;
  perks: string[];
  available: boolean;
}

export interface BookedTicket {
  ticketId: string;
  eventId: string;
  eventTitle: string;
  eventImage: string;
  dateLabel: string;
  time: string;
  venue: string;
  location: string;
  tierName: string;
  quantity: number;
  totalAmount: number;
  bookedAt: string;
  buyerName: string;
  buyerEmail: string;
  qrCodeSeed: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "ticket" | "system" | "promo";
}

export interface FilterState {
  search: string;
  category: EventCategory | "all";
  date: DateFilter;
  price: PriceFilter;
  freeOnly: boolean;
}

export const CATEGORY_LABELS: Record<EventCategory | "all", string> = {
  all: "All Categories",
  music: "Music",
  tech: "Tech",
  food: "Food",
  art: "Art",
  sports: "Sports",
  workshops: "Workshops",
  festival: "Festival",
  electronic: "Electronic",
};

export const CATEGORY_COLORS: Record<EventCategory, string> = {
  music: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  tech: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  food: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  art: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  sports: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  workshops: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  festival: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300",
  electronic: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
};

