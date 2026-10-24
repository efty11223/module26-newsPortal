import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

function publicUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    bio: user.bio,
  };
}

function createToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return jwt.sign({}, process.env.JWT_SECRET, {
    subject: user.id,
    expiresIn: "7d",
  });
}

router.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body ?? {};

  if (
    typeof fullName !== "string" ||
    !fullName.trim() ||
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    password.length < 6
  ) {
    res.status(400).json({
      message: "Name, email, and a password of at least 6 characters are required.",
    });
    return;
  }

  if (!process.env.JWT_SECRET) {
    res.status(500).json({ message: "JWT_SECRET is not configured." });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    res.status(409).json({ message: "An account with this email already exists." });
    return;
  }

  const user = await User.create({
    fullName: fullName.trim(),
    email: normalizedEmail,
    passwordHash: await bcrypt.hash(password, 10),
  });

  res.status(201).json({ user: publicUser(user), token: createToken(user) });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};

  if (typeof email !== "string" || !email.trim() || typeof password !== "string") {
    res.status(400).json({ message: "Email and password are required." });
    return;
  }

  if (!process.env.JWT_SECRET) {
    res.status(500).json({ message: "JWT_SECRET is not configured." });
    return;
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() })
    .select("+passwordHash");

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    res.status(401).json({ message: "Email or password is incorrect." });
    return;
  }

  res.json({ user: publicUser(user), token: createToken(user) });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

export default router;
