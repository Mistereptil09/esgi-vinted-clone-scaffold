import { useQuery } from "@tanstack/react-query";
import type { Article } from "../types/article";
import { SearchBar } from "../components/SearchBar";
import { useState } from "react";

export default function CataloguePage() {
  const [searchValue, setSearchValue] = useState("");

  const { isPending, error, data } = useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: async () => {
      const res = await fetch("/api/articles");

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Failed to fetch articles");
      }

      return res.json();
    },
  });

  if (isPending) {
    return <h1>Loading</h1>;
  }

  if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.name}</p>
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
      <SearchBar
        value={searchValue}
        onChange={setSearchValue}
        placeholder="Search from description or title"
      />

      <ul>
        {filteredArticles.map((article: Article) => (
          <li key={article.id}>
            <h2>{article.title}</h2>
            <p>{article.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
