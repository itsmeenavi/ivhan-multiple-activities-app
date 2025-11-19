import { supabase } from "@/lib/supabase/client";
import axios from "axios";

export interface Pokemon {
  id: number;
  name: string;
  sprite: string;
  types: string[];
}

export interface PokemonReview {
  id: string;
  pokemon_id: number;
  pokemon_name: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at?: string;
}

export const pokemonService = {
  // Search Pokemon by name using PokeAPI
  async searchPokemon(query: string): Promise<Pokemon[]> {
    try {
      // For simplicity, we'll fetch a list and filter
      // In production, you might want to use a better search approach
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`
      );

      const pokemon = response.data;
      return [
        {
          id: pokemon.id,
          name: pokemon.name,
          sprite: pokemon.sprites.front_default,
          types: pokemon.types.map((t: any) => t.type.name),
        },
      ];
    } catch (error) {
      // If exact match fails, try to get suggestions
      try {
        const response = await axios.get(
          "https://pokeapi.co/api/v2/pokemon?limit=1000"
        );
        const allPokemon = response.data.results;
        const matches = allPokemon
          .filter((p: any) => p.name.includes(query.toLowerCase()))
          .slice(0, 10);

        const pokemonData = await Promise.all(
          matches.map(async (p: any) => {
            const details = await axios.get(p.url);
            return {
              id: details.data.id,
              name: details.data.name,
              sprite: details.data.sprites.front_default,
              types: details.data.types.map((t: any) => t.type.name),
            };
          })
        );

        return pokemonData;
      } catch {
        return [];
      }
    }
  },

  // Get reviews for a Pokemon
  async getReviews(pokemonId: number): Promise<PokemonReview[]> {
    const { data, error } = await supabase
      .from("pokemon_reviews")
      .select("*")
      .eq("pokemon_id", pokemonId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Create a review
  async createReview(
    userId: string,
    pokemonId: number,
    pokemonName: string,
    rating: number,
    comment: string
  ): Promise<PokemonReview> {
    const { data, error } = await supabase
      .from("pokemon_reviews")
      .insert({
        user_id: userId,
        pokemon_id: pokemonId,
        pokemon_name: pokemonName,
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
  ): Promise<PokemonReview> {
    const { data, error } = await supabase
      .from("pokemon_reviews")
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
    const { error } = await supabase
      .from("pokemon_reviews")
      .delete()
      .eq("id", reviewId);

    if (error) throw error;
  },

  // Get all user's reviewed Pokemon
  async getUserReviewedPokemon(userId: string): Promise<PokemonReview[]> {
    const { data, error } = await supabase
      .from("pokemon_reviews")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },
};

