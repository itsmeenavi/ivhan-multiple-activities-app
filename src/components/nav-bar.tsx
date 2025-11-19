"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { User, Lock } from "lucide-react";
import { useProfile } from "@/hooks/use-profiles";

export function NavBar() {
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);

  if (!user) return null;

  return (
    <nav className="border-b bg-[hsl(var(--color-card))] backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-xl font-bold text-[#347a24] hover:text-[#66a777] transition-colors flex items-center gap-2"
            >
              <div className="h-8 w-8 rounded bg-[#347a24] flex items-center justify-center">
                <Lock className="h-5 w-5 text-white" />
              </div>
              Ivhan Salazar
            </Link>
            <div className="hidden md:flex gap-3 text-xs lg:text-sm">
              <Link
                href="/activity-1"
                className="font-medium text-[#66a777] hover:text-[#347a24] transition-colors"
              >
                Todo
              </Link>
              <Link
                href="/activity-2"
                className="font-medium text-[#66a777] hover:text-[#347a24] transition-colors"
              >
                Photos
              </Link>
              <Link
                href="/activity-3"
                className="font-medium text-[#66a777] hover:text-[#347a24] transition-colors"
              >
                Food
              </Link>
              <Link
                href="/activity-4"
                className="font-medium text-[#66a777] hover:text-[#347a24] transition-colors"
              >
                Pokemon
              </Link>
              <Link
                href="/activity-5"
                className="font-medium text-[#66a777] hover:text-[#347a24] transition-colors"
              >
                Notes
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[hsl(var(--color-muted-foreground))] hidden sm:inline">
              {profile?.display_name || user.email}
            </span>
            <Link href="/profile">
              <Button variant="outline" size="sm" title="Profile Settings">
                <User className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
