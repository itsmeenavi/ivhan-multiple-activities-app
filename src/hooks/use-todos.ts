import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { todoService } from "@/services/todo.service";
import { useAuth } from "@/contexts/auth-context";

export function useTodos() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: todos = [], isLoading } = useQuery({
    queryKey: ["todos", user?.id],
    queryFn: () => todoService.getTodos(user?.id || ""),
    enabled: !!user?.id,
  });

  const createMutation = useMutation({
    mutationFn: (title: string) =>
      todoService.createTodo(user?.id || "", title),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["todos", user?.id] });
      await queryClient.refetchQueries({ queryKey: ["todos", user?.id] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      todoId,
      updates,
    }: {
      todoId: string;
      updates: { title?: string; completed?: boolean };
    }) => todoService.updateTodo(todoId, updates),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["todos", user?.id] });
      await queryClient.refetchQueries({ queryKey: ["todos", user?.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (todoId: string) => todoService.deleteTodo(todoId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["todos", user?.id] });
      await queryClient.refetchQueries({ queryKey: ["todos", user?.id] });
    },
  });

  return {
    todos,
    isLoading,
    createTodo: createMutation.mutate,
    updateTodo: updateMutation.mutate,
    deleteTodo: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

