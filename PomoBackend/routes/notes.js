import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Manage user notes
 */

/**
 * @swagger
 * /api/notes/{userId}:
 *   get:
 *     summary: Get all notes for a user
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of notes
 *       404:
 *         description: User not found
 */
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
    include: { notes: true },
  });

  if (!user) return res.status(404).json({ error: "User not found" });

  res.json(user.notes);
});

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - userId
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               userId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Note created successfully
 *       400:
 *         description: Missing fields
 */
router.post("/", async (req, res) => {
  const { title, content, userId } = req.body;
  if (!title || !content || !userId)
    return res.status(400).json({ error: "Missing fields" });

  const note = await prisma.note.create({
    data: {
      title,
      content,
      userId: parseInt(userId),
    },
  });

  res.status(201).json(note);
});

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Note deleted
 *       404:
 *         description: Note not found
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.note.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(404).json({ error: "Note not found" });
  }
});

export default router;
