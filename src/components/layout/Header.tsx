"use client";

import { Bookmark } from "lucide-react";
import { SearchBar } from "@/components/ui/SearchBar";
import { MobileMenuButton } from "@/components/layout/Sidebar";
import { NotificationsDropdown } from "@/components/layout/NotificationsDropdown";
import { UserProfileDropdown } from "@/components/layout/UserProfileDropdown";
import { useSavedEvents, useDrawer } from "@/providers/AppProvider";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { savedCount } = useSavedEvents();
  const { open: openDrawer } = useDrawer();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4 px-5 py-3 lg:px-7">
        {/* Mobile menu toggle */}
        <MobileMenuButton onClick={onMenuClick} />

        {/* Search — centre-aligned */}
        <div className="flex-1 max-w-lg">
          <SearchBar />
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Saved — compact on tablet */}
          <button
            type="button"
            onClick={openDrawer}
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-[12px] font-semibold text-muted-foreground transition-colors hover:bg-border hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary xl:hidden"
            aria-label={`Saved events, ${savedCount} saved`}
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Saved</span>
            {savedCount > 0 && (
              <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white leading-none">
                {savedCount}
              </span>
            )}
          </button>

          <NotificationsDropdown />
          <UserProfileDropdown />
        </div>
      </div>
    </header>
  );
}
