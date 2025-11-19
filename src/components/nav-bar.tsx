"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LogOut, Trash2, Lock } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function NavBar() {
  const { user, signOut, deleteAccount } = useAuth();
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Failed to sign out");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      toast.success("Account deleted successfully");
      setShowDeleteDialog(false);
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete account");
    }
  };

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
              {user.email}
            </span>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
            <Button onClick={() => setShowDeleteDialog(true)} variant="destructive" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your account? This action cannot be undone.
              All your data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </nav>
  );
}
