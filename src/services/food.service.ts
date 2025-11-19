import { supabase } from "@/lib/supabase/client";

export interface FoodPhoto {
  id: string;
  user_id: string;
  name: string;
  url: string;
  created_at: string;
  updated_at?: string;
}

export interface FoodReview {
  id: string;
  food_photo_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at?: string;
}

export const foodService = {
  // Get all food photos for a user
  async getFoodPhotos(userId: string): Promise<FoodPhoto[]> {
    const { data, error } = await supabase
      .from("food_photos")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Upload a food photo
  async uploadFoodPhoto(userId: string, file: File, name: string): Promise<FoodPhoto> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("food-photos")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("food-photos").getPublicUrl(fileName);

    const { data, error } = await supabase
      .from("food_photos")
      .insert({
        user_id: userId,
        name,
        url: publicUrl,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update food photo name
  async updateFoodPhoto(photoId: string, name: string): Promise<FoodPhoto> {
    const { data, error } = await supabase
      .from("food_photos")
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

  // Delete a food photo
  async deleteFoodPhoto(photoId: string, photoUrl: string): Promise<void> {
    const urlParts = photoUrl.split("/food-photos/");
    if (urlParts.length > 1) {
      const filePath = urlParts[1].split("?")[0];
      await supabase.storage.from("food-photos").remove([filePath]);
    }

    const { error } = await supabase.from("food_photos").delete().eq("id", photoId);
    if (error) throw error;
  },

  // Get reviews for a food photo
  async getReviews(foodPhotoId: string): Promise<FoodReview[]> {
    const { data, error } = await supabase
      .from("food_reviews")
      .select("*")
      .eq("food_photo_id", foodPhotoId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Create a review
  async createReview(
    userId: string,
    foodPhotoId: string,
    rating: number,
    comment: string
  ): Promise<FoodReview> {
    const { data, error } = await supabase
      .from("food_reviews")
      .insert({
        user_id: userId,
        food_photo_id: foodPhotoId,
        rating,
        comment,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a review
  async updateReview(
    reviewId: string,
    rating: number,
    comment: string
  ): Promise<FoodReview> {
    const { data, error } = await supabase
      .from("food_reviews")
      .update({
        rating,
        comment,
        updated_at: new Date().toISOString(),
      })
      .eq("id", reviewId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a review
  async deleteReview(reviewId: string): Promise<void> {
    const { error } = await supabase.from("food_reviews").delete().eq("id", reviewId);
    if (error) throw error;
  },
};

