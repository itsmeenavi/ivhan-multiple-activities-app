import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { foodService } from "@/services/food.service";
import { useAuth } from "@/contexts/auth-context";

export function useFoodPhotos() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: foodPhotos = [], isLoading } = useQuery({
    queryKey: ["food-photos"],
    queryFn: () => foodService.getFoodPhotos(),
    enabled: !!user?.id,
  });

  const uploadMutation = useMutation({
    mutationFn: ({ file, name }: { file: File; name: string }) =>
      foodService.uploadFoodPhoto(user?.id || "", file, name),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["food-photos"] });
      await queryClient.refetchQueries({ queryKey: ["food-photos"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ photoId, name }: { photoId: string; name: string }) =>
      foodService.updateFoodPhoto(photoId, name),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["food-photos"] });
      await queryClient.refetchQueries({ queryKey: ["food-photos"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ photoId, photoUrl }: { photoId: string; photoUrl: string }) =>
      foodService.deleteFoodPhoto(photoId, photoUrl),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["food-photos"] });
      await queryClient.refetchQueries({ queryKey: ["food-photos"] });
    },
  });

  return {
    foodPhotos,
    isLoading,
    uploadFoodPhoto: uploadMutation.mutate,
    updateFoodPhoto: updateMutation.mutate,
    deleteFoodPhoto: deleteMutation.mutate,
    isUploading: uploadMutation.isPending,
  };
}

export function useFoodReviews(foodPhotoId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["food-reviews", foodPhotoId],
    queryFn: () => foodService.getReviews(foodPhotoId),
    enabled: !!foodPhotoId,
  });

  const createMutation = useMutation({
    mutationFn: ({ rating, comment }: { rating: number; comment: string }) =>
      foodService.createReview(user?.id || "", foodPhotoId, rating, comment),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["food-reviews", foodPhotoId] });
      await queryClient.refetchQueries({ queryKey: ["food-reviews", foodPhotoId] });
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
    }) => foodService.updateReview(reviewId, rating, comment),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["food-reviews", foodPhotoId] });
      await queryClient.refetchQueries({ queryKey: ["food-reviews", foodPhotoId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (reviewId: string) => foodService.deleteReview(reviewId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["food-reviews", foodPhotoId] });
      await queryClient.refetchQueries({ queryKey: ["food-reviews", foodPhotoId] });
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

