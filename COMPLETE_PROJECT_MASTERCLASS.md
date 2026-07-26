# 🚀 Complete Project Masterclass & Interview Survival Guide
**Project Name:** Occasio (Eventory) — Interactive Event Discovery Dashboard  
**Role:** Frontend UI Developer  
**Target Evaluator:** Spinach Experience Design Technical Interview Panel  

---

## 📚 Table of Contents
1. [What is Occasio? (The Big Picture)](#1-what-is-occasio-the-big-picture)
2. [Tech Stack Explained (From Absolute Scratch)](#2-tech-stack-explained-from-absolute-scratch)
3. [Project Folder & File Blueprint](#3-project-folder--file-blueprint)
4. [How Data Flows in the App (State Management)](#4-how-data-flows-in-the-app-state-management)
5. [Feature-by-Feature Deep Dive](#5-feature-by-feature-deep-dive)
6. [The Magic Behind the Animations & 3D Math](#6-the-magic-behind-the-animations--3d-math)
7. [Comprehensive Interview Question & Answer Bank](#7-comprehensive-interview-question--answer-bank)

---

## 1. 💡 What is Occasio? (The Big Picture)

### Plain English Summary
Imagine apps like **Eventbrite**, **BookMyShow**, or **Luma**. People use these apps to discover upcoming concerts, tech conferences, design workshops, and wellness retreats around their city. 

**Occasio** is a high-performance, single-page web app dashboard designed to help users:
1. **Discover & Search Events**: Filter by category (Music, Tech, Design, Culinary), date, price slider, or free events.
2. **Bookmark/Save Events**: Click a heart icon to save favorite events into a slide-out drawer that stays saved even if you refresh the browser.
3. **Book Digital Tickets**: Click any event card to open a 3-step modal (Event details $\rightarrow$ Select Ticket Tier & Quantity $\rightarrow$ Checkout & Receive Digital Pass with SVG Barcode).
4. **View Saved Passes**: Access a "My Tickets" wallet to view all purchased passes.
5. **Create Events**: Organizers can open a modal to dynamically publish custom events to the dashboard.

### Why was it built this way?
The client **Spinach Experience Design** gave a 2-day technical challenge. They wanted to test your ability to build **stunning UI, fluid 60fps animations, mobile-to-desktop responsiveness, clean component structure, and accessible code** using **only local JSON data** (no real database needed).

---

## 🛠️ 2. Tech Stack Explained (From Absolute Scratch)

If the interviewer asks: *"Explain your tech stack choices,"* here is what each technology does and why we used it:

| Technology | What is it? | Why did we use it here? |
| :--- | :--- | :--- |
| **Next.js 16 (App Router)** | A powerful framework built on top of React. | Handles routing, page rendering, static site generation (`SSG`), image optimization, and fast file-based component structure. |
| **React 19** | A JavaScript library for building User Interfaces with components. | Allows us to split the UI into modular reusable pieces (`Header`, `EventCard`, `Modal`) and manage interactive state (`useState`, `useContext`). |
| **TypeScript 5** | JavaScript with explicit data types. | Ensures zero type errors, catches bugs before running the app, and provides strict interfaces (e.g., `Event`, `Ticket`, `Category`). |
| **Tailwind CSS v4** | A utility-first CSS framework. | Enables rapid, responsive styling using class names (`flex`, `grid`, `rounded-xl`, `bg-background`, `dark:bg-slate-900`) and custom design tokens. |
| **Framer Motion v12** | The industry standard React animation library. | Powers all page transitions, physics-based spring animations, staggered grid card entrances, 3D tilt effects, and layout reordering. |
| **Lucide React** | Modern SVG icon library. | Beautiful, clean, lightweight vector icons (`Calendar`, `MapPin`, `Heart`, `Search`, `Ticket`, `Moon`, `Sun`). |

---

## 📁 3. Project Folder & File Blueprint

Here is how code is organized inside `src/`:

```
src/
├── app/                  # Next.js App Router root
│   ├── globals.css       # Global design system tokens & Tailwind imports
│   ├── layout.tsx        # HTML document root wrapper
│   └── page.tsx          # Main Single-Page Application & View Switcher
│
├── data/
│   └── events.json       # Mock JSON Database (12 detailed event objects)
│
├── lib/
│   └── types.ts          # TypeScript interfaces (Event, TicketTier, BookedTicket)
│
├── providers/
│   └── AppProvider.tsx   # React Context API global state slices & localStorage sync
│
└── components/
    ├── hero/
    │   └── HeroSection.tsx       # Top Hero banner with floating preview cards & CTA
    ├── filters/
    │   ├── CategoryBar.tsx       # Icon category tabs (All, Music, Tech, Design, etc.)
    │   └── FilterBar.tsx         # Search bar, Date selector, Price slider, Free toggle
    ├── events/
    │   ├── EventGrid.tsx         # Grid that renders all EventCard components
    │   ├── EventCard.tsx         # Individual event card wrapper
    │   ├── FeaturedEventCard.tsx # Spotlight banner card for featured event
    │   ├── SavedDrawer.tsx       # Slide-out right panel for favorited events
    │   └── UpcomingTimeline.tsx  # Scroll-triggered timeline list of upcoming events
    ├── layout/
    │   ├── Header.tsx            # Sticky header with Logo, Search & Theme toggle
    │   ├── Sidebar.tsx           # Left navigation bar (Discover, Categories, Calendar, Map, Tickets)
    │   └── RightPanel.tsx        # Desktop widget sidebar (Trending, Quick Saved, Calendar preview)
    ├── modals/
    │   ├── EventDetailModal.tsx  # 3-step ticket booking flow
    │   └── CreateEventModal.tsx  # Form to publish new custom events
    ├── views/
    │   ├── CalendarView.tsx      # Interactive event calendar grid
    │   ├── CategoriesView.tsx    # Category explorer view
    │   ├── MapView.tsx           # City map event pin visualization
    │   └── MyTicketsView.tsx     # Wallet showing user's purchased tickets
    └── ui/
        ├── CustomSvgEmpty.tsx    # Custom animated SVG empty state illustration
        ├── Logo.tsx              # Animated SVG brand logo
        ├── MagneticButton.tsx    # Mouse-attracting physics CTA button
        ├── ThemeToggle.tsx       # Dark/Light mode toggle switch
        ├── TicketBarcode.tsx     # SVG QR/Barcode generator for tickets
        └── TiltCard.tsx          # 3D perspective mouse tracking & specular glare
```

---

## 🔄 4. How Data Flows in the App (State Management)

### The Problem without Context: "Prop Drilling"
Imagine you have data in the main `page.tsx` and you want to pass it down to `Sidebar` $\rightarrow$ `NavButton` $\rightarrow$ `Badge`. Passing data through 5 components that don't need it is called **Prop Drilling**. It makes code messy and hard to maintain.

### The Solution: React Context API (`AppProvider.tsx`)
We created **Context Slices** inside [`AppProvider.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/providers/AppProvider.tsx). Think of Context as a **central global cloud storage** inside the app. Any component anywhere in the tree can read or update data directly!

Our context handles 5 main state domain slices:
1. **`useTheme()`**: Toggles dark/light mode and updates CSS variables on `<html>`. Saves preference to `localStorage`.
2. **`useEvents()`**: Holds the 12 events from `events.json`. Stores active filters (search query, category, price range, free-only, date preset, sort criteria). Also allows creating new events!
3. **`useSavedEvents()`**: Tracks favorited event IDs in an array. Persists instantly to `localStorage`.
4. **`useBookedTickets()`**: Stores array of purchased tickets with tier name, quantity, and QR code seed.
5. **`useNavigation()`**: Controls which tab is visible (`discover`, `categories`, `calendar`, `map`, `tickets`).

---

## 🔍 5. Feature-by-Feature Deep Dive

### 1. Sticky Header & Animated Logo (`Header.tsx`, `Logo.tsx`, `ThemeToggle.tsx`)
- **Logo**: Features an animated SVG icon with pulsing gradient rings.
- **Theme Toggle**: Switch between Light Mode (clean slate/indigo) and Dark Mode (sleek dark obsidian/violet). It toggles the `.dark` class on document root.

### 2. Hero Section & Magnetic CTA (`HeroSection.tsx`, `MagneticButton.tsx`)
- Displays headline *"Discover Unforgettable Experiences Around You"*.
- **Magnetic Button**: Primary CTA tracking mouse distance vector; when mouse gets close, the button physically moves toward the cursor!

### 3. Filter Bar & Category Bar (`CategoryBar.tsx`, `FilterBar.tsx`)
- Category Bar lets users click categories (All, Music, Tech, Design, Culinary, Wellness, Arts).
- Filter Bar offers:
  - **Search**: Filters title & description in real time.
  - **Date Selector**: All Dates, Today, This Weekend, Next Week, This Month.
  - **Price Range Slider**: Filter max price from $0 to $200.
  - **Free Events Toggle**: Switch to show only $0 events.
  - **Sort Dropdown**: Sort by Date, Price Low-High, Price High-Low, Popularity.

### 4. 3D Card Tilt & Specular Glare (`TiltCard.tsx`, `EventCard.tsx`)
- Every event card reacts to mouse hover in 3D space.
- Calculates cursor $(x,y)$ relative to card center, producing dynamic 3D rotation (`rotateX`, `rotateY`) and moving a radial specular light reflector across the card.

### 5. Saved Events Slide-Out Drawer (`SavedDrawer.tsx`)
- Click the Heart icon on any card $\rightarrow$ heart pulses with Framer Motion spring $\rightarrow$ event ID added to saved list.
- Clicking the Bookmark icon in the header opens a slide-over panel on the right with backdrop backdrop blur, count badge, and individual remove buttons.

### 6. Event Detail & 3-Step Ticket Booking (`EventDetailModal.tsx`)
- **Step 1: Details**: Full description, organizer info, location, date/time, price options.
- **Step 2: Tier Selection**: Select ticket type (General Admission, VIP Pass, Early Bird) and quantity counter ($1-10$).
- **Step 3: Digital Ticket Pass**: Displays confirmed ticket with a dynamic SVG barcode, event name, venue, and seat tier.

### 7. Custom Animated SVG Empty State (`CustomSvgEmpty.tsx`)
- If you search for something that doesn't exist (e.g. "xyz123"), the grid shows a custom SVG illustration of a ticket scanner with pulsing radar waves, sparkles, and a button to reset filters.

---

## 📐 6. The Magic Behind the Animations & 3D Math

If an interviewer asks: *"How did you build the 3D tilt effect or magnetic button?"* — here is the exact math explained simply:

### A. 3D Tilt Calculations ([`TiltCard.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/ui/TiltCard.tsx))
When your mouse enters an event card:
1. We get card width $W$ and height $H$.
2. We find the cursor's $(X, Y)$ offset from the center of the card:
   $$\Delta X = X - (W / 2), \quad \Delta Y = Y - (H / 2)$$
3. We normalize these values into a $-1$ to $+1$ range:
   $$\text{normX} = \frac{\Delta X}{W/2}, \quad \text{normY} = \frac{\Delta Y}{H/2}$$
4. We convert normalized values into degrees:
   $$\text{rotateX} = -\text{normY} \times 12^\circ, \quad \text{rotateY} = \text{normX} \times 12^\circ$$
5. We apply transform `perspective(1000px) rotateX(...) rotateY(...)` on the card style.

### B. Magnetic Button Vector Math ([`MagneticButton.tsx`](file:///c:/users/prabh/OneDrive/Desktop/eventory/src/components/ui/MagneticButton.tsx))
1. Tracks cursor distance from button center:
   $$\text{distance} = \sqrt{(X_{\text{mouse}} - X_{\text{button}})^2 + (Y_{\text{mouse}} - Y_{\text{button}})^2}$$
2. If $\text{distance} < 100\text{px}$, we pull the button toward cursor by $35\%$ of the distance vector using Framer Motion springs (`stiffness: 150, damping: 15`).

---

## ❓ 7. Comprehensive Interview Question & Answer Bank

Practice these questions and answers word-for-word before your interview meeting!

---

### **Section A: General & Architecture Questions**

#### **Q1: Tell me about this project and what problem it solves.**
> **Answer:**  
> *"Occasio is a responsive, single-page Event Discovery Dashboard built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, and Framer Motion v12.  
> It allows users to seamlessly explore upcoming events, filter by category, date, price, or free status, bookmark events in a slide-out drawer, and complete a 3-step digital ticket booking flow.  
> It operates on local JSON data and client-side `localStorage` state persistence, focusing on fluid 60fps micro-interactions, responsive design, and accessible UI architecture."*

---

#### **Q2: Why did you choose Next.js App Router over plain React (Vite/CRA)?**
> **Answer:**  
> *"Even though this assignment uses local JSON data, Next.js 16 App Router provides an enterprise-ready foundation. It offers automatic code splitting, optimized static generation (`SSG`), built-in layout routing, fast image optimization, and full TypeScript support. If we decide to connect a real backend API in the future, Next.js Server Actions and API routes can be integrated without restructuring the app."*

---

#### **Q3: How is state managed across the app? Did you use Redux or Zustand?**
> **Answer:**  
> *"I chose a modular React Context API pattern located in `AppProvider.tsx`. Context is split into 5 clear domain slices (`Events`, `SavedEvents`, `BookedTickets`, `Theme`, and `Navigation`).  
> For a single-page dashboard with client-side persistence, Context provides zero extra bundle overhead while keeping component logic cleanly decoupled. We synchronize `savedEvents`, `bookedTickets`, and `theme` directly with `localStorage` so user data persists across page refreshes."*

---

### **Section B: UI/UX & CSS Questions**

#### **Q4: How did you implement dark mode in Tailwind CSS v4?**
> **Answer:**  
> *"We use CSS variables for theme tokens defined in `globals.css` (such as `--background`, `--foreground`, `--card`, `--primary`). When the user toggles dark mode via `ThemeToggle.tsx`, we toggle the `.dark` class on the `<html>` root element. Tailwind utilities like `bg-background` and `text-foreground` adjust automatically with smooth CSS color transitions."*

---

#### **Q5: How did you ensure the dashboard is fully responsive across Mobile, Tablet, and Desktop?**
> **Answer:**  
> *"We used mobile-first CSS grid and flexbox layouts.  
> - **Header & Navigation**: On desktop, a persistent left `Sidebar` and right `RightPanel` are shown. On mobile, sidebars collapse into a hamburger sliding drawer.  
> - **Event Grid**: Responsive breakpoint classes (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`) automatically adjust grid columns depending on screen width."*

---

### **Section C: Animation & Micro-Interaction Questions**

#### **Q6: How did you build the 3D Card Tilt effect without causing performance lag?**
> **Answer:**  
> *"In `TiltCard.tsx`, we calculate normalized mouse offset coordinates $(x,y)$ relative to the card's dimensions during `onMouseMove`.  
> To ensure 60fps performance without frame drops, we do NOT trigger React re-renders with `useState` on every pixel move. Instead, mouse coordinates update inline CSS transform values (`perspective`, `rotateX`, `rotateY`) directly on DOM node refs or Framer Motion values, leveraging GPU hardware acceleration."*

---

#### **Q7: How does card reordering work when filtering events?**
> **Answer:**  
> *"We wrap the event cards in Framer Motion's `<AnimatePresence mode="popLayout">` and attach the `layout` prop to each `<motion.div>`.  
> When a filter removes or adds cards, Framer Motion automatically measures the bounding box difference ($\Delta x, \Delta y$) of each element before and after state change, translating cards smoothly to their new flex/grid coordinates via GPU CSS transforms."*

---

### **Section D: Accessibility (a11y) & Best Practices**

#### **Q8: How did you make the app accessible for keyboard and screen-reader users?**
> **Answer:**  
> *"1. **Semantic HTML**: We used `<header>`, `<nav>`, `<main>`, `<aside>`, `<section>`, and `<article>` tags instead of unsemantic `<div>` elements.  
> 2. **Keyboard Focus Rings**: Every button, link, and interactive element includes explicit focus indicators (`focus-visible:ring-2 focus-visible:ring-primary`).  
> 3. **ARIA Roles & Labels**: Modals use `role="dialog"` and `aria-modal="true"`, icon buttons have `aria-label`, and interactive toggles use `aria-checked`."*

---

### **Section E: Backend API & System Design Questions**

#### **Q9: The assignment required local JSON data. How would you connect this to a real Backend API?**
> **Answer:**  
> *"We created mock API specifications in `README.md` and a Postman collection (`eventory_postman_collection.json`).  
> To connect a real backend (e.g. Node.js/Express, Python/FastAPI, or Next.js API routes), we would replace local `events.json` state updates in `AppProvider.tsx` with `fetch` or `TanStack Query (React Query)` calls to endpoints like `GET /api/events`, `POST /api/events/save`, and `POST /api/tickets/book`. The UI component layer would remain 100% identical!"*

---

#### **Q10: What is the ER Diagram structure of this system?**
> **Answer:**  
> *"Our ER Diagram consists of 4 main entities:  
> 1. `USER` (id, name, email)  
> 2. `EVENT` (id, title, description, category, date, location, venue, price, isFree, attendees)  
> 3. `SAVED_EVENT` (id, userId, eventId, savedAt)  
> 4. `BOOKED_TICKET` (ticketId, userId, eventId, tierName, quantity, totalPrice, qrCodeSeed, bookedAt).*  
> *Users have a 1-to-many relationship with `BOOKED_TICKET` and `SAVED_EVENT`."*

---

## 🎯 8. Final Golden Words for the Interview

1. **Be Confident**: You have a 100% built, compiling, bug-free, Next.js 16 app with 3D tilt, magnetic buttons, ticket booking, QR codes, dark mode, and accessibility!
2. **Focus on Quality**: Highlight that you didn't just build a simple grid — you built a **fluid experience with micro-interactions and performance optimization**.
3. **Know Your Files**: Remember the names: `AppProvider.tsx` (state), `TiltCard.tsx` (3D math), `EventGrid.tsx` (grid), `SavedDrawer.tsx` (saved drawer), `EventDetailModal.tsx` (ticket checkout).

Good luck! You are fully prepared to rock this interview! 🚀
