import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { authenticate } from "../api/auth.js";
import { setCredentials } from "../features/auth/authSlice.js";

function AuthPage({ register = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const credentials = register
        ? form
        : { email: form.email, password: form.password };
      const data = await authenticate(register ? "register" : "login", credentials);
      dispatch(setCredentials(data));
      navigate("/");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-md rounded-lg border border-stone-200 bg-white p-8">
      <h1 className="text-3xl font-bold">{register ? "Create an account" : "Log in"}</h1>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        {register && (
          <label className="block text-sm font-medium">
            Full name
            <input
              className="mt-1 w-full rounded border border-stone-300 px-3 py-2"
              required
              value={form.fullName}
              onChange={(event) => setForm({ ...form, fullName: event.target.value })}
            />
          </label>
        )}
        <label className="block text-sm font-medium">
          Email
          <input
            className="mt-1 w-full rounded border border-stone-300 px-3 py-2"
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input
            className="mt-1 w-full rounded border border-stone-300 px-3 py-2"
            type="password"
            minLength={register ? 6 : undefined}
            required
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
        </label>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <button
          className="w-full rounded bg-red-700 px-4 py-2 font-semibold text-white hover:bg-red-800 disabled:opacity-60"
          disabled={loading}
          type="submit"
        >
          {loading ? "Please wait..." : register ? "Register" : "Log in"}
        </button>
      </form>
      <p className="mt-5 text-sm text-slate-600">
        {register ? "Already registered?" : "Need an account?"}{" "}
        <Link className="font-medium text-red-700" to={register ? "/login" : "/register"}>
          {register ? "Log in" : "Register"}
        </Link>
      </p>
    </section>
  );
}

export default AuthPage;
