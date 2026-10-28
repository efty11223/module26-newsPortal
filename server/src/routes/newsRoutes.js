import { Router } from "express";
import News from "../models/News.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

function makeSlug(title, id) {
  const titleSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${titleSlug || "news"}-${id}`;
}

router.get("/my", requireAuth, async (req, res) => {
  res.json({
    items: await News.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .lean(),
  });
});

router.post("/", requireAuth, async (req, res) => {
  const body = req.body ?? {};

  if (
    typeof body.title !== "string" ||
    !body.title.trim() ||
    typeof body.excerpt !== "string" ||
    !body.excerpt.trim() ||
    typeof body.content !== "string" ||
    !body.content.trim() ||
    typeof body.category !== "string" ||
    !body.category.trim()
  ) {
    res
      .status(400)
      .json({ message: "Title, excerpt, content, and category are required." });
    return;
  }

  const article = new News({
    title: body.title.trim(),
    excerpt: body.excerpt.trim(),
    content: body.content.trim(),
    category: body.category.trim(),
    coverImageUrl:
      typeof body.coverImageUrl === "string" ? body.coverImageUrl.trim() : "",
    author: req.user._id,
    status: "published",
    publishedAt: new Date(),
  });
  article.slug = makeSlug(article.title, article.id);
  await article.save();
  res.status(201).json({ item: article });
});

router.put("/:id", requireAuth, async (req, res) => {
  const article = await News.findOne({
    _id: req.params.id,
    author: req.user._id,
  });
  if (!article) {
    res.status(404).json({ message: "Your article was not found." });
    return;
  }

  const body = req.body ?? {};

  if (
    typeof body.title !== "string" ||
    !body.title.trim() ||
    typeof body.excerpt !== "string" ||
    !body.excerpt.trim() ||
    typeof body.content !== "string" ||
    !body.content.trim() ||
    typeof body.category !== "string" ||
    !body.category.trim()
  ) {
    res
      .status(400)
      .json({ message: "Title, excerpt, content, and category are required." });
    return;
  }

  article.title = body.title.trim();
  article.excerpt = body.excerpt.trim();
  article.content = body.content.trim();
  article.category = body.category.trim();
  article.coverImageUrl =
    typeof body.coverImageUrl === "string"
      ? body.coverImageUrl.trim()
      : article.coverImageUrl;
  article.slug = makeSlug(article.title, article.id);
  await article.save();
  res.json({ item: article });
});

router.delete("/:id", requireAuth, async (req, res) => {
  const article = await News.findOneAndDelete({
    _id: req.params.id,
    author: req.user._id,
  });

  if (!article) {
    res.status(404).json({ message: "Your article was not found." });
    return;
  }

  res.json({ message: "Article deleted." });
});

router.get("/featured", async (_req, res) => {
  res.json({
    items: await News.find({ status: "published" })
      .sort({ publishedAt: -1 })
      .limit(6)
      .populate("author", "fullName")
      .lean(),
  });
});

router.get("/", async (_req, res) => {
  res.json({
    items: await News.find({ status: "published" })
      .sort({ publishedAt: -1 })
      .populate("author", "fullName")
      .lean(),
  });
});

router.get("/:slug", async (req, res) => {
  const article = await News.findOne({
    slug: req.params.slug,
    status: "published",
  })
    .populate("author", "fullName")
    .lean();

  if (!article) {
    res.status(404).json({ message: "Published article not found." });
    return;
  }

  res.json({ item: article });
});

export default router;
