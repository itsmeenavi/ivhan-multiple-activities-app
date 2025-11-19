import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pokemonService } from "@/services/pokemon.service";
import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";

export function usePokemonSearch() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: pokemon = [], isLoading } = useQuery({
    queryKey: ["pokemon-search", searchQuery],
    queryFn: () => pokemonService.searchPokemon(searchQuery),
    enabled: searchQuery.length >= 3,
  });

  return {
    pokemon,
    isLoading,
    searchQuery,
    setSearchQuery,
  };
}

export function usePokemonReviews(pokemonId: number) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["pokemon-reviews", pokemonId],
    queryFn: () => pokemonService.getReviews(pokemonId),
    enabled: pokemonId > 0,
  });

  const createMutation = useMutation({
    mutationFn: ({
      pokemonName,
      rating,
      comment,
    }: {
      pokemonName: string;
      rating: number;
      comment: string;
    }) =>
      pokemonService.createReview(
        user?.id || "",
        pokemonId,
        pokemonName,
        rating,
        comment
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pokemon-reviews", pokemonId] });
      await queryClient.invalidateQueries({ queryKey: ["user-pokemon-reviews"] });
      await queryClient.refetchQueries({ queryKey: ["pokemon-reviews", pokemonId] });
      await queryClient.refetchQueries({ queryKey: ["user-pokemon-reviews"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      reviewId,
      rating,
      comment,
    }: {
      reviewId: string;
      rating: number;
      comment: string;
    }) => pokemonService.updateReview(reviewId, rating, comment),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pokemon-reviews", pokemonId] });
      await queryClient.invalidateQueries({ queryKey: ["user-pokemon-reviews"] });
      await queryClient.refetchQueries({ queryKey: ["pokemon-reviews", pokemonId] });
      await queryClient.refetchQueries({ queryKey: ["user-pokemon-reviews"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (reviewId: string) => pokemonService.deleteReview(reviewId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pokemon-reviews", pokemonId] });
      await queryClient.invalidateQueries({ queryKey: ["user-pokemon-reviews"] });
      await queryClient.refetchQueries({ queryKey: ["pokemon-reviews", pokemonId] });
      await queryClient.refetchQueries({ queryKey: ["user-pokemon-reviews"] });
    },
  });

  return {
    reviews,
    isLoading,
    createReview: createMutation.mutate,
    updateReview: updateMutation.mutate,
    deleteReview: deleteMutation.mutate,
  };
}

export function useUserPokemonReviews() {
  const { user } = useAuth();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["user-pokemon-reviews", user?.id],
    queryFn: () => pokemonService.getUserReviewedPokemon(user?.id || ""),
    enabled: !!user?.id,
  });

  return {
    reviews,
    isLoading,
  };
}

