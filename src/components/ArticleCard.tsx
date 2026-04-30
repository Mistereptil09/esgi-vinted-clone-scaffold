import { Link } from "react-router-dom";
import type { Article } from "../types/article";
import { CONDITIONS, CATEGORIES } from "../types/article";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const conditionLabel =
    CONDITIONS.find((c) => c.value === article.condition)?.label ||
    article.condition;

  const categoryLabel =
    CATEGORIES.find((c) => c.id === article.category)?.label ||
    article.category;

  return (
    <Link to={`/articles/${article.id}`} className="block group">
      <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
        />
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-1 flex-1 pr-2">{article.title}</h3>
          </div>
          <p className="text-lg font-bold text-teal-600 mb-2">{article.price.toFixed(2)} €</p>
          <div className="text-xs text-gray-500 mt-auto pt-2 border-t">
            <p>{categoryLabel}</p>
            <p>{article.size} • {conditionLabel}</p>
            <p className="mt-1 truncate font-medium">Par {article.userName}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
