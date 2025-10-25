import { z } from "zod";

const UserRegisterSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const UserResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
});

export const authPaths = [
  {
    method: "post",
    path: "/api/auth/register",
    config: {
      summary: "Register a new user",
      requestBody: { content: { "application/json": { schema: UserRegisterSchema } } },
      responses: {
        201: {
          description: "User created",
          content: { "application/json": { schema: UserResponseSchema } },
        },
      },
    },
  },
  {
    method: "post",
    path: "/api/auth/login",
    config: {
      summary: "Log in a user",
      requestBody: { content: { "application/json": { schema: UserLoginSchema } } },
      responses: {
        200: {
          description: "Login successful",
          content: { "application/json": { schema: UserResponseSchema } },
        },
      },
    },
  },
];
