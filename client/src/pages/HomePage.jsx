import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNews } from "../api/news.js";
import NewsCard from "../components/NewsCard.jsx";

function HomePage() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getNews("/featured")
      .then((data) => setArticles(data.items))
      .catch((requestError) => setError(requestError.message));
  }, []);

  return (
    <>
      <section className="mb-10 border-b border-stone-200 pb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-red-700">
          The latest
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          News that matters.
        </h1>
      </section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Latest News</h2>
        <Link className="text-sm font-medium text-red-700" to="/news">
          View all news
        </Link>
      </div>
      {error && <p role="alert" className="text-red-700">{error}</p>}
      {!error && articles.length === 0 && (
        <p className="text-slate-600">No published stories yet.</p>
      )}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <NewsCard key={article._id} article={article} />
        ))}
      </div>
    </>
  );
}

export default HomePage;
