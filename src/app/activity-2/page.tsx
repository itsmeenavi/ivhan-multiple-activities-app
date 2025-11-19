"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Edit2,
  Check,
  X,
  Loader2,
  Search,
  ArrowUpDown,
} from "lucide-react";
import { toast } from "sonner";
import { usePhotos } from "@/hooks/use-photos";
import Image from "next/image";

type SortOption = "name-asc" | "name-desc" | "date-asc" | "date-desc";

export default function Activity2() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { photos, isLoading, uploadPhoto, updatePhoto, deletePhoto } =
    usePhotos();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    uploadPhoto(file, {
      onSuccess: () => {
        toast.success("Photo uploaded successfully!");
        e.target.value = "";
      },
      onError: () => {
        toast.error("Failed to upload photo");
      },
    });
  };

  const handleStartEdit = (photoId: string, currentName: string) => {
    setEditingId(photoId);
    setEditingName(currentName);
  };

  const handleSaveEdit = (photoId: string) => {
    if (!editingName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    updatePhoto(
      { photoId, name: editingName },
      {
        onSuccess: () => {
          setEditingId(null);
          setEditingName("");
          toast.success("Photo name updated!");
        },
        onError: () => {
          toast.error("Failed to update photo");
        },
      }
    );
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleDelete = (photoId: string, photoUrl: string, photoName: string) => {
    if (!confirm(`Are you sure you want to delete "${photoName}"?`)) {
      return;
    }

    deletePhoto(
      { photoId, photoUrl },
      {
        onSuccess: () => {
          toast.success("Photo deleted!");
        },
        onError: () => {
          toast.error("Failed to delete photo");
        },
      }
    );
  };

  // Filter and sort photos
  const filteredAndSortedPhotos = useMemo(() => {
    let result = [...photos];

    // Filter by search query
    if (searchQuery.trim()) {
      result = result.filter((photo) =>
        photo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "date-asc":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "date-desc":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [photos, searchQuery, sortBy]);

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
      <div className="container mx-auto max-w-6xl">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-[#347a24]">
              Activity 2: Photo Management
            </h1>
            <p className="text-[hsl(var(--color-muted-foreground))]">
              Upload, search, and manage your photos
            </p>
          </div>

          <Card className="shadow-2xl border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <ImageIcon className="h-6 w-6 text-[#347a24]" />
                My Photos
              </CardTitle>
              <CardDescription className="text-base">
                Google Drive Lite: Upload and manage your photo collection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload & Controls */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <Button 
                      onClick={() => document.getElementById('photo-upload')?.click()}
                      className="w-full h-12 cursor-pointer"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                  </div>
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--color-muted-foreground))]" />
                    <Input
                      placeholder="Search by name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-12 pl-10"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-[hsl(var(--color-muted-foreground))]" />
                  <span className="text-sm font-medium">Sort by:</span>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant={sortBy === "name-asc" ? "default" : "outline"}
                      onClick={() => setSortBy("name-asc")}
                    >
                      Name A-Z
                    </Button>
                    <Button
                      size="sm"
                      variant={sortBy === "name-desc" ? "default" : "outline"}
                      onClick={() => setSortBy("name-desc")}
                    >
                      Name Z-A
                    </Button>
                    <Button
                      size="sm"
                      variant={sortBy === "date-desc" ? "default" : "outline"}
                      onClick={() => setSortBy("date-desc")}
                    >
                      Newest First
                    </Button>
                    <Button
                      size="sm"
                      variant={sortBy === "date-asc" ? "default" : "outline"}
                      onClick={() => setSortBy("date-asc")}
                    >
                      Oldest First
                    </Button>
                  </div>
                </div>
              </div>

              {/* Photo Grid */}
              {filteredAndSortedPhotos.length === 0 ? (
                <div className="text-center py-12 text-[hsl(var(--color-muted-foreground))]">
                  <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg">
                    {searchQuery
                      ? "No photos found matching your search"
                      : "No photos yet. Upload one to get started!"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAndSortedPhotos.map((photo) => (
                    <Card key={photo.id} className="overflow-hidden">
                      <div className="relative aspect-square bg-gray-100">
                        <Image
                          src={photo.url}
                          alt={photo.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      <CardContent className="p-4 space-y-2">
                        {editingId === photo.id ? (
                          <div className="flex gap-2">
                            <Input
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleSaveEdit(photo.id);
                                } else if (e.key === "Escape") {
                                  handleCancelEdit();
                                }
                              }}
                              className="flex-1"
                              autoFocus
                            />
                            <Button
                              size="sm"
                              onClick={() => handleSaveEdit(photo.id)}
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
                        ) : (
                          <>
                            <div className="font-medium truncate" title={photo.name}>
                              {photo.name}
                            </div>
                            <div className="flex justify-between items-center text-xs text-[hsl(var(--color-muted-foreground))]">
                              <span>
                                {new Date(photo.created_at).toLocaleDateString()}
                              </span>
                              <span>{(photo.size / 1024).toFixed(1)} KB</span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => handleStartEdit(photo.id, photo.name)}
                              >
                                <Edit2 className="h-3 w-3 mr-1" />
                                Rename
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  handleDelete(photo.id, photo.url, photo.name)
                                }
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Stats */}
              {photos.length > 0 && (
                <div className="flex justify-between text-sm text-[hsl(var(--color-muted-foreground))] pt-4 border-t">
                  <span>
                    Total Photos: <strong>{photos.length}</strong>
                  </span>
                  {searchQuery && (
                    <span>
                      Showing: <strong>{filteredAndSortedPhotos.length}</strong>
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

