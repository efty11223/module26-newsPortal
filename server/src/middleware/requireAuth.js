import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : null;

  if (!token) {
    res.status(401).json({ message: "Please log in to continue." });
    return;
  }

  if (!process.env.JWT_SECRET) {
    res.status(500).json({ message: "JWT_SECRET is not configured." });
    return;
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    res.status(401).json({ message: "Your login has expired. Please log in again." });
    return;
  }

  const user = await User.findById(payload.sub).select("-passwordHash");

  if (!user) {
    res.status(401).json({ message: "This account is no longer available." });
    return;
  }

  req.user = user;
  next();
}
