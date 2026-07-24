"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { RightPanel } from "@/components/layout/RightPanel";
import { HeroSection } from "@/components/hero/HeroSection";
import { CategoryBar } from "@/components/filters/CategoryBar";
import { FilterBar } from "@/components/filters/FilterBar";
import { FeaturedEventCard } from "@/components/events/FeaturedEventCard";
import { EventGrid } from "@/components/events/EventGrid";
import { UpcomingTimeline } from "@/components/events/UpcomingTimeline";
import { SavedDrawer } from "@/components/events/SavedDrawer";
import { EventDetailModal } from "@/components/modals/EventDetailModal";
import { CreateEventModal } from "@/components/modals/CreateEventModal";
import { CategoriesView } from "@/components/views/CategoriesView";
import { CalendarView } from "@/components/views/CalendarView";
import { MapView } from "@/components/views/MapView";
import { MyTicketsView } from "@/components/views/MyTicketsView";
import { useNavigation, useModals, useEvents } from "@/providers/AppProvider";
import type { Event } from "@/lib/types";

function DiscoverView() {
  const { events } = useEvents();
  const featuredEvent = events.find((e: Event) => e.isFeatured) || events[4] || events[0];

  if (!featuredEvent) return null;

  return (
    <>
      {/* Hero Ticket Carousel Section */}
      <HeroSection />

      {/* Icon Category Selector Bar */}
      <CategoryBar />

      {/* Secondary Dropdown Filter Bar */}
      <FilterBar />

      {/* Large Featured Event Banner Card */}
      <section aria-label="Featured Event">
        <FeaturedEventCard event={featuredEvent} />
      </section>

      {/* Events Near You (Self-contained Carousel) */}
      <EventGrid />

      {/* Upcoming This Week Timeline */}
      <UpcomingTimeline />
    </>
  );
}

function MainContent() {
  const { activeTab } = useNavigation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="space-y-6"
      >
        {activeTab === "discover" && <DiscoverView />}
        {activeTab === "categories" && <CategoriesView />}
        {activeTab === "calendar" && <CalendarView />}
        {activeTab === "map" && <MapView />}
        {activeTab === "tickets" && <MyTicketsView />}
        {activeTab === "organizers" && <CategoriesView />}
      </motion.div>
    </AnimatePresence>
  );
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { selectedEvent } = useModals();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background font-sans text-foreground">
      {/* 1. Left Sidebar */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* 2. Main Content Wrapper */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Sticky Header */}
        <Header onMenuClick={() => setMobileMenuOpen(true)} />

        {/* Scrollable Center Body */}
        <main className="flex-1 overflow-y-auto pt-2 px-6 pb-6 lg:pt-2 lg:px-8 lg:pb-8 space-y-6 scrollbar-thin">
          <MainContent />
        </main>
      </div>

      {/* 3. Right Panel Widgets (Desktop) */}
      <RightPanel />

      {/* 4. Saved Events Slide-Over Drawer */}
      <SavedDrawer />

      {/* 5. Event Detail Modal (global, rendered at root) */}
      {selectedEvent && <EventDetailModal />}

      {/* 6. Create Event Modal (global, rendered at root) */}
      <CreateEventModal />
    </div>
  );
}
