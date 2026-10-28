import { useEffect, useState } from "react";
import { getNews } from "../api/news.js";
import NewsCard from "../components/NewsCard.jsx";

function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getNews()
      .then((data) => setArticles(data.items))
      .catch((requestError) => setError(requestError.message));
  }, []);

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold">All News</h1>
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

export default NewsPage;
