import { supabase } from "@/lib/supabase/client";

export interface Photo {
  id: string;
  user_id: string;
  name: string;
  url: string;
  size: number;
  created_at: string;
  updated_at?: string;
}

export const photoService = {
  // Get all photos for a user
  async getPhotos(userId: string): Promise<Photo[]> {
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Upload a photo
  async uploadPhoto(
    userId: string,
    file: File
  ): Promise<Photo> {
    // Upload file to Supabase Storage
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("photos")
      .getPublicUrl(fileName);

    // Save metadata to database
    const { data, error } = await supabase
      .from("photos")
      .insert({
        user_id: userId,
        name: file.name,
        url: publicUrl,
        size: file.size,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update photo name
  async updatePhoto(photoId: string, name: string): Promise<Photo> {
    const { data, error } = await supabase
      .from("photos")
      .update({
        name,
        updated_at: new Date().toISOString(),
      })
      .eq("id", photoId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a photo
  async deletePhoto(photoId: string, photoUrl: string): Promise<void> {
    // Extract file path from URL
    const urlParts = photoUrl.split("/photos/");
    if (urlParts.length > 1) {
      const filePath = urlParts[1].split("?")[0];
      
      // Delete from storage
      await supabase.storage.from("photos").remove([filePath]);
    }

    // Delete from database
    const { error } = await supabase.from("photos").delete().eq("id", photoId);

    if (error) throw error;
  },
};

