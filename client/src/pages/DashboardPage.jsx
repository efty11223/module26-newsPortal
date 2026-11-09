import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { setUser } from "../features/auth/authSlice.js";

const emptyArticle = {
  title: "",
  excerpt: "",
  content: "",
  category: "",
  coverImageUrl: "",
};

async function request(path, token, options = {}) {
  const response = await fetch(`/api/${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

function DashboardPage() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [articles, setArticles] = useState([]);
  const [profile, setProfile] = useState(() => ({
    fullName: user?.fullName || "",
    bio: user?.bio || "",
  }));
  const [articleForm, setArticleForm] = useState(emptyArticle);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !token) return;
    request("news/my", token)
      .then((data) => setArticles(data.items))
      .catch((requestError) => setError(requestError.message));
  }, [user, token]);

  if (!user || !token) return <Navigate to="/login" replace />;

  async function saveProfile(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      const data = await request("auth/me", token, {
        method: "PUT",
        body: JSON.stringify(profile),
      });
      dispatch(setUser(data.user));
      setProfile({ fullName: data.user.fullName, bio: data.user.bio || "" });
      setMessage("Profile updated.");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function saveArticle(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      await request(editingId ? `news/${editingId}` : "news", token, {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(articleForm),
      });
      setArticleForm(emptyArticle);
      setEditingId(null);
      const data = await request("news/my", token);
      setArticles(data.items);
      setMessage(editingId ? "Article updated." : "Article published.");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function deleteArticle(id) {
    setError("");
    setMessage("");
    try {
      await request(`news/${id}`, token, { method: "DELETE" });
      const data = await request("news/my", token);
      setArticles(data.items);
      setMessage("Article deleted.");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function editArticle(article) {
    setEditingId(article._id);
    setArticleForm({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      coverImageUrl: article.coverImageUrl || "",
    });
  }

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Your Dashboard</h1>
      {message && <p className="text-green-700">{message}</p>}
      {error && <p role="alert" className="text-red-700">{error}</p>}

      <section className="max-w-xl rounded-lg border border-stone-200 bg-white p-6">
        <h2 className="text-xl font-semibold">Profile</h2>
        <form className="mt-4 space-y-4" onSubmit={saveProfile}>
          <label className="block text-sm font-medium">
            Name
            <input
              className="mt-1 w-full rounded border border-stone-300 px-3 py-2"
              required
              value={profile.fullName}
              onChange={(event) => setProfile({ ...profile, fullName: event.target.value })}
            />
          </label>
          <label className="block text-sm font-medium">
            Bio
            <textarea
              className="mt-1 w-full rounded border border-stone-300 px-3 py-2"
              rows="3"
              value={profile.bio}
              onChange={(event) => setProfile({ ...profile, bio: event.target.value })}
            />
          </label>
          <button className="rounded bg-slate-800 px-4 py-2 text-white" type="submit">
            Save profile
          </button>
        </form>
      </section>

      <section className="max-w-xl rounded-lg border border-stone-200 bg-white p-6">
        <h2 className="text-xl font-semibold">{editingId ? "Edit Article" : "Publish News"}</h2>
        <form className="mt-4 space-y-4" onSubmit={saveArticle}>
          {[
            ["title", "Title"],
            ["excerpt", "Short description"],
            ["category", "Category"],
            ["coverImageUrl", "Cover image URL"],
          ].map(([field, label]) => (
            <label className="block text-sm font-medium" key={field}>
              {label}
              <input
                className="mt-1 w-full rounded border border-stone-300 px-3 py-2"
                required={field !== "coverImageUrl"}
                value={articleForm[field]}
                onChange={(event) =>
                  setArticleForm({ ...articleForm, [field]: event.target.value })
                }
              />
            </label>
          ))}
          <label className="block text-sm font-medium">
            Article
            <textarea
              className="mt-1 w-full rounded border border-stone-300 px-3 py-2"
              rows="6"
              required
              value={articleForm.content}
              onChange={(event) =>
                setArticleForm({ ...articleForm, content: event.target.value })
              }
            />
          </label>
          <div className="flex gap-3">
            <button className="rounded bg-red-700 px-4 py-2 text-white" type="submit">
              {editingId ? "Save changes" : "Publish"}
            </button>
            {editingId && (
              <button
                className="rounded border border-stone-300 px-4 py-2"
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setArticleForm(emptyArticle);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Your Articles</h2>
        {articles.length === 0 ? (
          <p className="text-slate-600">You haven’t published any articles yet.</p>
        ) : (
          <ul className="divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white">
            {articles.map((article) => (
              <li className="flex flex-wrap items-center justify-between gap-3 p-4" key={article._id}>
                <span className="font-medium">{article.title}</span>
                <div className="flex gap-3">
                  <button
                    className="text-sm font-medium text-red-700"
                    onClick={() => editArticle(article)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-sm text-slate-600"
                    onClick={() => deleteArticle(article._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default DashboardPage;
