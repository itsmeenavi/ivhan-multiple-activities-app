"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { User, Loader2, Save, LogOut, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { profileService } from "@/services/profile.service";

export default function ProfilePage() {
  const { user, loading, signOut, deleteAccount } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
      return;
    }

    if (user) {
      loadProfile();
    }
  }, [user, loading, router]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const profile = await profileService.getProfile(user.id);
      if (profile) {
        setDisplayName(profile.display_name);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    if (!displayName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setIsSaving(true);

    try {
      await profileService.updateProfile(user.id, displayName.trim());
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

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

  if (loading || isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--color-primary))]" />
          <p className="text-lg text-[hsl(var(--color-muted-foreground))]">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-white p-4 md:p-8">
      <div className="container mx-auto max-w-2xl">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-[#347a24]">Profile Settings</h1>
            <p className="text-[hsl(var(--color-muted-foreground))]">
              Manage your account information
            </p>
          </div>

          <Card className="shadow-2xl border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <User className="h-6 w-6 text-[#347a24]" />
                Your Information
              </CardTitle>
              <CardDescription className="text-base">
                Update your display name and other details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-semibold">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="h-12 text-base bg-gray-50"
                />
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-base font-semibold">
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Your Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="h-12 text-base"
                  disabled={isSaving}
                />
                <p className="text-xs text-gray-500">
                  This name will be visible to other users on your reviews
                </p>
              </div>

              <Button
                onClick={handleSave}
                className="w-full h-12 text-base font-semibold bg-linear-to-r from-[#347a24] to-[#66a777] hover:from-[#2d6a1f] hover:to-[#5a9669] text-white"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="flex gap-3 justify-center">
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="lg"
              className="flex-1 max-w-xs"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
            <Button
              onClick={() => setShowDeleteDialog(true)}
              variant="destructive"
              size="lg"
              className="flex-1 max-w-xs"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
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
              className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

