import { z } from "zod";

const NoteSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  content: z.string().optional(),
  userId: z.number(),
});

export const notesPaths = [
  {
    method: "get",
    path: "/api/notes/{userId}",
    config: {
      summary: "Get all notes for a user",
      parameters: [
        { name: "userId", in: "path", required: true, schema: { type: "integer" } },
      ],
      responses: {
        200: {
          description: "User notes",
          content: { "application/json": { schema: z.array(NoteSchema) } },
        },
      },
    },
  },
  {
    method: "post",
    path: "/api/notes",
    config: {
      summary: "Create a new note for a user",
      requestBody: {
        content: { "application/json": { schema: NoteSchema } },
      },
      responses: {
        201: {
          description: "Note created",
          content: { "application/json": { schema: NoteSchema } },
        },
      },
    },
  },
  {
    method: "delete",
    path: "/api/notes/{id}",
    config: {
      summary: "Delete a note by ID",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "integer" } },
      ],
      responses: { 200: { description: "Note deleted" } },
    },
  },
];
