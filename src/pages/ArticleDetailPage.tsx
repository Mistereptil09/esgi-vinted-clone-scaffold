import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Article } from "../types/article";
import { api } from "../services/api";
import { CATEGORIES, CONDITIONS } from "../types/article";

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const {
    data: article,
    isPending,
    isError
  } = useQuery<Article>({
    queryKey: ["articles", id],
    queryFn: () => api.get(`/api/articles/${id}`)
  });

  const { data: favorites = [] } = useQuery<Article[]>({
    queryKey: ["favorites"],
    queryFn: () => api.get("/api/favorites"),
  });

  const isFavorite = favorites.some(fav => fav.id === id);
  const favoriteMutation = useMutation({
    mutationFn: () => {
      if (!id) {
        throw new Error("Article introuvable");
      }
      if (isFavorite) {
        return api.delete(`/api/favorites/${id}`);
      }
      return api.post(`/api/favorites/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
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

  const categoryLabel = CATEGORIES.find(c => c.id === article.category)?.label || article.category;
  const conditionLabel = CONDITIONS.find(c => c.value === article.condition)?.label || article.condition;
  const formattedPrice = article.price.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR"
  });
  const formattedDate =new Date(article.createdAt).toLocaleDateString("fr-FR");

  return (
    <div>
      <Link to="/" className="text-teal-600 hover:underline mb-4 block">
        Retour au catalogue
      </Link>


      <article className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-gray-100">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="h-full min-h-80 w-full object-cover"
            />
          </div>

          <div className="flex flex-col p-6">
            <div className="mb-6">
              <h1 className="mb-3 text-3xl font-bold text-gray-900">
                {article.title}
              </h1>
              <p className="text-2xl font-bold text-teal-600">
                {formattedPrice}
              </p>
              <button
                type="button"
                onClick={() => favoriteMutation.mutate()}
                disabled={favoriteMutation.isPending}
                className={`mt-4 w-full rounded-md px-4 py-2 text-sm font-medium ${
                  isFavorite
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-teal-600 text-white hover:bg-teal-700"
                }`}
                >
                {favoriteMutation.isPending
                ? "Enregistrement en cours..."
                : isFavorite
                  ? "Retirer des favoris"
                  : "Ajouter aux favoris"}
              </button>
            </div>

            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Catégorie</p>
                <p className="text-gray-900">{categoryLabel}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">État</p>
                <p className="text-gray-900">{conditionLabel}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Taille</p>
                <p className="text-gray-900">{article.size}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Publié le</p>
                <p className="text-gray-900">{formattedDate}</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="mb-2 text-lg font-semibold text-gray-900">
                Description
              </h2>
              <p className="whitespace-pre-line text-gray-700">
                {article.description}
              </p>
            </div>

            <div className="mt-auto rounded-md bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-500">Vendeur</p>
              <p className="font-semibold text-gray-900">{article.userName}</p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
