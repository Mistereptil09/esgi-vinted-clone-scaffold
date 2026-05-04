import type { Article} from "../types/article.ts";
import { CONDITIONS, CATEGORIES} from "../types/article.ts";
import { FavoriteButton} from "./FavoriteButton.tsx";

type ArticleDetailViewProps = { article: Article };

export function ArticleDetailView({ article}: ArticleDetailViewProps) {
  const categoryLabel = CATEGORIES.find(c => c.id === article.category)?.label || article.category;
  const conditionLabel = CONDITIONS.find(c => c.value === article.condition)?.label || article.condition;
  const formattedPrice = article.price.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR"
  });
  const formattedDate =new Date(article.createdAt).toLocaleDateString("fr-FR");
  
  return (
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

            <p className="text-2xl font-bold text-teal-600">{formattedPrice}</p>

            <div className="mt-4">
              <FavoriteButton articleId={article.id} />
            </div>
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
  );
}