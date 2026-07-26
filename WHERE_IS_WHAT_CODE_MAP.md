# 🗺️ "Where is What?" — Code Blueprint & Location Map
**Project:** Occasio (Eventory) — Interactive Event Discovery Dashboard  
**Purpose:** Instant cheatsheet to locate every component, feature, semantic HTML tag, animation, and state provider for your interview.

---

## 📌 Quick Reference Table

| Feature / Concept | File Path | Key Line / Component | Description |
| :--- | :--- | :--- | :--- |
| **Magnetic Physics Button** | [`MagneticButton.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/ui/MagneticButton.tsx) | Line 16 (`MagneticButton`) | Uses Framer Motion `useMotionValue` & `useSpring` to pull button toward cursor. |
| **Magnetic CTA in Hero** | [`HeroSection.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/hero/HeroSection.tsx) | Line 7 & Line 180+ | Renders `<MagneticButton>` for "Explore Events" & "Host an Event". |
| **3D Perspective Card Tilt** | [`TiltCard.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/ui/TiltCard.tsx) | Line 15 (`TiltCard`) | Computes normalized mouse coordinates $(x,y)$ to rotate cards in 3D with specular light glare. |
| **Event Card (3D wrapped)** | [`EventCard.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/events/EventCard.tsx) | Line 65 (`<article>`) | Wraps single event card in `<TiltCard>` with image, tags, price pill, and heart save toggle. |
| **Semantic `<header>`** | [`Header.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/layout/Header.tsx) | Line 35 (`<header>`) | Sticky top header containing logo, search bar, notifications, and theme toggle. |
| **Semantic `<nav>`** | [`Sidebar.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/layout/Sidebar.tsx) | Line 45 (`<nav>`) | Sidebar navigation links (`Discover`, `Categories`, `Calendar`, `Map`, `Tickets`). |
| **Semantic `<main>`** | [`page.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/app/page.tsx) | Line 97 (`<main>`) | Main scrollable content container wrapping all views. |
| **Semantic `<section>`** | [`HeroSection.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/hero/HeroSection.tsx), [`EventGrid.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/events/EventGrid.tsx) | Line 62, Line 40 (`<section>`) | Groups page sections semantically with `aria-label` or `aria-labelledby`. |
| **Semantic `<aside>`** | [`RightPanel.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/layout/RightPanel.tsx), [`SavedDrawer.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/events/SavedDrawer.tsx) | Line 55, Line 42 (`<aside>`) | Side widgets panel and slide-out saved events drawer. |
| **Semantic `<article>`** | [`EventCard.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/events/EventCard.tsx) | Line 65 (`<article>`) | Self-contained event card representation. |
| **Dark/Light Theme Toggle** | [`ThemeToggle.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/ui/ThemeToggle.tsx) | Line 10 (`ThemeToggle`) | Sun/Moon button that toggles `.dark` class on `<html>` root. |
| **Saved Events Drawer** | [`SavedDrawer.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/events/SavedDrawer.tsx) | Line 25 (`SavedDrawer`) | Slide-out right panel showing favorited events synced with `localStorage`. |
| **Custom SVG Empty State** | [`CustomSvgEmpty.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/ui/CustomSvgEmpty.tsx) | Line 12 (`CustomSvgEmpty`) | Custom inline SVG scanner illustration displayed when 0 search/filter matches. |
| **SVG Ticket Barcode** | [`TicketBarcode.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/ui/TicketBarcode.tsx) | Line 10 (`TicketBarcode`) | Generates custom SVG QR/barcode lines for digital ticket pass. |
| **3-Step Ticket Checkout Modal** | [`EventDetailModal.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/modals/EventDetailModal.tsx) | Line 40+ (`EventDetailModal`) | Modal for event details, tier/quantity selector, and digital ticket receipt. |
| **Create Event Modal** | [`CreateEventModal.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/modals/CreateEventModal.tsx) | Line 25 (`CreateEventModal`) | Modal form for organizers to dynamically add new events to live grid. |
| **State Provider & Slices** | [`AppProvider.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/providers/AppProvider.tsx) | Line 1 to 250+ | React Context provider holding Theme, Events, SavedEvents, BookedTickets, Navigation. |
| **Seed Data (Database)** | [`events.json`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/data/events.json) | Line 1 to 250 | 12 detailed mock event objects with title, date, price, tags, and ticket tiers. |

---

## 🧰 1. Detailed Breakdown: Where is the Magnetic Button?

### File Location: [`src/components/ui/MagneticButton.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/ui/MagneticButton.tsx)
- **What it is**: A reusable component wrapping a button with Framer Motion spring physics.
- **How it works**:
  - Uses `useMotionValue(0)` for $X$ and $Y$ offsets.
  - Passes offsets into `useSpring(x, { stiffness: 220, damping: 14 })`.
  - In `onMouseMove`, calculates cursor distance from button center:
    ```ts
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    x.set(distanceX * strength);
    y.set(distanceY * strength);
    ```
  - In `onMouseLeave`, resets `x.set(0)` and `y.set(0)`, causing the button to snap back smoothly.
