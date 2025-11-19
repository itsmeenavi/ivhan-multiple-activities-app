import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { noteService } from "@/services/note.service";
import { useAuth } from "@/contexts/auth-context";

export function useNotes() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["notes", user?.id],
    queryFn: () => noteService.getNotes(user?.id || ""),
    enabled: !!user?.id,
  });

  const createMutation = useMutation({
    mutationFn: ({ title, content }: { title: string; content: string }) =>
      noteService.createNote(user?.id || "", title, content),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes", user?.id] });
      await queryClient.refetchQueries({ queryKey: ["notes", user?.id] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      noteId,
      title,
      content,
    }: {
      noteId: string;
      title: string;
      content: string;
    }) => noteService.updateNote(noteId, title, content),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes", user?.id] });
      await queryClient.refetchQueries({ queryKey: ["notes", user?.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (noteId: string) => noteService.deleteNote(noteId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes", user?.id] });
      await queryClient.refetchQueries({ queryKey: ["notes", user?.id] });
    },
  });

  return {
    notes,
    isLoading,
    createNote: createMutation.mutate,
    updateNote: updateMutation.mutate,
    deleteNote: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

