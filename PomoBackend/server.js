import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PomoPanda Notes API",
      version: "1.0.0",
      description: "API documentation for Notes endpoints",
    },
    servers: [
      { url: "http://localhost:5000" }
    ],
  },
  apis: ["./server.js"], // or "./routes/*.js" if you split routes later
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);


const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Get all notes
 *     responses:
 *       200:
 *         description: List of all notes
 */
app.get("/api/notes", async (req, res) => {
  const notes = await prisma.note.findMany({ orderBy: { createdAt: "desc" } });
  res.json(notes);
});

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a new note
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Note created successfully
 */
app.post("/api/notes", async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ error: "Missing fields" });
  const note = await prisma.note.create({ data: { title, content } });
  res.status(201).json(note);
});


// ✅ DELETE a note
app.delete("/api/notes/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await prisma.note.delete({ where: { id } });
  res.json({ message: "Note deleted" });
});

// ✅ Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
