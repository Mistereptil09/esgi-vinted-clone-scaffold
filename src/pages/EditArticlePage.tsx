import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArticleForm } from "../components/ArticleForm";
import { api } from "../services/api";
import { useCurrentUserId } from "../hooks/useCurrentUserId";
import type { Article, ArticleFormData } from "../types/article";

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userId = useCurrentUserId();

  const { data: article, isPending, isError } = useQuery<Article>({
    queryKey: ["articles", id],
    queryFn: () => api.get<Article>(`/api/articles/${id}`),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: (data: ArticleFormData) => {
      return api.put<Article>(`/api/articles/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["user-articles", userId] });
      queryClient.invalidateQueries({ queryKey: ["articles", id] });
      navigate("/my-articles");
    },
  });

  if (isPending) {
    return <div className="text-center py-10">Chargement de l'annonce...</div>;
  }

  if (isError || !article) {
    return (
      <div className="text-center py-10 text-red-600">
        Erreur : l'annonce n'a pas pu être chargée ou n'existe pas.
      </div>
    );
  }

  if (article.userId !== userId) {
    return (
      <div className="text-center py-10 text-red-600">
        Non autorisé : Vous n'êtes pas le propriétaire de cette annonce.
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Modifier l'annonce</h1>
      {mutation.isError && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
          Une erreur est survenue lors de la modification.
        </div>
      )}
      <ArticleForm
        defaultValues={article}
        onSubmit={(data) => mutation.mutate(data)}
        isLoading={mutation.isPending}
        submitLabel="Enregistrer les modifications"
      />
    </div>
  );
}
