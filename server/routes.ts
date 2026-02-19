import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookSchema, insertHighlightSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import {
  setupAuth,
  registerAuthRoutes,
  isAuthenticated,
  authStorage,
  LOCAL_USER_ID,
  isAuthEnabled,
} from "./integrations/auth";

// Helper to get user ID from request
function getUserId(req: any): string {
  return req.user?.claims?.sub ?? LOCAL_USER_ID;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Setup authentication first
  await setupAuth(app);
  registerAuthRoutes(app);

  if (!isAuthEnabled()) {
    await authStorage.upsertUser({ id: LOCAL_USER_ID });
  }
  
  // Books routes (protected)
  app.get("/api/books", isAuthenticated, async (req, res) => {
    try {
      const userId = getUserId(req);
      const books = await storage.getAllBooks(userId);
      res.json(books);
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({ error: "Failed to fetch books" });
    }
  });

  app.get("/api/books/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = getUserId(req);
      const book = await storage.getBook(userId, req.params.id as string);
      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }
      res.json(book);
    } catch (error) {
      console.error("Error fetching book:", error);
      res.status(500).json({ error: "Failed to fetch book" });
    }
  });

  app.post("/api/books", isAuthenticated, async (req, res) => {
    try {
      const userId = getUserId(req);
      const validated = insertBookSchema.parse(req.body);
      const book = await storage.createBook(userId, validated);
      res.status(201).json(book);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Error creating book:", error);
      res.status(500).json({ error: "Failed to create book" });
    }
  });

  app.delete("/api/books/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = getUserId(req);
      await storage.deleteBook(userId, req.params.id as string);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting book:", error);
      res.status(500).json({ error: "Failed to delete book" });
    }
  });

  // Highlights routes (protected)
  app.get("/api/highlights", isAuthenticated, async (req, res) => {
    try {
      const userId = getUserId(req);
      const bookId = req.query.bookId as string | undefined;
      if (bookId) {
        const highlights = await storage.getHighlightsByBook(userId, bookId);
        return res.json(highlights);
      }
      const highlights = await storage.getAllHighlights(userId);
      res.json(highlights);
    } catch (error) {
      console.error("Error fetching highlights:", error);
      res.status(500).json({ error: "Failed to fetch highlights" });
    }
  });

  app.get("/api/highlights/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = getUserId(req);
      const highlight = await storage.getHighlight(userId, req.params.id as string);
      if (!highlight) {
        return res.status(404).json({ error: "Highlight not found" });
      }
      res.json(highlight);
    } catch (error) {
      console.error("Error fetching highlight:", error);
      res.status(500).json({ error: "Failed to fetch highlight" });
    }
  });

  app.post("/api/highlights", isAuthenticated, async (req, res) => {
    try {
      const userId = getUserId(req);
      const validated = insertHighlightSchema.parse(req.body);
      const highlight = await storage.createHighlight(userId, validated);
      res.status(201).json(highlight);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Error creating highlight:", error);
      res.status(500).json({ error: "Failed to create highlight" });
    }
  });

  app.patch("/api/highlights/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = getUserId(req);
      const updates = insertHighlightSchema.partial().parse(req.body);
      const highlight = await storage.updateHighlight(userId, req.params.id as string, updates);
      if (!highlight) {
        return res.status(404).json({ error: "Highlight not found" });
      }
      res.json(highlight);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      console.error("Error updating highlight:", error);
      res.status(500).json({ error: "Failed to update highlight" });
    }
  });

  app.delete("/api/highlights/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = getUserId(req);
      await storage.deleteHighlight(userId, req.params.id as string);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting highlight:", error);
      res.status(500).json({ error: "Failed to delete highlight" });
    }
  });

  // Spaced Repetition routes
  app.get("/api/review/due", isAuthenticated, async (req, res) => {
    try {
      const userId = getUserId(req);
      const limit = parseInt(req.query.limit as string) || 10;
      const highlights = await storage.getDueHighlights(userId, limit);
      res.json(highlights);
    } catch (error) {
      console.error("Error fetching due highlights:", error);
      res.status(500).json({ error: "Failed to fetch due highlights" });
    }
  });

  app.post("/api/review/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = getUserId(req);
      const quality = parseInt(req.body.quality); // 0-5 rating
      if (isNaN(quality) || quality < 0 || quality > 5) {
        return res.status(400).json({ error: "Quality must be between 0 and 5" });
      }
      const highlight = await storage.reviewHighlight(userId, req.params.id as string, quality);
      if (!highlight) {
        return res.status(404).json({ error: "Highlight not found" });
      }
      res.json(highlight);
    } catch (error) {
      console.error("Error reviewing highlight:", error);
      res.status(500).json({ error: "Failed to review highlight" });
    }
  });

  return httpServer;
}
