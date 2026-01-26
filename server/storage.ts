import { db } from "./db";
import { books, highlights, type Book, type Highlight, type InsertBook, type InsertHighlight } from "@shared/schema";
import { eq, desc, and, lte } from "drizzle-orm";

export interface IStorage {
  // Books
  getAllBooks(userId: string): Promise<Book[]>;
  getBook(userId: string, id: string): Promise<Book | undefined>;
  createBook(userId: string, book: InsertBook): Promise<Book>;
  deleteBook(userId: string, id: string): Promise<void>;

  // Highlights
  getAllHighlights(userId: string): Promise<Highlight[]>;
  getHighlightsByBook(userId: string, bookId: string): Promise<Highlight[]>;
  getHighlight(userId: string, id: string): Promise<Highlight | undefined>;
  createHighlight(userId: string, highlight: InsertHighlight): Promise<Highlight>;
  deleteHighlight(userId: string, id: string): Promise<void>;
  updateHighlight(userId: string, id: string, updates: Partial<InsertHighlight>): Promise<Highlight | undefined>;
  
  // Spaced Repetition
  getDueHighlights(userId: string, limit?: number): Promise<Highlight[]>;
  reviewHighlight(userId: string, id: string, quality: number): Promise<Highlight | undefined>;
}

// SM-2 Spaced Repetition Algorithm
function calculateNextReview(highlight: Highlight, quality: number): { 
  easeFactor: number; 
  interval: number; 
  repetitions: number; 
  nextReviewAt: Date 
} {
  // quality: 0-5 (0-2 = failed, 3-5 = success)
  let easeFactor = highlight.easeFactor / 100; // Convert back to decimal
  let interval = highlight.interval;
  let repetitions = highlight.repetitions;

  if (quality >= 3) {
    // Successful recall
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  } else {
    // Failed recall - reset
    repetitions = 0;
    interval = 1;
  }

  // Update ease factor (minimum 1.3)
  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + interval);

  return {
    easeFactor: Math.round(easeFactor * 100),
    interval,
    repetitions,
    nextReviewAt,
  };
}

export class DbStorage implements IStorage {
  // Books
  async getAllBooks(userId: string): Promise<Book[]> {
    return db.select().from(books).where(eq(books.userId, userId)).orderBy(desc(books.lastRead));
  }

  async getBook(userId: string, id: string): Promise<Book | undefined> {
    const result = await db.select().from(books)
      .where(and(eq(books.id, id), eq(books.userId, userId)))
      .limit(1);
    return result[0];
  }

  async createBook(userId: string, insertBook: InsertBook): Promise<Book> {
    const result = await db.insert(books).values({ ...insertBook, userId }).returning();
    return result[0];
  }

  async deleteBook(userId: string, id: string): Promise<void> {
    await db.delete(books).where(and(eq(books.id, id), eq(books.userId, userId)));
  }

  // Highlights
  async getAllHighlights(userId: string): Promise<Highlight[]> {
    return db.select().from(highlights).where(eq(highlights.userId, userId)).orderBy(desc(highlights.createdAt));
  }

  async getHighlightsByBook(userId: string, bookId: string): Promise<Highlight[]> {
    return db.select().from(highlights)
      .where(and(eq(highlights.bookId, bookId), eq(highlights.userId, userId)))
      .orderBy(desc(highlights.createdAt));
  }

  async getHighlight(userId: string, id: string): Promise<Highlight | undefined> {
    const result = await db.select().from(highlights)
      .where(and(eq(highlights.id, id), eq(highlights.userId, userId)))
      .limit(1);
    return result[0];
  }

  async createHighlight(userId: string, insertHighlight: InsertHighlight): Promise<Highlight> {
    const result = await db.insert(highlights).values({ ...insertHighlight, userId }).returning();
    
    // Update book's lastRead timestamp
    await db.update(books)
      .set({ lastRead: new Date() })
      .where(and(eq(books.id, insertHighlight.bookId), eq(books.userId, userId)));
    
    return result[0];
  }

  async deleteHighlight(userId: string, id: string): Promise<void> {
    await db.delete(highlights).where(and(eq(highlights.id, id), eq(highlights.userId, userId)));
  }

  async updateHighlight(userId: string, id: string, updates: Partial<InsertHighlight>): Promise<Highlight | undefined> {
    const result = await db.update(highlights)
      .set(updates)
      .where(and(eq(highlights.id, id), eq(highlights.userId, userId)))
      .returning();
    return result[0];
  }

  // Spaced Repetition
  async getDueHighlights(userId: string, limit = 10): Promise<Highlight[]> {
    return db.select().from(highlights)
      .where(and(
        eq(highlights.userId, userId),
        lte(highlights.nextReviewAt, new Date())
      ))
      .orderBy(highlights.nextReviewAt)
      .limit(limit);
  }

  async reviewHighlight(userId: string, id: string, quality: number): Promise<Highlight | undefined> {
    const highlight = await this.getHighlight(userId, id);
    if (!highlight) return undefined;

    const updates = calculateNextReview(highlight, quality);
    
    const result = await db.update(highlights)
      .set({
        ...updates,
        lastReviewedAt: new Date(),
      })
      .where(and(eq(highlights.id, id), eq(highlights.userId, userId)))
      .returning();
    
    return result[0];
  }
}

export const storage = new DbStorage();
