# 🎨 Visual Layout & Interaction Matrix ("What Looks Like What & What Affects What")

**Project:** Occasio (Eventory) — Interactive Event Discovery Dashboard  
**Purpose:** Explains the visual layout of the dashboard and maps every user interaction to the exact screen component it updates.

---

## 🖼️ Part 1: Visual Screen Layout (What it Looks Like)

On a desktop screen, Occasio is divided into **3 Main Vertical Columns + Overlays**:

```
+---------------------------------------------------------------------------------------------------+
|  [LOGO]  SEARCH BAR                          [NOTIFICATIONS]  [THEME TOGGLE]  [SAVED DRAWER BUTTON] |  <- STICKY HEADER
+------------------+------------------------------------------------------------+-------------------+
|  LEFT SIDEBAR    |  CENTER MAIN CONTENT AREA (Scrollable)                     |  RIGHT PANEL      |
|                  |                                                            |                   |
|  * Discover      |  +------------------------------------------------------+  |  * Trending       |
|  * Categories    |  |  HERO TICKET BANNER                                  |  |    Events Widget  |
|  * Calendar      |  |  - Ticket SVG Notch Background                       |  |                   |
|  * City Map      |  |  - Glowing Particle Dots & Ambient Blue/Violet Light |  |  * Quick Saved    |
|  * My Tickets    |  |  - Headline: "Discover Unforgettable Experiences"   |  |    Events         |
|                  |  |  - Stats Counter: 12+ Events, 4.9 Rating            |  |                   |
|  * Host Event    |  |  - Floating Glass Preview Card                       |  |  * Calendar       |
|    Button        |  |  - MAGNETIC CTA BUTTON: "Explore Events"             |  |    Preview        |
|                  |  +------------------------------------------------------+  |                   |
|                  |                                                            |                   |
|                  |  CATEGORY BAR: [All] [Music] [Tech] [Design] [Culinary]    |                   |
|                  |                                                            |                   |
|                  |  FILTER BAR:   [Search] [Date Range] [Price Slider] [Free]  |                   |
|                  |                                                            |                   |
|                  |  FEATURED EVENT SPOTLIGHT BANNER                           |                   |
|                  |                                                            |                   |
|                  |  EVENT DISCOVERY GRID (3D Tilt Cards)                      |                   |
|                  |  +------------------+ +------------------+ +-------------+  |                   |
|                  |  | Event Card 1     | | Event Card 2     | | Event Card 3|  |                   |
|                  |  | (Unsplash Photo) | | (Unsplash Photo) | | (...)     |  |                   |
|                  |  | Date | Venue     | | Date | Venue     | |             |  |                   |
|                  |  | Price | Tags     | | Price | Tags     | |             |  |                   |
|                  |  | [Heart Save]     | | [Heart Save]     | |             |  |                   |
|                  |  +------------------+ +------------------+ +-------------+  |                   |
|                  |                                                            |                   |
|                  |  UPCOMING TIMELINE (Scroll Reveal Feed)                    |                   |
+------------------+------------------------------------------------------------+-------------------+
|  OVERLAYS (Popups & Drawers):                                                                     |
|  - [SAVED DRAWER]: Slides out from the right side over the Right Panel                            |
|  - [TICKET BOOKING MODAL]: Pops up in center of screen with blurred backdrop                       |
|  - [CREATE EVENT MODAL]: Form popup to add custom user events                                     |
+---------------------------------------------------------------------------------------------------+
```

---

## ⚡ Part 2: Cause & Effect Interaction Matrix (What Action Affects What)

Use this table during your interview to explain how state updates trigger immediate UI visual feedback across components:

| User Action | Trigger Component | State Updated in `AppProvider` | Visual Effect on Screen |
| :--- | :--- | :--- | :--- |
| **1. Type text in Search Input** | [`SearchBar.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/ui/SearchBar.tsx) | `searchQuery` string | `EventGrid` instantly filters cards. Cards reorder smoothly via Framer Motion. If 0 matches, custom SVG empty state appears. |
| **2. Click Category Pill (e.g. Music)** | [`CategoryBar.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/filters/CategoryBar.tsx) | `selectedCategory` string | Selected pill highlights in primary indigo color. Grid filters to show only events matching category. |
| **3. Adjust Price Slider ($0 - $200)** | [`FilterBar.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/filters/FilterBar.tsx) | `priceRange` number | Price text updates dynamically. Event grid hides cards priced higher than slider value. |
| **4. Toggle "Free Events Only"** | [`FilterBar.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/filters/FilterBar.tsx) | `isFreeOnly` boolean | Switch flips with smooth spring animation. Grid displays only $0 free events. |
| **5. Click Heart Icon on Event Card** | [`EventCard.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/events/EventCard.tsx) | `savedEventIds` array & `localStorage` | Heart icon pulses (`scale: 1.35`), turns filled red. Header bookmark badge count increments (+1). Item appears in Saved Drawer. |
| **6. Click Saved Bookmark Icon in Header** | [`Header.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/layout/Header.tsx) | `savedDrawerOpen` boolean | `SavedDrawer` slides out smoothly from right edge (`x: "100%"` to `0`) with a dark backdrop blur over the screen. |
| **7. Click Theme Switcher (Sun/Moon)** | [`ThemeToggle.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/ui/ThemeToggle.tsx) | `theme` ("dark" \| "light") | Toggles `.dark` class on `<html>` root. Entire dashboard transitions colors smoothly between Light Slate and Dark Obsidian. |
| **8. Hover Cursor over Event Card** | [`TiltCard.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/ui/TiltCard.tsx) | DOM Mouse Coordinate Refs | Card rotates on 3D perspective axes (`rotateX`, `rotateY`) and projects a dynamic radial specular light glare over the card surface. |
| **9. Move Cursor near "Explore Events" Button** | [`MagneticButton.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/ui/MagneticButton.tsx) | Framer Motion `springX`, `springY` | Button magnetic vector pulls physically toward mouse cursor position. |
| **10. Click any Event Card** | [`EventCard.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/events/EventCard.tsx) | `selectedEvent` object | Background darkens with backdrop blur. `EventDetailModal` pops up in center with event photo, description, ticket tier selection, and barcode pass. |
| **11. Complete Ticket Purchase** | [`EventDetailModal.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/modals/EventDetailModal.tsx) | `bookedTickets` array & `localStorage` | Generates confirmed digital ticket pass with SVG barcode. Ticket is added to user's "My Tickets" wallet view. |
| **12. Click Navigation Links (Calendar, Map, Tickets)** | [`Sidebar.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/layout/Sidebar.tsx) | `activeTab` string | Central content area smoothly cross-fades from Discover view to Interactive Calendar, City Map pins, or My Tickets wallet view. |

---

## 🔬 Part 3: Visual Styling & Design System Tokens

Occasio uses custom design system CSS variables in [`globals.css`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/app/globals.css) so every component looks cohesive:

- **Primary Color**: Rich Vibrant Indigo (`#3B82F6` / `#4F46E5`)
- **Dark Mode Background**: Obsidian Midnight Blue (`#06132b` / `#0b172a`)
- **Light Mode Background**: Crisp Slate White (`#F8FAFC`)
- **Card Backgrounds**: Glassmorphism cards with `backdrop-filter: blur(12px)` and subtle borders (`border-slate-700/50`).
- **Typography**: Clean, readable sans-serif typography hierarchy (`Inter` font).
