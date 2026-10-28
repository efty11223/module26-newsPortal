import { Link } from "react-router-dom";

function NewsCard({ article }) {
  return (
    <article className="overflow-hidden rounded-lg border border-stone-200 bg-white">
      {article.coverImageUrl && (
        <img
          className="h-48 w-full object-cover"
          src={article.coverImageUrl}
          alt=""
        />
      )}
      <div className="p-5">
        <p className="text-sm font-medium text-red-700">{article.category}</p>
        <h2 className="mt-2 text-xl font-semibold">
          <Link className="hover:text-red-700" to={`/news/${article.slug}`}>
            {article.title}
          </Link>
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">{article.excerpt}</p>
        <p className="mt-4 text-xs text-slate-500">
          {article.author?.fullName || "The Daily Brief"}
        </p>
      </div>
    </article>
  );
}

export default NewsCard;
