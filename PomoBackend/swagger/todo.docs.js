import { z } from "zod";

const TodoSchema = z.object({
  id: z.number().optional(),
  text: z.string(),
  done: z.boolean().optional(),
  category: z.string().optional(),
  userId: z.number(),
});

export const todoPaths = [
  {
    method: "get",
    path: "/api/todo/{userId}",
    config: {
      summary: "Get all tasks for a user",
      parameters: [{ name: "userId", in: "path", required: true, schema: { type: "integer" } }],
      responses: { 200: { description: "User tasks", content: { "application/json": { schema: z.array(TodoSchema) } } } },
    },
  },
  {
    method: "post",
    path: "/api/todo",
    config: {
      summary: "Create a new task",
      requestBody: { content: { "application/json": { schema: TodoSchema } } },
      responses: { 201: { description: "Task created", content: { "application/json": { schema: TodoSchema } } } },
    },
  },
  {
    method: "delete",
    path: "/api/todo/{id}",
    config: {
      summary: "Delete a task by ID",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: { 200: { description: "Task deleted" } },
    },
  },
];
