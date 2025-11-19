import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { photoService } from "@/services/photo.service";
import { useAuth } from "@/contexts/auth-context";

export function usePhotos() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: photos = [], isLoading } = useQuery({
    queryKey: ["photos", user?.id],
    queryFn: () => photoService.getPhotos(user?.id || ""),
    enabled: !!user?.id,
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => photoService.uploadPhoto(user?.id || "", file),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["photos", user?.id] });
      await queryClient.refetchQueries({ queryKey: ["photos", user?.id] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ photoId, name }: { photoId: string; name: string }) =>
      photoService.updatePhoto(photoId, name),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["photos", user?.id] });
      await queryClient.refetchQueries({ queryKey: ["photos", user?.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ photoId, photoUrl }: { photoId: string; photoUrl: string }) =>
      photoService.deletePhoto(photoId, photoUrl),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["photos", user?.id] });
      await queryClient.refetchQueries({ queryKey: ["photos", user?.id] });
    },
  });

  return {
    photos,
    isLoading,
    uploadPhoto: uploadMutation.mutate,
    updatePhoto: updateMutation.mutate,
    deletePhoto: deleteMutation.mutate,
    isUploading: uploadMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

