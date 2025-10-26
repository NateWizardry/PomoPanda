import { z } from "zod";

const TimetableEventSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  day: z.string(),
  hour: z.string(),
  subject: z.string(),
  color: z.string(),
  userId: z.number(),
});

export const timetablePaths = [
  {
    method: "get",
    path: "/api/timetable/{userId}",
    config: {
      summary: "Get all timetable events for a user",
      parameters: [
        { name: "userId", in: "path", required: true, schema: { type: "integer" } },
      ],
      responses: {
        200: {
          description: "User timetable events",
          content: { "application/json": { schema: z.array(TimetableEventSchema) } },
        },
      },
    },
  },
  {
    method: "post",
    path: "/api/timetable",
    config: {
      summary: "Create a new timetable event",
      requestBody: {
        content: { "application/json": { schema: TimetableEventSchema } },
      },
      responses: {
        201: {
          description: "Timetable event created",
          content: { "application/json": { schema: TimetableEventSchema } },
        },
      },
    },
  },
  {
    method: "delete",
    path: "/api/timetable/{userId}/{eventId}",
    config: {
      summary: "Delete a timetable event by ID for a user",
      parameters: [
        { name: "userId", in: "path", required: true, schema: { type: "integer" } },
        { name: "eventId", in: "path", required: true, schema: { type: "integer" } },
      ],
      responses: { 200: { description: "Event deleted" } },
    },
  },
];
