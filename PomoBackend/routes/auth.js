import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and management
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Missing or duplicate fields
 */
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: "Missing fields" });

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (existing)
    return res.status(400).json({ error: "Email or username already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { username, email, password: hashedPassword },
  });

  res.status(201).json({
    id: user.id,
    username: user.username,
    email: user.email,
  });
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    return res.status(400).json({ error: "Invalid email or password" });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(400).json({ error: "Invalid email or password" });

  res.json({
    message: "Login successful",
    id: user.id,
    username: user.username,
    email: user.email,
  });
});

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Get all registered users
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/users", async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, username: true, email: true },
  });
  res.json(users);
});

export default router;
