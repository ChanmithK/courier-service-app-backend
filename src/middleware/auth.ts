import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { AuthRequest } from "../types/index.js";

// Middleware to authenticate JWT token
export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  // Get token from Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // If no token, return 401
  if (!token) {
    res.status(401).json({ message: "Access token required" });
    return;
  }

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      res.status(403).json({ message: "Invalid or expired token" });
      return;
    }

    // Attach user info to request object
    req.user = user as { id: number; email: string; is_admin: boolean };
    next();
  });
};
