import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   name: Todo
 *   description: Manage user to-do tasks
 */

/**
 * @swagger
 * /api/todo/{userId}:
 *   get:
 *     summary: Get all tasks for a specific user
 *     tags: [Todo]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of tasks for the user
 *       404:
 *         description: User not found
 */
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
    include: { todo: true },
  });
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json(user.todo);
});

/**
 * @swagger
 * /api/todo:
 *   post:
 *     summary: Create a new task for a specific user
 *     tags: [Todo]
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
 *               userId:
 *                 type: integer
 *               category:
 *                 type: string
 *               done:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Missing fields
 */
router.post("/", async (req, res) => {
  const { text, userId, category = "General", done = false } = req.body;

  if (!text || !userId)
    return res.status(400).json({ error: "Missing required fields" });

  const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
  if (!user) return res.status(404).json({ error: "User not found" });

  const task = await prisma.todo.create({
    data: { text, userId: parseInt(userId), category, done },
  });

  res.status(201).json(task);
});

/**
 * @swagger
 * /api/todo/{userId}/{taskId}:
 *   delete:
 *     summary: Delete a task for a specific user
 *     tags: [Todo]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the task owner
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the task to delete
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found or does not belong to user
 */
router.delete("/:userId/:taskId", async (req, res) => {
  const { userId, taskId } = req.params;

  try {
    const task = await prisma.todo.findUnique({ where: { id: parseInt(taskId) } });
    if (!task || task.userId !== parseInt(userId))
      return res.status(404).json({ error: "Task not found or does not belong to user" });

    await prisma.todo.delete({ where: { id: parseInt(taskId) } });
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

export default router;
