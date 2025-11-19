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
  UtensilsCrossed,
  Upload,
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
import { useFoodPhotos, useFoodReviews } from "@/hooks/use-food";
import { useProfiles } from "@/hooks/use-profiles";
import Image from "next/image";

type SortOption = "name-asc" | "name-desc" | "date-asc" | "date-desc";

export default function Activity3() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { foodPhotos, isLoading, uploadFoodPhoto, updateFoodPhoto, deleteFoodPhoto } =
    useFoodPhotos();
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const [uploadName, setUploadName] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [editingPhotoName, setEditingPhotoName] = useState("");
  const [deletePhotoDialog, setDeletePhotoDialog] = useState<{id: string; url: string; name: string} | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setSelectedFile(file);
    e.target.value = ""; // Reset input
  };

  const handleSubmitUpload = () => {
    if (!selectedFile) {
      toast.error("Please select an image");
      return;
    }

    if (!uploadName.trim()) {
      toast.error("Please enter a name for the food");
      return;
    }

    uploadFoodPhoto(
      { file: selectedFile, name: uploadName },
      {
        onSuccess: () => {
          toast.success("Food photo uploaded!");
          setUploadName("");
          setShowUploadForm(false);
          setSelectedFile(null);
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
          }
        },
        onError: () => {
          toast.error("Failed to upload photo");
        },
      }
    );
  };

  const handleCancelUpload = () => {
    setShowUploadForm(false);
    setUploadName("");
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleUpdatePhoto = (photoId: string) => {
    if (!editingPhotoName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    updateFoodPhoto(
      { photoId, name: editingPhotoName },
      {
        onSuccess: () => {
          setEditingPhotoId(null);
          setEditingPhotoName("");
          toast.success("Food name updated!");
        },
        onError: () => {
          toast.error("Failed to update");
        },
      }
    );
  };

  const handleDeletePhoto = () => {
    if (!deletePhotoDialog) return;

    deleteFoodPhoto(
      { photoId: deletePhotoDialog.id, photoUrl: deletePhotoDialog.url },
      {
        onSuccess: () => {
          if (selectedPhotoId === deletePhotoDialog.id) {
            setSelectedPhotoId(null);
          }
          toast.success("Food photo deleted!");
          setDeletePhotoDialog(null);
        },
        onError: () => {
          toast.error("Failed to delete");
        },
      }
    );
  };

  const sortedPhotos = useMemo(() => {
    const result = [...foodPhotos];
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
  }, [foodPhotos, sortBy]);

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

  const selectedPhoto = foodPhotos.find((p) => p.id === selectedPhotoId);

  return (
    <div className="min-h-[calc(100vh-73px)] bg-white p-4 md:p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-[#347a24]">
              Activity 3: Food Review
            </h1>
            <p className="text-[hsl(var(--color-muted-foreground))]">
              Share food photos and write reviews
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Food Photos List */}
            <Card className="shadow-2xl border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <UtensilsCrossed className="h-6 w-6 text-[#347a24]" />
                  Food Photos
                </CardTitle>
                <CardDescription>Upload and manage your food photos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!showUploadForm ? (
                  <Button
                    onClick={() => setShowUploadForm(true)}
                    className="w-full h-12"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Food Photo
                  </Button>
                ) : (
                  <div className="space-y-3 p-4 border-2 rounded-lg bg-green-50">
                    <Input
                      placeholder="Food name (e.g., Pepperoni Pizza)"
                      value={uploadName}
                      onChange={(e) => setUploadName(e.target.value)}
                    />
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileSelect}
                      id="food-file-input"
                    />
                    {previewUrl && (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-[#66a777]">
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSubmitUpload}
                        disabled={!selectedFile || !uploadName.trim()}
                        className="flex-1"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Submit
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancelUpload}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm">
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

                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {sortedPhotos.length === 0 ? (
                    <div className="text-center py-8 text-[hsl(var(--color-muted-foreground))]">
                      <UtensilsCrossed className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No food photos yet</p>
                    </div>
                  ) : (
                    sortedPhotos.map((photo) => (
                      <Card
                        key={photo.id}
                        className={`cursor-pointer transition-all bg-white ${
                          selectedPhotoId === photo.id
                            ? "border-[#347a24] border-2"
                            : ""
                        }`}
                        onClick={() => setSelectedPhotoId(photo.id)}
                      >
                        <CardContent className="p-3 flex gap-3">
                          <div className="relative w-20 h-20 shrink-0 rounded overflow-hidden bg-gray-100">
                            <Image
                              src={photo.url}
                              alt={photo.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            {editingPhotoId === photo.id ? (
                              <div className="flex gap-1">
                                <Input
                                  value={editingPhotoName}
                                  onChange={(e) => setEditingPhotoName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      handleUpdatePhoto(photo.id);
                                    } else if (e.key === "Escape") {
                                      setEditingPhotoId(null);
                                    }
                                    e.stopPropagation();
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  className="h-8"
                                  autoFocus
                                />
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdatePhoto(photo.id);
                                  }}
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <>
                                <div className="font-semibold truncate">
                                  {photo.name}
                                </div>
                                <div className="text-xs text-[hsl(var(--color-muted-foreground))]">
                                  {new Date(photo.created_at).toLocaleDateString()}
                                </div>
                                {photo.user_id === user.id && (
                                  <div className="flex gap-1 mt-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-6 text-xs"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingPhotoId(photo.id);
                                        setEditingPhotoName(photo.name);
                                      }}
                                    >
                                      <Edit2 className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      className="h-6 text-xs"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDeletePhotoDialog({ id: photo.id, url: photo.url, name: photo.name });
                                      }}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card className="shadow-2xl border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <MessageSquare className="h-6 w-6 text-[#347a24]" />
                  Reviews
                </CardTitle>
                <CardDescription>
                  {selectedPhoto
                    ? `Reviews for ${selectedPhoto.name}`
                    : "Select a food photo to view/add reviews"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedPhotoId ? (
                  <ReviewsPanel foodPhotoId={selectedPhotoId} userId={user.id} />
                ) : (
                  <div className="text-center py-12 text-[hsl(var(--color-muted-foreground))]">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Select a food photo to view or add reviews</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AlertDialog open={deletePhotoDialog !== null} onOpenChange={(open) => !open && setDeletePhotoDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Food Photo?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletePhotoDialog?.name}&quot; and all its reviews?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePhoto}
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

function ReviewsPanel({
  foodPhotoId,
  userId,
}: {
  foodPhotoId: string;
  userId: string;
}) {
  const { reviews, createReview, updateReview, deleteReview } =
    useFoodReviews(foodPhotoId);
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
      { rating, comment },
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
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
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

