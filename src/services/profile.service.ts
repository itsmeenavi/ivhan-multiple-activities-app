import { supabase } from "@/lib/supabase/client";
import type { Profile } from "@/types/profile.types";

export const profileService = {
  // Get user profile
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
    return data;
  },

  // Get multiple profiles by IDs
  async getProfiles(userIds: string[]): Promise<Profile[]> {
    if (userIds.length === 0) return [];
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .in("id", userIds);

    if (error) {
      console.error("Error fetching profiles:", error);
      return [];
    }
    return data || [];
  },

  // Update user profile
  async updateProfile(userId: string, displayName: string): Promise<Profile> {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Create profile (for manual creation if trigger fails)
  async createProfile(userId: string, email: string, displayName: string): Promise<Profile> {
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        email,
        display_name: displayName,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

