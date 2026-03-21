import { relations, sql } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { user } from "./auth-schema";

export const boardingStatusEnum = pgEnum("boardingStatus", [
  "upcoming",
  "ongoing",
  "completed",
]);

export const activityEnum = pgEnum("activity", [
  "playing",
  "walking",
  "eating",
  "general",
]);

export const boardingSession = pgTable("boardingSession", {
  id: uuid("id").primaryKey().defaultRandom(),
  sitterId: text("sitter_id").notNull(),
  ownerName: text("owner_name").notNull(),
  petNames: text("pet_names")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  shareToken: text("share_token")
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  checkIn: timestamp("check_in").notNull(),
  checkOut: timestamp("check_out").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const timelineUpdate = pgTable("timelineUpdate", {
  id: text("id").primaryKey(),
  boardingSessionId: uuid("boarding_session_id")
    .notNull()
    .references(() => boardingSession.id, { onDelete: "cascade" }),
  imageUrl: text("image_url"),
  description: text("description"),
  activity: activityEnum("activity").notNull().default("general"),
  title: text("title"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const boardingSessionRelations = relations(
  boardingSession,
  ({ one, many }) => ({
    sitter: one(user, {
      fields: [boardingSession.sitterId],
      references: [user.id],
    }),
    timelineUpdates: many(timelineUpdate),
  }),
);

export const timelineUpdateRelations = relations(timelineUpdate, ({ one }) => ({
  boardingSession: one(boardingSession, {
    fields: [timelineUpdate.boardingSessionId],
    references: [boardingSession.id],
  }),
}));
