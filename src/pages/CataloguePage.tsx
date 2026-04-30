import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../services/api";
import {
  CATEGORIES,
  CONDITIONS,
  type Article,
} from "../types/article";
import { SearchBar } from "../components/SearchBar";
import ArticleCard from "../components/ArticleCard";

export default function CataloguePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sort, setSort] = useState("date_desc");

  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (category) params.set("category", category);
  if (condition) params.set("condition", condition);
  if (priceMin) params.set("priceMin", priceMin);
  if (priceMax) params.set("priceMax", priceMax);
  if (sort) params.set("sort", sort);
  const queryString = params.toString();

  const { isPending, error, data } = useQuery<Article[]>({
    queryKey: ["articles", { search, category, condition, priceMin, priceMax, sort }],
    queryFn: () =>
      api.get<Article[]>(
        `/api/articles${queryString ? `?${queryString}` : ""}`,
      ),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Catalogue</h1>

      <div className="bg-white p-4 rounded-lg shadow mb-6 space-y-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Rechercher un article..."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">Toutes les catégories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>

          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">Tous les états</option>
            {CONDITIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="0"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            placeholder="Prix min"
            className="border rounded px-2 py-1"
          />

          <input
            type="number"
            min="0"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            placeholder="Prix max"
            className="border rounded px-2 py-1"
          />
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="date_desc">Plus récent</option>
          <option value="price_asc">Prix croissant</option>
          <option value="price_desc">Prix décroissant</option>
        </select>
      </div>

      {isPending && <p>Chargement...</p>}

      {error instanceof Error && (
        <p className="text-red-600">Erreur : {error.message}</p>
      )}

      {data && data.length === 0 && (
        <p className="text-gray-600">Aucun article ne correspond aux filtres.</p>
      )}

      {data && data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
