import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArticleForm } from "../components/ArticleForm";
import { api } from "../services/api";
import { useCurrentUserId } from "../hooks/useCurrentUserId";
import type { ArticleFormData, Article } from "../types/article";

export default function PublishPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userId = useCurrentUserId();

  const mutation = useMutation({
    mutationFn: (data: ArticleFormData) => {
      return api.post<Article>("/api/articles", data);
    },
    onSuccess: (newArticle) => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["user-articles", userId] });
      navigate(`/articles/${newArticle.id}`);
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Publier une annonce</h1>
      {mutation.isError && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
          Une erreur est survenue lors de la publication.
        </div>
      )}
      <ArticleForm
        onSubmit={(data) => mutation.mutate(data)}
        isLoading={mutation.isPending}
        submitLabel="Publier"
      />
    </div>
  );
}
