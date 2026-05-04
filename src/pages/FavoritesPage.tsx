import { useQuery } from "@tanstack/react-query";
import type { Article } from "../types/article";
import { api } from "../services/api";
import { Link} from "react-router-dom";
import { ArticleCard } from "../components/ArticleCard";

export default function FavoritesPage() {
  const { data: favorites, isPending, isError } = useQuery<Article[]>({
    queryKey: ["favorites"],
    queryFn: () => api.get<Article[]>("/api/favorites"),
  });

  if (isPending) {
    return <div className="text-center py-10">Chargement de vos favoris...</div>;
  }
  if (isError) {
    return (
      <div className="text-center py-10 text-red-600">
        Une erreur est survenue lors du chargement.
      </div>
    );
  }

  const isEmpty = !favorites || favorites.length === 0;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Mes favoris</h1>

        <Link
          to="/"
          className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          Voir le catalogue
        </Link>
      </div>

      {isEmpty ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white py-16 text-center">
          <p className="mb-4 text-gray-500">
            Vous n'avez pas encore ajouté d'articles en favoris.
          </p>
          <Link
            to="/"
            className="font-medium text-teal-600 underline hover:text-teal-700"
          >
            Parcourir le catalogue
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {favorites.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
