import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {api} from "../services/api";
import type {Article} from "../types/article";

type FavoriteButtonProps = {
  articleId: string;
  className?: string;
  compact?: boolean;
};

export function FavoriteButton({
      articleId, 
      className = "", 
      compact = false,
  }: FavoriteButtonProps) {
  const queryClient = useQueryClient();
  const {data: favorites = []} = useQuery<Article[]>({
    queryKey: ["favorites"],
    queryFn: () => api.get<Article[]>("/api/favorites"),
  });
  
  const isFavorite = favorites.some(fav => fav.id === articleId);
  
  const favoriteMutation = useMutation({
    mutationFn: () => {
      if (!articleId) {
        throw new Error("Article introuvable");
      }
      if (isFavorite) {
        return api.delete(`/api/favorites/${articleId}`);
      }
      return api.post(`/api/favorites/${articleId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["favorites"]});
    },
  });
  
  const label = isFavorite ? "Retirer des favoris" : "Ajouter aux favoris";
  
  return (
    <button
      type={"button"}
      aria-label={label}
      title={label}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        favoriteMutation.mutate();
      }}
      disabled={favoriteMutation.isPending}
      className={`${className} inline-flex items-center justify-center rounded-full font-medium shadow-sm transition-colors disabled:opacity-50 ${
        isFavorite
          ? "bg-red-50 text-red-600 hover:bg-red-100"
          : "bg-white text-gray-700 hover:bg-gray-100"
      } ${compact ? "h-9 w-9 text-lg" : "gap-2 px-4 py-2 text-sm"}`}
    >
      <span>{isFavorite ? "♥" : "♡"}</span>
      {!compact && (
        <span>
          {favoriteMutation.isPending
            ? "Mise à jour..."
            : isFavorite
              ? "Retirer des favoris"
              : "Ajouter aux favoris"}
        </span>
      )}
    </button>
  );
}