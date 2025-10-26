// routes/timetable.js
import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   name: Timetable
 *   description: Manage user timetable events
 */

/**
 * @swagger
 * /api/timetable/{userId}:
 *   get:
 *     summary: Get all timetable events for a specific user
 *     tags: [Timetable]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of timetable events
 *       404:
 *         description: User not found
 */
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
    include: { timetable: true },
  });
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json(user.timetable);
});

/**
 * @swagger
 * /api/timetable:
 *   post:
 *     summary: Create a new timetable event for a user
 *     tags: [Timetable]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - day
 *               - hour
 *               - subject
 *               - color
 *               - userId
 *             properties:
 *               title:
 *                 type: string
 *               day:
 *                 type: string
 *               hour:
 *                 type: string
 *               subject:
 *                 type: string
 *               color:
 *                 type: string
 *               userId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Timetable event created successfully
 *       400:
 *         description: Missing fields
 */
router.post("/", async (req, res) => {
  const { title, day, hour, subject, color, userId } = req.body;
  if (!title || !day || !hour || !subject || !color || !userId)
    return res.status(400).json({ error: "Missing fields" });

  const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
  if (!user) return res.status(404).json({ error: "User not found" });

  const event = await prisma.timetableEvent.create({
    data: { title, day, hour, subject, color, userId: parseInt(userId) },
  });
  res.status(201).json(event);
});

/**
 * @swagger
 * /api/timetable/{userId}/{eventId}:
 *   delete:
 *     summary: Delete a timetable event for a specific user
 *     tags: [Timetable]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found or does not belong to user
 */
router.delete("/:userId/:eventId", async (req, res) => {
  const { userId, eventId } = req.params;

  try {
    const event = await prisma.timetableEvent.findUnique({ where: { id: parseInt(eventId) } });
    if (!event || event.userId !== parseInt(userId))
      return res.status(404).json({ error: "Event not found or does not belong to user" });

    await prisma.timetableEvent.delete({ where: { id: parseInt(eventId) } });
    res.json({ message: "Event deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

export default router;
