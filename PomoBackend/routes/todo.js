// routes/todo.js
import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: Manage user to-do tasks
 */

/**
 * @swagger
 * /api/todo/{userId}:
 *   get:
 *     summary: Get all todo tasks for a specific user
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of todos for the user
 *       404:
 *         description: User not found
 */
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: { todo: true }, // ✅ FIXED: use 'todo' (singular)
    });

    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

/**
 * @swagger
 * /api/todo:
 *   post:
 *     summary: Create a new todo for a specific user
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - userId
 *             properties:
 *               text:
 *                 type: string
 *               category:
 *                 type: string
 *               done:
 *                 type: boolean
 *               userId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Todo created successfully
 *       400:
 *         description: Missing fields
 */
router.post("/", async (req, res) => {
  const { text, category, done, userId } = req.body;
  if (!text || !userId)
    return res.status(400).json({ error: "Missing fields" });

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    const todo = await prisma.todo.create({
      data: {
        text,
        category: category || "General",
        done: done || false,
        userId: parseInt(userId),
      },
    });
    res.status(201).json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create todo" });
  }
});

/**
 * @swagger
 * /api/todo/{id}:
 *   patch:
 *     summary: Update a todo's done status
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the todo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               done:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *       404:
 *         description: Todo not found
 */
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { done } = req.body;

  try {
    const todo = await prisma.todo.update({
      where: { id: parseInt(id) },
      data: { done },
    });
    res.json(todo);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: "Todo not found" });
  }
});

/**
 * @swagger
 * /api/todo/{id}:
 *   delete:
 *     summary: Delete a todo
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the todo
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 *       404:
 *         description: Todo not found
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.todo.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: "Todo not found" });
  }
});

export default router;
