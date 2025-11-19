import { supabase } from "@/lib/supabase/client";

export interface Todo {
  id: string;
  user_id: string;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at?: string;
}

export const todoService = {
  // Get all todos for a user
  async getTodos(userId: string): Promise<Todo[]> {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Create a new todo
  async createTodo(userId: string, title: string): Promise<Todo> {
    const { data, error } = await supabase
      .from("todos")
      .insert({
        user_id: userId,
        title,
        completed: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a todo
  async updateTodo(
    todoId: string,
    updates: { title?: string; completed?: boolean }
  ): Promise<Todo> {
    const { data, error } = await supabase
      .from("todos")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", todoId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a todo
  async deleteTodo(todoId: string): Promise<void> {
    const { error } = await supabase.from("todos").delete().eq("id", todoId);

    if (error) throw error;
  },
};

