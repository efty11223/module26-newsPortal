import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNews } from "../api/news.js";
import NewsCard from "../components/NewsCard.jsx";

function HomePage() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getNews()
      .then((data) => setArticles(data.items))
      .catch((requestError) => setError(requestError.message));
  }, []);

  const featured = articles.slice(0, 6);
  const moreStories = articles.slice(6, 10);
  const categories = [
    ...new Set(articles.map((article) => article.category)),
  ].slice(0, 4);

  return (
    <div className="space-y-14">
      <section className="rounded-lg px-8 py-14 text-white sm:px-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-red-900">
          The Daily Brief
        </p>
        <h1 className="mt-3 text-4xl text-slate-900 font-bold tracking-tight sm:text-5xl">
          News that matters.
        </h1>
        <p className="mt-4 max-w-xl text-slate-500">
          Read the latest stories and perspectives from our community.
        </p>
        <Link
          className="mt-6 inline-block rounded text-white  px-4 py-2 font-semibold bg-red-900"
          to="/news"
        >
          Browse all news
        </Link>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Top Stories</h2>
          <Link className="text-sm font-medium text-red-700" to="/news">
            View all
          </Link>
        </div>
        {error && (
          <p role="alert" className="text-red-700">
            {error}
          </p>
        )}
        {!error && articles.length === 0 && (
          <p className="text-slate-600">No published stories yet.</p>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((article) => (
            <NewsCard key={article._id} article={article} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-5 text-2xl font-semibold">More Headlines</h2>
        {moreStories.length > 0 ? (
          <ul className="divide-y divide-stone-200 border-y border-stone-200">
            {moreStories.map((article) => (
              <li className="py-4" key={article._id}>
                <span className="mr-3 text-sm text-red-700">
                  {article.category}
                </span>
                <Link
                  className="font-medium hover:text-red-700"
                  to={`/news/${article.slug}`}
                >
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-600">
            More headlines will appear here as stories are published.
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-5 text-2xl font-semibold">Browse Categories</h2>
        {categories.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <span
                className="rounded-full border border-stone-300 bg-white px-4 py-2"
                key={category}
              >
                {category}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-slate-600">
            Categories will appear when stories are published.
          </p>
        )}
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-8">
        <h2 className="text-2xl font-semibold">About The Daily Brief</h2>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          A place to share news and stories from our community. Have a question
          or feedback? We’d be glad to hear from you.
        </p>
        <Link
          className="mt-4 inline-block font-medium text-red-700"
          to="/contact"
        >
          Contact us
        </Link>
      </section>
    </div>
  );
}

export default HomePage;
