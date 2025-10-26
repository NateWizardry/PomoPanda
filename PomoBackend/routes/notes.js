// routes/notes.js
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
 *     summary: Get all notes for a specific user
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of notes for the user
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
 *     summary: Create a new note for a specific user
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

  // ensure the user exists
  const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
  if (!user) return res.status(404).json({ error: "User not found" });

  const note = await prisma.note.create({
    data: { title, content, userId: parseInt(userId) },
  });
  res.status(201).json(note);
});

/**
 * @swagger
 * /api/notes/{userId}/{noteId}:
 *   delete:
 *     summary: Delete a note for a specific user
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the note owner
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the note to delete
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *       404:
 *         description: Note not found or does not belong to user
 */
router.delete("/:userId/:noteId", async (req, res) => {
  const { userId, noteId } = req.params;

  try {
    // verify note belongs to the user
    const note = await prisma.note.findUnique({ where: { id: parseInt(noteId) } });
    if (!note || note.userId !== parseInt(userId))
      return res.status(404).json({ error: "Note not found or does not belong to user" });

    await prisma.note.delete({ where: { id: parseInt(noteId) } });
    res.json({ message: "Note deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete note" });
  }
});

export default router;
