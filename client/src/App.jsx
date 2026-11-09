import { Link, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import HomePage from "./pages/HomePage.jsx";
import NewsPage from "./pages/NewsPage.jsx";
import NewsDetailPage from "./pages/NewsDetailPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import { clearUser } from "./features/auth/authSlice.js";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-slate-900">
      <header className="border-b border-stone-200 bg-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link className="text-xl font-bold tracking-tight" to="/">
            The Daily Brief
          </Link>
          <div className="flex items-center gap-5">
            <Link className="text-sm font-medium text-slate-600 hover:text-red-700" to="/news">
              All News
            </Link>
            <Link className="text-sm font-medium text-slate-600 hover:text-red-700" to="/contact">
              Contact
            </Link>
            {user ? (
              <>
                <Link className="text-sm font-medium text-slate-600" to="/dashboard">
                  Dashboard
                </Link>
                <span className="hidden text-sm text-slate-600 sm:inline">{user.fullName}</span>
                <button
                  className="text-sm font-medium text-red-700"
                  onClick={() => dispatch(clearUser())}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link className="text-sm font-medium text-slate-600" to="/login">
                  Log in
                </Link>
                <Link className="text-sm font-medium text-red-700" to="/register">
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:slug" element={<NewsDetailPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage register />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/contact" element={<ContactPage />} />
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
