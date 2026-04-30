import { Link } from "react-router-dom";
import type { Article } from "../types/article";
import { CATEGORIES, CONDITIONS } from "../types/article";

type Props = {
  article: Article;
};

function formatPrice(price: number): string {
  return price.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}

export default function ArticleCard({ article }: Props) {
  const category = CATEGORIES.find((c) => c.id === article.category);
  const condition = CONDITIONS.find((c) => c.value === article.condition);

  return (
    <Link
      to={`/articles/${article.id}`}
      className="block bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden"
    >
      <img
        src={article.imageUrl}
        alt={article.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-3">
        <h3 className="font-semibold truncate">{article.title}</h3>
        <p className="text-teal-700 font-bold mt-1">
          {formatPrice(article.price)}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          {category?.label ?? article.category} ·{" "}
          {condition?.label ?? article.condition}
        </p>
        <p className="text-xs text-gray-500 mt-2">par {article.userName}</p>
      </div>
    </Link>
  );
}
