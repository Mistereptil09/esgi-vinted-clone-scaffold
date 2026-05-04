import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { Article } from "../types/article";
import { api } from "../services/api";
import { ArticleDetailView } from "../components/ArticleDetailView.tsx";

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: article,
    isPending,
    isError
  } = useQuery<Article>({
    queryKey: ["articles", id],
    queryFn: () => api.get(`/api/articles/${id}`)
  });

  if (isPending) {
    return <div className="text-center py-10">Chargement de l'article...</div>;
  }

  if (isError || !article) {
    return (
      <div className="text-center py-10">
        <h1 className="text-xl font-bold">Article introuvable</h1>
        <p>L'article demandé n'existe pas ou n'a pas pu être chargé.</p>
        <Link
          to="/"
          className="mt-4 inline-block bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700">
          Retour au catalogue
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/" className="text-teal-600 hover:underline mb-4 block">
        Retour au catalogue
      </Link>

      <ArticleDetailView article={article} />
    </div>
  );
}
