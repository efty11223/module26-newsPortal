import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getNews } from "../api/news.js";

function NewsDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getNews(`/${encodeURIComponent(slug)}`)
      .then((data) => setArticle(data.item))
      .catch((requestError) => setError(requestError.message));
  }, [slug]);

  if (error)
    return (
      <p role="alert" className="text-red-700">
        {error}
      </p>
    );
  if (!article) return <p className="text-slate-600">Loading story...</p>;

  return (
    <article className="mx-auto max-w-3xl">
      <Link className="text-sm font-medium text-red-700" to="/news">
        All News
      </Link>
      <p className="mt-8 text-sm font-medium text-red-700">
        {article.category}
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
        {article.title}
      </h1>
      <p className="mt-4 text-slate-500">
        By {article.author?.fullName || "The Daily Brief"}
      </p>
      {article.coverImageUrl && (
        <img
          className="mt-8 max-h-[28rem] w-full rounded-lg object-contain"
          src={article.coverImageUrl}
          alt=""
        />
      )}
      <p className="mt-8 whitespace-pre-wrap text-lg leading-8 text-slate-700">
        {article.content}
      </p>
    </article>
  );
}

export default NewsDetailPage;
