"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ListTodo, Plus, Trash2, Edit2, Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTodos } from "@/hooks/use-todos";
import { TodoPriority } from "@/services/todo.service";

export default function Activity1() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { todos, isLoading, createTodo, updateTodo, deleteTodo } = useTodos();
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingPriority, setEditingPriority] = useState<TodoPriority>("LOW");
  const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [newTodoPriority, setNewTodoPriority] = useState<TodoPriority>("LOW");

  const priorityOptions: { label: string; value: TodoPriority }[] = [
    { label: "Low", value: "LOW" },
    { label: "Medium", value: "MEDIUM" },
    { label: "High", value: "HIGH" },
  ];

  const priorityStyles: Record<TodoPriority, string> = {
    LOW: "bg-emerald-100 text-emerald-800",
    MEDIUM: "bg-amber-100 text-amber-800",
    HIGH: "bg-rose-100 text-rose-800",
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const handleCreate = () => {
    if (!newTodoTitle.trim()) {
      toast.error("Please enter a todo title");
      return;
    }

    createTodo(
      { title: newTodoTitle.trim(), priority: newTodoPriority },
      {
        onSuccess: () => {
          setNewTodoTitle("");
          setNewTodoPriority("LOW");
          toast.success("Todo created!");
        },
        onError: () => {
          toast.error("Failed to create todo");
        },
      }
    );
  };

  const handleToggleComplete = (todoId: string, completed: boolean) => {
    setUpdatingId(todoId);
    updateTodo(
      { todoId, updates: { completed: !completed } },
      {
        onSuccess: () => {
          toast.success(completed ? "Todo marked incomplete" : "Todo completed!");
          setUpdatingId(null);
        },
        onError: () => {
          toast.error("Failed to update todo");
          setUpdatingId(null);
        },
      }
    );
  };

  const handleStartEdit = (
    todoId: string,
    currentTitle: string,
    currentPriority: TodoPriority
  ) => {
    setEditingId(todoId);
    setEditingTitle(currentTitle);
    setEditingPriority(currentPriority);
  };

  const handleSaveEdit = (todoId: string) => {
    if (!editingTitle.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    updateTodo(
      {
        todoId,
        updates: { title: editingTitle.trim(), priority: editingPriority },
      },
      {
        onSuccess: () => {
          setEditingId(null);
          setEditingTitle("");
          setEditingPriority("LOW");
          toast.success("Todo updated!");
        },
        onError: () => {
          toast.error("Failed to update todo");
        },
      }
    );
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
    setEditingPriority("LOW");
  };

  const handleDelete = (todoId: string) => {
    deleteTodo(todoId, {
      onSuccess: () => {
        toast.success("Todo deleted!");
        setDeleteDialogId(null);
      },
      onError: () => {
        toast.error("Failed to delete todo");
      },
    });
  };

  if (loading || isLoading) {
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
      <div className="container mx-auto max-w-4xl">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-[#347a24]">
              Activity 1: Todo List
            </h1>
            <p className="text-[hsl(var(--color-muted-foreground))]">
              Manage your tasks with full CRUD operations
            </p>
          </div>

          <Card className="shadow-2xl border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <ListTodo className="h-6 w-6 text-[#347a24]" />
                My Todos
              </CardTitle>
              <CardDescription className="text-base">
                Create, read, update, and delete your todos. All data persists on
                browser restart.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Create Todo */}
              <div className="flex flex-col gap-2 md:flex-row">
                <Input
                  placeholder="Enter a new todo..."
                  value={newTodoTitle}
                  onChange={(e) => setNewTodoTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCreate();
                    }
                  }}
                  className="h-12"
                />
                <div className="flex gap-2">
                  <select
                    value={newTodoPriority}
                    onChange={(e) =>
                      setNewTodoPriority(e.target.value as TodoPriority)
                    }
                    className="h-12 rounded-md border px-3 text-sm font-medium uppercase text-[#347a24] outline-none focus:ring-2 focus:ring-[#66a777]"
                  >
                    {priorityOptions.map(({ label, value }) => (
                      <option key={value} value={value}>
                        {label} Priority
                      </option>
                    ))}
                  </select>
                  <Button onClick={handleCreate} className="h-12" size="lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>

              {/* Todo List */}
              <div className="space-y-2">
                {todos.length === 0 ? (
                  <div className="text-center py-12 text-[hsl(var(--color-muted-foreground))]">
                    <ListTodo className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-lg">No todos yet. Create one to get started!</p>
                  </div>
                ) : (
                    todos.map((todo) => (
                      <div
                        key={todo.id}
                        className="flex items-center gap-3 p-4 border-2 rounded-lg bg-white hover:border-[#66a777] transition-colors"
                      >
                      {updatingId === todo.id ? (
                        <Loader2 className="h-5 w-5 animate-spin text-[#347a24]" />
                      ) : (
                        <Checkbox
                          checked={todo.completed}
                          onCheckedChange={() =>
                            handleToggleComplete(todo.id, todo.completed)
                          }
                          className="h-6 w-6 border-2 border-[#347a24] data-[state=checked]:bg-[#347a24] data-[state=checked]:border-[#347a24]"
                        />
                      )}

                      {editingId === todo.id ? (
                        <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
                          <Input
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSaveEdit(todo.id);
                              } else if (e.key === "Escape") {
                                handleCancelEdit();
                              }
                            }}
                            className="flex-1"
                            autoFocus
                          />
                          <select
                            value={editingPriority}
                            onChange={(e) =>
                              setEditingPriority(e.target.value as TodoPriority)
                            }
                            className="h-10 rounded-md border px-3 text-xs font-semibold uppercase text-[#347a24] outline-none focus:ring-2 focus:ring-[#66a777]"
                          >
                            {priorityOptions.map(({ label, value }) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleSaveEdit(todo.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <span
                            className={`flex-1 ${
                              todo.completed
                                ? "line-through text-[hsl(var(--color-muted-foreground))]"
                                : ""
                            }`}
                          >
                            {todo.title}
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${priorityStyles[todo.priority]}`}
                          >
                            {todo.priority}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleStartEdit(todo.id, todo.title, todo.priority)
                            }
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setDeleteDialogId(todo.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Stats */}
              {todos.length > 0 && (
                <div className="flex justify-between text-sm text-[hsl(var(--color-muted-foreground))] pt-4 border-t">
                  <span>
                    Total: <strong>{todos.length}</strong>
                  </span>
                  <span>
                    Completed:{" "}
                    <strong>{todos.filter((t) => t.completed).length}</strong>
                  </span>
                  <span>
                    Pending:{" "}
                    <strong>{todos.filter((t) => !t.completed).length}</strong>
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={deleteDialogId !== null} onOpenChange={(open) => !open && setDeleteDialogId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Todo?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this todo? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialogId && handleDelete(deleteDialogId)}
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

