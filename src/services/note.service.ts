import { supabase } from "@/lib/supabase/client";

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at?: string;
}

export const noteService = {
  // Get all notes for a user
  async getNotes(userId: string): Promise<Note[]> {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Create a new note
  async createNote(
    userId: string,
    title: string,
    content: string
  ): Promise<Note> {
    const { data, error } = await supabase
      .from("notes")
      .insert({
        user_id: userId,
        title,
        content,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a note
  async updateNote(
    noteId: string,
    title: string,
    content: string
  ): Promise<Note> {
    const { data, error } = await supabase
      .from("notes")
      .update({
        title,
        content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", noteId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a note
  async deleteNote(noteId: string): Promise<void> {
    const { error } = await supabase.from("notes").delete().eq("id", noteId);

    if (error) throw error;
  },
};

