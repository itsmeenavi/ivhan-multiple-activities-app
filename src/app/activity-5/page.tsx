"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  FileText,
  Plus,
  Trash2,
  Save,
  Loader2,
  Eye,
  Code,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useNotes } from "@/hooks/use-notes";
import ReactMarkdown from "react-markdown";

type ViewMode = "raw" | "preview";

export default function Activity5() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { notes, isLoading, createNote, updateNote, deleteNote } = useNotes();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("raw");
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{id: string; title: string} | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (selectedNoteId) {
      const note = notes.find((n) => n.id === selectedNoteId);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
        setIsEditing(true);
      }
    }
  }, [selectedNoteId, notes]);

  const handleCreateNew = () => {
    setSelectedNoteId(null);
    setTitle("");
    setContent("");
    setIsEditing(true);
    setViewMode("raw");
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!content.trim()) {
      toast.error("Please enter some content");
      return;
    }

    if (selectedNoteId) {
      // Update existing note
      updateNote(
        { noteId: selectedNoteId, title, content },
        {
          onSuccess: () => {
            toast.success("Note updated!");
            setIsEditing(false);
          },
          onError: () => {
            toast.error("Failed to update note");
          },
        }
      );
    } else {
      // Create new note
      createNote(
        { title, content },
        {
          onSuccess: (newNote) => {
            toast.success("Note created!");
            setSelectedNoteId(newNote.id);
            setIsEditing(false);
          },
          onError: () => {
            toast.error("Failed to create note");
          },
        }
      );
    }
  };

  const handleDelete = () => {
    if (!deleteDialog) return;

    deleteNote(deleteDialog.id, {
      onSuccess: () => {
        if (selectedNoteId === deleteDialog.id) {
          setSelectedNoteId(null);
          setTitle("");
          setContent("");
          setIsEditing(false);
        }
        toast.success("Note deleted!");
        setDeleteDialog(null);
      },
      onError: () => {
        toast.error("Failed to delete note");
      },
    });
  };

  const handleSelectNote = (noteId: string) => {
    setSelectedNoteId(noteId);
    setIsEditing(false);
    setViewMode("raw");
  };

  const handleCancel = () => {
    if (selectedNoteId) {
      const note = notes.find((n) => n.id === selectedNoteId);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
      }
      setIsEditing(false);
    } else {
      setTitle("");
      setContent("");
      setIsEditing(false);
    }
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
      <div className="container mx-auto max-w-7xl">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-[#347a24]">
              Activity 5: Markdown Notes
            </h1>
            <p className="text-[hsl(var(--color-muted-foreground))]">
              Create and manage notes with Markdown support
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Notes List */}
            <Card className="shadow-2xl border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="h-5 w-5 text-[#347a24]" />
                  My Notes
                </CardTitle>
                <CardDescription>All your markdown notes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleCreateNew} className="w-full" size="lg">
                  <Plus className="h-4 w-4 mr-2" />
                  New Note
                </Button>

                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {notes.length === 0 ? (
                    <div className="text-center py-8 text-[hsl(var(--color-muted-foreground))]">
                      <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No notes yet. Create one!</p>
                    </div>
                  ) : (
                    notes.map((note) => (
                      <Card
                        key={note.id}
                        className={`cursor-pointer transition-all bg-white ${
                          selectedNoteId === note.id
                            ? "border-[#347a24] border-2"
                            : ""
                        }`}
                        onClick={() => handleSelectNote(note.id)}
                      >
                        <CardContent className="p-3 space-y-2">
                          <div className="font-semibold truncate">{note.title}</div>
                          <div className="text-xs text-[hsl(var(--color-muted-foreground))]">
                            {new Date(note.updated_at || note.created_at).toLocaleDateString()}
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteDialog({ id: note.id, title: note.title });
                            }}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Editor/Viewer */}
            <Card className="shadow-2xl border-2 lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <FileText className="h-5 w-5 text-[#347a24]" />
                    {isEditing
                      ? selectedNoteId
                        ? "Edit Note"
                        : "New Note"
                      : "View Note"}
                  </CardTitle>
                  {selectedNoteId && !isEditing && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing || selectedNoteId ? (
                  <>
                    {isEditing ? (
                      <>
                        <Input
                          placeholder="Note title..."
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="text-lg font-semibold"
                          disabled={!isEditing}
                        />

                        <div className="flex gap-2 border-b pb-2">
                          <Button
                            size="sm"
                            variant={viewMode === "raw" ? "default" : "outline"}
                            onClick={() => setViewMode("raw")}
                          >
                            <Code className="h-4 w-4 mr-1" />
                            Raw
                          </Button>
                          <Button
                            size="sm"
                            variant={viewMode === "preview" ? "default" : "outline"}
                            onClick={() => setViewMode("preview")}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                        </div>

                        {viewMode === "raw" ? (
                          <Textarea
                            placeholder="Write your markdown content here...&#10;&#10;# Example Heading&#10;**Bold text**&#10;*Italic text*&#10;- List item&#10;[Link](https://example.com)"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[500px] font-mono"
                            disabled={!isEditing}
                          />
                        ) : (
                          <div className="min-h-[500px] p-4 border rounded-lg prose prose-sm max-w-none dark:prose-invert overflow-auto">
                            <ReactMarkdown>{content || "*No content yet*"}</ReactMarkdown>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button onClick={handleSave} className="flex-1">
                            <Save className="h-4 w-4 mr-2" />
                            Save Note
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleCancel}
                            className="flex-1"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-2xl font-bold">{title}</div>

                        <div className="flex gap-2 border-b pb-2">
                          <Button
                            size="sm"
                            variant={viewMode === "raw" ? "default" : "outline"}
                            onClick={() => setViewMode("raw")}
                          >
                            <Code className="h-4 w-4 mr-1" />
                            Raw
                          </Button>
                          <Button
                            size="sm"
                            variant={viewMode === "preview" ? "default" : "outline"}
                            onClick={() => setViewMode("preview")}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                        </div>

                        {viewMode === "raw" ? (
                          <pre className="min-h-[500px] p-4 border rounded-lg bg-gray-50 overflow-auto font-mono text-sm">
                            {content}
                          </pre>
                        ) : (
                          <div className="min-h-[500px] p-4 border rounded-lg prose prose-sm max-w-none overflow-auto bg-white">
                            <ReactMarkdown>{content}</ReactMarkdown>
                          </div>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-center py-20 text-[hsl(var(--color-muted-foreground))]">
                    <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">No note selected</p>
                    <p className="text-sm">
                      Select a note from the list or create a new one
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Markdown Guide */}
          <Card className="shadow-lg border">
            <CardHeader>
              <CardTitle className="text-lg">Markdown Quick Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    # Heading
                  </code>
                </div>
                <div>
                  <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    **Bold**
                  </code>
                </div>
                <div>
                  <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    *Italic*
                  </code>
                </div>
                <div>
                  <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    [Link](url)
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={deleteDialog !== null} onOpenChange={(open) => !open && setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteDialog?.title}&quot;? This action cannot be undone.
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

