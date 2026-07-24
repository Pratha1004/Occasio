import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Event, FilterState } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  if (price === 0) return "Free";
  return `₹${price.toLocaleString("en-IN")}`;
}

export function filterEvents(events: Event[], filters: FilterState): Event[] {
  const query = filters.search.trim().toLowerCase();

  return events.filter((event) => {
    if (query) {
      const haystack = [
        event.title,
        event.location,
        event.venue,
        event.category,
        ...event.tags,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    if (filters.category !== "all" && event.category !== filters.category) {
      return false;
    }

    if (filters.freeOnly && !event.isFree) return false;

    if (filters.price === "free" && !event.isFree) return false;
    if (filters.price === "under-1000" && event.price >= 1000) return false;
    if (filters.price === "1000-2500" && (event.price < 1000 || event.price > 2500))
      return false;
    if (filters.price === "2500-plus" && event.price < 2500) return false;

    if (filters.date !== "all") {
      const eventDate = new Date(event.date);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (filters.date === "today") {
        const eventDay = new Date(
          eventDate.getFullYear(),
          eventDate.getMonth(),
          eventDate.getDate(),
        );
        if (eventDay.getTime() !== today.getTime()) return false;
      }

      if (filters.date === "this-weekend") {
        const day = eventDate.getDay();
        const diff = (eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
        if (diff < 0 || diff > 7 || (day !== 0 && day !== 6)) return false;
      }

      if (filters.date === "this-month") {
        if (
          eventDate.getMonth() !== now.getMonth() ||
          eventDate.getFullYear() !== now.getFullYear()
        ) {
          return false;
        }
      }
    }

    return true;
  });
}

export function getActiveFilterCount(filters: FilterState): number {
  let count = 0;
  if (filters.category !== "all") count++;
  if (filters.date !== "all") count++;
  if (filters.price !== "any") count++;
  if (filters.freeOnly) count++;
  return count;
}
