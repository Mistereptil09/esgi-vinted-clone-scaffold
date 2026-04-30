import { useQuery } from "@tanstack/react-query";
import type { Article } from "../types/article";
import { SearchBar } from "../components/SearchBar";
import { useState } from "react";
import { api } from "../services/api";
import { ArticleCard } from "../components/ArticleCard";

export default function CataloguePage() {
  const [searchValue, setSearchValue] = useState("");

  const { isPending, error, data } = useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: () => api.get<Article[]>("/api/articles"),
  });

  if (isPending) {
    return <div className="text-center py-10">Chargement...</div>;
  }

  if (error instanceof Error) {
    return (
      <div className="text-center py-10 text-red-600">
        <h1 className="text-xl font-bold">Erreur</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  const filteredArticles = (data ?? []).filter((item: Article) => {
    const search = searchValue.toLowerCase();

    return (
      item.title.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search)
    );
  });

  return (
    <div>
      <div className="mb-6 max-w-md mx-auto">
        <SearchBar
          value={searchValue}
          onChange={setSearchValue}
          placeholder="Rechercher un article..."
        />
      </div>

      {filteredArticles.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          Aucun article ne correspond à votre recherche.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredArticles.map((article: Article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