- **Where it is used in the UI**:
  - In [`HeroSection.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/hero/HeroSection.tsx), used for the **"Explore Events"** primary CTA button.

---

## 🏷️ 2. Detailed Breakdown: Where is Semantic HTML?

Semantic HTML means using meaningful tags (`<header>`, `<nav>`, `<main>`, `<aside>`, `<section>`, `<article>`) instead of generic `<div>` tags. This helps screen readers, SEO, and document outline structure.

Here is exactly where every semantic tag lives in Occasio:

### 1. `<header>`
- **Location**: [`src/components/layout/Header.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/layout/Header.tsx#L35)
- **Purpose**: Marks the sticky top header containing the logo, global search input, notification bell, and theme toggle.

### 2. `<nav>`
- **Location**: [`src/components/layout/Sidebar.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/layout/Sidebar.tsx#L45)
- **Purpose**: Wraps navigation links (`Discover`, `Categories`, `Calendar`, `Map`, `Tickets`) with `aria-label="Main Navigation"`.

### 3. `<main>`
- **Location**: [`src/app/page.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/app/page.tsx#L97)
- **Purpose**: Identifies the main scrollable document body where page views change dynamically.

### 4. `<section>`
- **Locations**: 
  - [`HeroSection.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/hero/HeroSection.tsx#L62) (`aria-labelledby="hero-heading"`)
  - [`EventGrid.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/events/EventGrid.tsx#L40) (`aria-label="Events Discovery Grid"`)
  - [`UpcomingTimeline.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/events/UpcomingTimeline.tsx#L35) (`aria-label="Upcoming Events Timeline"`)
- **Purpose**: Groups major page areas into self-contained sections.

### 5. `<aside>`
- **Locations**:
  - [`RightPanel.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/layout/RightPanel.tsx#L55) (`aria-label="Secondary Dashboard Widgets"`)
  - [`SavedDrawer.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/events/SavedDrawer.tsx#L42) (`aria-label="Saved Events Drawer"`)
- **Purpose**: Used for content tangentially related to the main page content (sidebars, widgets, slide-over panels).

### 6. `<article>`
- **Location**: [`src/components/events/EventCard.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/events/EventCard.tsx#L65)
- **Purpose**: Wraps each individual event item card because an event card is an independent, reusable self-contained article entity.

### 7. `role="dialog"` & `aria-modal="true"`
- **Locations**:
  - [`EventDetailModal.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/modals/EventDetailModal.tsx)
  - [`CreateEventModal.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/modals/CreateEventModal.tsx)
- **Purpose**: Accessible modal popups that trap focus and notify screen readers that a modal dialog is open.

---

## 🎨 3. Where is the 3D Perspective Card Tilt?

### File Location: [`src/components/ui/TiltCard.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/ui/TiltCard.tsx)
- **What it does**: Wraps an event card to rotate it in 3D perspective when you move your cursor over it, and casts a dynamic radial light glare across the surface.
- **Where it is used**: Inside [`EventCard.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/events/EventCard.tsx#L60), the entire card content is wrapped inside `<TiltCard>`.

---

## 🌙 4. Where is Theme Toggle (Dark/Light Mode)?

### File Location: [`src/components/ui/ThemeToggle.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/ui/ThemeToggle.tsx)
- **What it does**: Sun and Moon icon button that calls `toggleTheme()` from `useTheme()` in `AppProvider.tsx`. Toggles `.dark` class on the `<html>` root tag and saves choice in `localStorage`.
- **Where it is used**: Placed inside [`Header.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/layout/Header.tsx) on the top right.

---

## 📥 5. Where is the Saved Events Drawer?

### File Location: [`src/components/events/SavedDrawer.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/events/SavedDrawer.tsx)
- **What it does**: Slide-out panel (`motion.aside`) that slides from `x: "100%"` to `x: 0` when `savedDrawerOpen` is `true`. Displays all events favorited by the user with instant remove buttons.
- **Where it is rendered**: Mounted globally at root in [`src/app/page.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/app/page.tsx#L106).

---

## 🎟️ 6. Where is the Ticket Booking Modal & Barcode?

- **Modal Component**: [`src/components/modals/EventDetailModal.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/modals/EventDetailModal.tsx)
- **SVG Barcode Generator**: [`src/components/ui/TicketBarcode.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/ui/TicketBarcode.tsx)
- **Flow**:
  1. **Step 1 (Details)**: Shows event photo, description, map location, venue, and organizer details.
  2. **Step 2 (Select Tier & Quantity)**: Choose between General Admission, VIP Pass, Early Bird, plus $+/-$ quantity controls.
  3. **Step 3 (Digital Pass)**: Displays digital ticket pass with SVG barcode, booking ID, seat tier, and confirmation.

---

## 🔍 7. Where is the Custom Animated SVG Empty State?

### File Location: [`src/components/ui/CustomSvgEmpty.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/ui/CustomSvgEmpty.tsx)
- **What it does**: Renders a custom SVG illustration of a ticket scanner emitting pulsing radar waves and sparkles.
- **Where it is used**: Rendered inside [`EventGrid.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/events/EventGrid.tsx#L55) when zero events match the current filter or search criteria, providing a "Reset Filters" action button.

---

## ⚙️ 8. Where is State Management (React Context)?

### File Location: [`src/providers/AppProvider.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/providers/AppProvider.tsx)
- Contains all 5 Context domain slices:
  1. `ThemeContext`
  2. `EventsContext`
  3. `SavedEventsContext`
  4. `BookedTicketsContext`
  5. `NavigationContext`
- Wraps the entire application inside [`src/app/layout.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/app/layout.tsx).
