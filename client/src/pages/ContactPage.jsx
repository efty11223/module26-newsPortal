import { useState } from "react";

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  }

  return (
    <section className="mx-auto max-w-xl rounded-lg border border-stone-200 bg-white p-8">
      <h1 className="text-3xl font-bold">Contact Us</h1>
      <p className="mt-3 text-slate-600">
        Have a question? Send a message to the Daily Brief team.
      </p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium">
          Name
          <input
            className="mt-1 w-full rounded border border-stone-300 px-3 py-2"
            name="name"
            required
          />
        </label>
        <label className="block text-sm font-medium">
          Email
          <input
            className="mt-1 w-full rounded border border-stone-300 px-3 py-2"
            name="email"
            type="email"
            required
          />
        </label>
        <label className="block text-sm font-medium">
          Message
          <textarea
            className="mt-1 w-full rounded border border-stone-300 px-3 py-2"
            name="message"
            rows="5"
            required
          />
        </label>
        <button className="rounded bg-red-700 px-4 py-2 font-semibold text-white" type="submit">
          Send Message
        </button>
      </form>
      {submitted && (
        <p className="mt-4 text-sm text-slate-600" role="status">
          The contact form is for display only and is not connected to message delivery.
        </p>
      )}
    </section>
  );
}

export default ContactPage;
