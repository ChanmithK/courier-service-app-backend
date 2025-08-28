import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User.js";

const userModel = new UserModel();

// Register new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      email,
      password,
      company_name,
      contact_name,
      address,
      phone_number,
      is_admin,
    } = req.body;

    // Validate required fields
    if (!email || !password || !contact_name || !address) {
      res.status(400).json({ message: "Required fields are missing" });
      return;
    }

    // Password length check
    if (password.length < 8) {
      res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
      return;
    }

    // Check if user already exists
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await userModel.create({
      email,
      password: hashedPassword,
      company_name,
      contact_name,
      address,
      phone_number,
      is_admin: Boolean(is_admin),
    });

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not configured");
    }

    // Generate JWT token (1 day expiry)
    const token = jwt.sign(
      { id: user.id, email: user.email, is_admin: user.is_admin },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        company_name: user.company_name,
        contact_name: user.contact_name,
        is_admin: user.is_admin,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login existing user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    // Find user by email
    const user = await userModel.findByEmail(email);
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Generate JWT token (1 day expiry)
    const token = jwt.sign(
      { id: user.id, email: user.email, is_admin: user.is_admin },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        company_name: user.company_name,
        contact_name: user.contact_name,
        is_admin: user.is_admin,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
