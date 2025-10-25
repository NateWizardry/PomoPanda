import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import authRoutes from "./routes/auth.js";
import notesRoutes from "./routes/notes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PomoPanda API",
      version: "1.0.0",
      description: "API documentation for PomoPanda backend",
    },
    servers: [{ url: "http://localhost:5000" }],
  },
  apis: ["./routes/*.js"], // read JSDoc comments in routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

app.get("/", (req, res) => res.send("PomoPanda API Running"));

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
