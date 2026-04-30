import { useForm } from "react-hook-form";
import { CATEGORIES, CONDITIONS, type ArticleFormData } from "../types/article";

interface ArticleFormProps {
  defaultValues?: Partial<ArticleFormData>;
  onSubmit: (data: ArticleFormData) => void;
  isLoading?: boolean;
  submitLabel: string;
}

export function ArticleForm({ defaultValues, onSubmit, isLoading, submitLabel }: ArticleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ArticleFormData>({
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      price: defaultValues?.price ?? 0,
      category: defaultValues?.category ?? "",
      size: defaultValues?.size ?? "",
      condition: defaultValues?.condition ?? "",
      imageUrl: defaultValues?.imageUrl ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl mx-auto bg-white p-6 rounded shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700">Titre</label>
        <input
          type="text"
          {...register("title", {
            required: "Le titre est requis",
            minLength: { value: 3, message: "Le titre doit faire au moins 3 caractères" },
            maxLength: { value: 100, message: "Le titre ne doit pas dépasser 100 caractères" },
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 border p-2"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register("description", {
            required: "La description est requise",
            minLength: { value: 10, message: "La description doit faire au moins 10 caractères" },
            maxLength: { value: 1000, message: "La description ne doit pas dépasser 1000 caractères" },
          })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 border p-2"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Prix (€)</label>
        <input
          type="number"
          step="0.01"
          {...register("price", {
            required: "Le prix est requis",
            valueAsNumber: true,
            min: { value: 0.01, message: "Le prix doit être supérieur à 0" },
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 border p-2"
        />
        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Catégorie</label>
        <select
          {...register("category", { required: "Veuillez sélectionner une catégorie" })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 border p-2"
        >
          <option value="">Sélectionnez une catégorie</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Taille</label>
        <input
          type="text"
          {...register("size", { required: "La taille est requise" })}
          placeholder="ex: M, 38, Unique"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 border p-2"
        />
        {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">État</label>
        <select
          {...register("condition", { required: "Veuillez sélectionner un état" })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 border p-2"
        >
          <option value="">Sélectionnez un état</option>
          {CONDITIONS.map((cond) => (
            <option key={cond.value} value={cond.value}>
              {cond.label}
            </option>
          ))}
        </select>
        {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">URL de l'image</label>
        <input
          type="url"
          {...register("imageUrl", {
            required: "L'URL de l'image est requise",
            pattern: {
              value: /^https?:\/\/.+/,
              message: "Veuillez entrer une URL d'image valide",
            },
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 border p-2"
        />
        {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
        >
          {isLoading ? "Chargement..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
