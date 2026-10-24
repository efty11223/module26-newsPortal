import { Router } from "express";
import News from "../models/News.js";

const router = Router();

router.get("/featured", async (_req, res) => {
  const articles = await News.find({ status: "published" })
    .sort({ publishedAt: -1 })
    .limit(6)
    .populate("author", "fullName")
    .lean();

  res.json({ items: articles });
});

router.get("/", async (_req, res) => {
  const articles = await News.find({ status: "published" })
    .sort({ publishedAt: -1 })
    .populate("author", "fullName")
    .lean();

  res.json({ items: articles });
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
