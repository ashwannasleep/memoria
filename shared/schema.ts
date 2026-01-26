import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Re-export auth models
export * from "./models/auth";

import { users } from "./models/auth";

export const books = pgTable("books", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  author: text("author").notNull(),
  cover: text("cover").notNull(),
  category: text("category").notNull().default("Uncategorized"),
  lastRead: timestamp("last_read").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const highlights = pgTable("highlights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  bookId: varchar("book_id").notNull().references(() => books.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  note: text("note"),
  page: text("page"),
  // Spaced repetition fields
  easeFactor: integer("ease_factor").notNull().default(250), // 2.5 * 100 for integer storage
  interval: integer("interval").notNull().default(0), // days until next review
  repetitions: integer("repetitions").notNull().default(0), // number of successful reviews
  nextReviewAt: timestamp("next_review_at").notNull().defaultNow(),
  lastReviewedAt: timestamp("last_reviewed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert Schemas
export const insertBookSchema = createInsertSchema(books).omit({
  id: true,
  createdAt: true,
  lastRead: true,
  userId: true, // Set by server
});

export const insertHighlightSchema = createInsertSchema(highlights).omit({
  id: true,
  createdAt: true,
  userId: true, // Set by server
  easeFactor: true,
  interval: true,
  repetitions: true,
  nextReviewAt: true,
  lastReviewedAt: true,
});

// Types
export type Book = typeof books.$inferSelect;
export type InsertBook = z.infer<typeof insertBookSchema>;

export type Highlight = typeof highlights.$inferSelect;
export type InsertHighlight = z.infer<typeof insertHighlightSchema>;
