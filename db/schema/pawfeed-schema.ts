import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const boardingStatusEnum = pgEnum("boardingStatus", [
  "upcoming",
  "ongoing",
  "completed",
]);

export const boardingSession = pgTable("boardingSession", {
  id: text("id").primaryKey(),
  sitterId: text("sitter_id").notNull(),
  shareToken: text("share_token").notNull(),
  checkIn: timestamp("check_in").notNull(),
  checkOut: timestamp("check_out").notNull(),
});

export const timelineUpdate = pgTable("timelineUpdate", {
  id: text("id").primaryKey(),
  boardingSessionId: text("boarding_session_id").notNull(),
  imageUrl: text("image_url"),
  imageCaption: text("image_caption"),
  description: text("description"),
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