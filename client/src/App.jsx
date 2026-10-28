import { Link, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import NewsPage from "./pages/NewsPage.jsx";
import NewsDetailPage from "./pages/NewsDetailPage.jsx";

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-slate-900">
      <header className="border-b border-stone-200 bg-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link className="text-xl font-bold tracking-tight" to="/">
            The Daily Brief
          </Link>
          <Link className="text-sm font-medium text-slate-600 hover:text-red-700" to="/news">
            All News
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:slug" element={<NewsDetailPage />} />
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>

      <footer className="border-t border-stone-200 bg-white px-6 py-6 text-center text-sm text-slate-500">
        The Daily Brief
      </footer>
    </div>
  );
}

export default App;
