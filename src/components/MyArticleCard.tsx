import { Link } from "react-router-dom";
import type { Article } from "../types/article";
import { CONDITIONS } from "../types/article";

interface MyArticleCardProps {
  article: Article;
  onDelete: (id: string) => void;
}

export function MyArticleCard({ article, onDelete }: MyArticleCardProps) {
  const handleDelete = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
      onDelete(article.id);
    }
  };

  const conditionLabel =
    CONDITIONS.find((c) => c.value === article.condition)?.label ||
    article.condition;

  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm flex flex-col sm:flex-row">
      <img
        src={article.imageUrl}
        alt={article.title}
        className="w-full sm:w-48 h-48 object-cover"
      />
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900">{article.title}</h3>
            <span className="text-xl font-bold text-teal-600">
              {article.price.toFixed(2)} €
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{article.size} • {conditionLabel}</p>
          <p className="text-gray-700 mt-2 line-clamp-2 text-sm">{article.description}</p>
        </div>
        <div className="mt-4 flex gap-3 justify-end">
          <Link
            to={`/articles/${article.id}/edit`}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200"
          >
            Modifier
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-md hover:bg-red-100"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
