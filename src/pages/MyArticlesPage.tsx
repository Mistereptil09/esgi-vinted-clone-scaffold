import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { useCurrentUserId } from "../hooks/useCurrentUserId";
import { MyArticleCard } from "../components/MyArticleCard";
import type { Article } from "../types/article";

export default function MyArticlesPage() {
  const userId = useCurrentUserId();
  const queryClient = useQueryClient();

  const { data: articles, isPending, isError } = useQuery<Article[]>({
    queryKey: ["user-articles", userId],
    queryFn: () => api.get<Article[]>(`/api/users/${userId}/articles`),
  });

  const deleteMutation = useMutation({
    mutationFn: (articleId: string) => api.delete(`/api/articles/${articleId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-articles", userId] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });

  if (isPending) {
    return <div className="text-center py-10">Chargement de vos annonces...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-600">
        Une erreur est survenue lors du chargement.
      </div>
    );
  }

  const isEmpty = !articles || articles.length === 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mes annonces</h1>
        <Link
          to="/publish"
          className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 text-sm font-medium"
        >
          Publier une annonce
        </Link>
      </div>

      {isEmpty ? (
        <div className="text-center py-16 bg-white border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-4">Vous n'avez pas encore d'annonces.</p>
          <Link
            to="/publish"
            className="text-teal-600 font-medium hover:text-teal-700 underline"
          >
            Commencez à vendre vos articles
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {articles.map((article) => (
            <MyArticleCard
              key={article.id}
              article={article}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
