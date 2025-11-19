"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Sparkles,
  Search,
  Trash2,
  Edit2,
  Check,
  X,
  Loader2,
  Star,
  MessageSquare,
  ArrowUpDown,
} from "lucide-react";
import { toast } from "sonner";
import {
  usePokemonSearch,
  usePokemonReviews,
  useUserPokemonReviews,
} from "@/hooks/use-pokemon";
import { useProfiles } from "@/hooks/use-profiles";
import Image from "next/image";
import type { Pokemon } from "@/services/pokemon.service";

type SortOption = "name-asc" | "name-desc" | "date-asc" | "date-desc";

export default function Activity4() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { reviews: userReviews } = useUserPokemonReviews();
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const sortedReviews = useMemo(() => {
    const result = [...userReviews];
    result.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.pokemon_name.localeCompare(b.pokemon_name);
        case "name-desc":
          return b.pokemon_name.localeCompare(a.pokemon_name);
        case "date-asc":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "date-desc":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        default:
          return 0;
      }
    });
    return result;
  }, [userReviews, sortBy]);

  if (loading) {
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
      <div className="container mx-auto max-w-7xl">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-[#347a24]">
              Activity 4: Pokemon Review
            </h1>
            <p className="text-[hsl(var(--color-muted-foreground))]">
              Search for Pokemon and share your reviews
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Search & My Reviews */}
            <Card className="shadow-2xl border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Sparkles className="h-6 w-6 text-[#347a24]" />
                  Pokemon Search
                </CardTitle>
                <CardDescription>
                  Search for Pokemon to view and add reviews
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <PokemonSearchPanel
                  searchInput={searchInput}
                  setSearchInput={setSearchInput}
                  onSelectPokemon={setSelectedPokemon}
                />

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    My Pokemon Reviews
                  </h3>

                  <div className="flex items-center gap-2 text-sm mb-3">
                    <ArrowUpDown className="h-4 w-4" />
                    <span>Sort:</span>
                    <div className="flex gap-1 flex-wrap">
                      <Button
                        size="sm"
                        variant={sortBy === "name-asc" ? "default" : "outline"}
                        onClick={() => setSortBy("name-asc")}
                      >
                        A-Z
                      </Button>
                      <Button
                        size="sm"
                        variant={sortBy === "name-desc" ? "default" : "outline"}
                        onClick={() => setSortBy("name-desc")}
                      >
                        Z-A
                      </Button>
                      <Button
                        size="sm"
                        variant={sortBy === "date-desc" ? "default" : "outline"}
                        onClick={() => setSortBy("date-desc")}
                      >
                        Newest
                      </Button>
                      <Button
                        size="sm"
                        variant={sortBy === "date-asc" ? "default" : "outline"}
                        onClick={() => setSortBy("date-asc")}
                      >
                        Oldest
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {sortedReviews.length === 0 ? (
                      <div className="text-center py-8 text-[hsl(var(--color-muted-foreground))]">
                        <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">
                          No reviews yet. Search for a Pokemon to review!
                        </p>
                      </div>
                    ) : (
                      sortedReviews.map((review) => (
                      <Card
                        key={review.id}
                        className="cursor-pointer bg-white hover:border-[#66a777] transition-colors"
                          onClick={async () => {
                            // Fetch pokemon details when clicking on review
                            const pokemonData = await fetch(
                              `https://pokeapi.co/api/v2/pokemon/${review.pokemon_id}`
                            ).then((r) => r.json());

                            setSelectedPokemon({
                              id: pokemonData.id,
                              name: pokemonData.name,
                              sprite: pokemonData.sprites.front_default,
                              types: pokemonData.types.map((t: any) => t.type.name),
                            });
                          }}
                        >
                          <CardContent className="p-3">
                            <div className="font-semibold capitalize">
                              {review.pokemon_name}
                            </div>
                            <div className="flex gap-1 my-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.rating
                                      ? "fill-yellow-500 text-yellow-500"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-xs text-[hsl(var(--color-muted-foreground))] line-clamp-2">
                              {review.comment}
                            </p>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pokemon Details & Reviews */}
            <Card className="shadow-2xl border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <MessageSquare className="h-6 w-6 text-[#347a24]" />
                  Pokemon Details & Reviews
                </CardTitle>
                <CardDescription>
                  {selectedPokemon
                    ? `Reviews for ${selectedPokemon.name}`
                    : "Select a Pokemon to view details and reviews"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedPokemon ? (
                  <div className="space-y-4">
                    {/* Pokemon Info */}
                    <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                      <div className="relative w-24 h-24">
                        <Image
                          src={selectedPokemon.sprite}
                          alt={selectedPokemon.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold capitalize">
                          {selectedPokemon.name}
                        </h3>
                        <div className="flex gap-2 mt-2">
                          {selectedPokemon.types.map((type) => (
                            <span
                              key={type}
                              className="px-3 py-1 text-xs font-semibold rounded-full bg-[#66a777] text-white capitalize"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Reviews */}
                    <ReviewsPanel
                      pokemon={selectedPokemon}
                      userId={user.id}
                    />
                  </div>
                ) : (
                  <div className="text-center py-12 text-[hsl(var(--color-muted-foreground))]">
                    <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Search and select a Pokemon to view reviews</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function PokemonSearchPanel({
  searchInput,
  setSearchInput,
  onSelectPokemon,
}: {
  searchInput: string;
  setSearchInput: (val: string) => void;
  onSelectPokemon: (pokemon: Pokemon) => void;
}) {
  const { pokemon, isLoading, searchQuery, setSearchQuery } = usePokemonSearch();
  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (debouncedValue.length >= 3) {
      setSearchQuery(debouncedValue);
    }
  }, [debouncedValue, setSearchQuery]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--color-muted-foreground))]" />
        <Input
          placeholder="Search Pokemon (e.g., pikachu, charizard)..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="h-12 pl-10"
        />
      </div>

      {isLoading && (
        <div className="text-center py-4">
          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
        </div>
      )}

      {searchQuery && !isLoading && pokemon.length === 0 && (
        <div className="text-center py-4 text-[hsl(var(--color-muted-foreground))]">
          <p>No Pokemon found. Try another search!</p>
        </div>
      )}

      {pokemon.length > 0 && (
        <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
          {pokemon.map((p) => (
            <Card
              key={p.id}
              className="cursor-pointer bg-white hover:border-[#347a24] transition-colors"
              onClick={() => onSelectPokemon(p)}
            >
              <CardContent className="p-3 flex flex-col items-center">
                <div className="relative w-16 h-16">
                  <Image
                    src={p.sprite}
                    alt={p.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="font-semibold text-sm capitalize mt-1">{p.name}</div>
                <div className="text-xs text-[hsl(var(--color-muted-foreground))]">
                  #{p.id}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewsPanel({
  pokemon,
  userId,
}: {
  pokemon: Pokemon;
  userId: string;
}) {
  const { reviews, createReview, updateReview, deleteReview } =
    usePokemonReviews(pokemon.id);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null);
  
  // Fetch profiles for all reviewers
  const { profiles } = useProfiles(reviews.map(r => r.user_id));

  const handleCreate = () => {
    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    createReview(
      { pokemonName: pokemon.name, rating, comment },
      {
        onSuccess: () => {
          setComment("");
          setRating(5);
          toast.success("Review added!");
        },
        onError: () => {
          toast.error("Failed to add review");
        },
      }
    );
  };

  const handleUpdate = (reviewId: string) => {
    if (!editComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    updateReview(
      { reviewId, rating: editRating, comment: editComment },
      {
        onSuccess: () => {
          setEditingId(null);
          toast.success("Review updated!");
        },
        onError: () => {
          toast.error("Failed to update");
        },
      }
    );
  };

  const handleDelete = () => {
    if (!deleteReviewId) return;

    deleteReview(deleteReviewId, {
      onSuccess: () => {
        toast.success("Review deleted!");
        setDeleteReviewId(null);
      },
      onError: () => {
        toast.error("Failed to delete");
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Add Review Form */}
      <div className="p-4 border-2 rounded-lg bg-green-50 space-y-3">
        <div>
          <label className="text-sm font-medium mb-2 block">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-8 w-8 cursor-pointer transition-all ${
                  star <= rating
                    ? "fill-yellow-500 text-yellow-500"
                    : "text-gray-300"
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
        </div>
        <Textarea
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-[80px]"
        />
        <Button onClick={handleCreate} className="w-full">
          Add Review
        </Button>
      </div>

      {/* Reviews List */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-[hsl(var(--color-muted-foreground))]">
            <p>No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-4 space-y-2">
                {editingId === review.id ? (
                  <>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-6 w-6 cursor-pointer ${
                            star <= editRating
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-gray-300"
                          }`}
                          onClick={() => setEditRating(star)}
                        />
                      ))}
                    </div>
                    <Textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      className="min-h-[60px]"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleUpdate(review.id)}
                        className="flex-1"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex gap-1 mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-5 w-5 ${
                                star <= review.rating
                                  ? "fill-yellow-500 text-yellow-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs font-semibold text-[#347a24]">
                          {profiles.find(p => p.id === review.user_id)?.display_name || "Anonymous"}
                        </p>
                      </div>
                      <span className="text-xs text-[hsl(var(--color-muted-foreground))]">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">{review.comment}</p>
                    {review.user_id === userId && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingId(review.id);
                            setEditRating(review.rating);
                            setEditComment(review.comment);
                          }}
                        >
                          <Edit2 className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeleteReviewId(review.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <AlertDialog open={deleteReviewId !== null} onOpenChange={(open) => !open && setDeleteReviewId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

