import { useQuery } from "@tanstack/react-query";
import { profileService } from "@/services/profile.service";

export function useProfile(userId: string | undefined) {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => profileService.getProfile(userId!),
    enabled: !!userId,
  });

  return { profile, isLoading };
}

export function useProfiles(userIds: string[]) {
  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ["profiles", ...userIds.sort()],
    queryFn: () => profileService.getProfiles(userIds),
    enabled: userIds.length > 0,
  });

  return { profiles, isLoading };
}

