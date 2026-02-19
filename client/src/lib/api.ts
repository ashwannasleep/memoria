import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Book, Highlight, InsertBook, InsertHighlight } from "@shared/schema";
const STORAGE_KEY = "memoria.local.v1";
const LOCAL_USER_ID = "local-user";

type LocalData = {
  books: Book[];
  highlights: Highlight[];
};

function now(): Date {
  return new Date();
}

function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function parseDate(value: unknown, fallback: Date): Date {
  if (value instanceof Date) {
    return value;
  }
  const parsed = new Date(typeof value === "string" || typeof value === "number" ? value : "");
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

function normalizeBook(raw: any): Book {
  const createdAt = parseDate(raw?.createdAt, now());
  return {
    id: typeof raw?.id === "string" ? raw.id : createId(),
    userId: LOCAL_USER_ID,
    title: typeof raw?.title === "string" ? raw.title : "Untitled",
    author: typeof raw?.author === "string" ? raw.author : "Unknown Author",
    cover:
      typeof raw?.cover === "string" && raw.cover.length > 0
        ? raw.cover
        : "https://placehold.co/300x450/e2e8f0/1e293b?text=Book",
    category: typeof raw?.category === "string" ? raw.category : "Uncategorized",
    lastRead: parseDate(raw?.lastRead, createdAt),
    createdAt,
  };
}

function normalizeHighlight(raw: any): Highlight {
  const createdAt = parseDate(raw?.createdAt, now());
  return {
    id: typeof raw?.id === "string" ? raw.id : createId(),
    userId: LOCAL_USER_ID,
    bookId: typeof raw?.bookId === "string" ? raw.bookId : "",
    text: typeof raw?.text === "string" ? raw.text : "",
    note: typeof raw?.note === "string" ? raw.note : null,
    page: typeof raw?.page === "string" ? raw.page : null,
    easeFactor: typeof raw?.easeFactor === "number" ? raw.easeFactor : 250,
    interval: typeof raw?.interval === "number" ? raw.interval : 0,
    repetitions: typeof raw?.repetitions === "number" ? raw.repetitions : 0,
    nextReviewAt: parseDate(raw?.nextReviewAt, createdAt),
    lastReviewedAt: raw?.lastReviewedAt ? parseDate(raw.lastReviewedAt, createdAt) : null,
    createdAt,
  };
}

function readData(): LocalData {
  if (typeof window === "undefined") {
    return { books: [], highlights: [] };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { books: [], highlights: [] };
    }

    const parsed = JSON.parse(raw);
    const books: Book[] = Array.isArray(parsed?.books)
      ? (parsed.books as unknown[]).map((item) => normalizeBook(item))
      : [];
    const bookIds = new Set(books.map((book) => book.id));
    const parsedHighlights: Highlight[] = Array.isArray(parsed?.highlights)
      ? (parsed.highlights as unknown[]).map((item) => normalizeHighlight(item))
      : [];
    const highlights = parsedHighlights.filter((highlight) => highlight.bookId && bookIds.has(highlight.bookId));

    return { books, highlights };
  } catch {
    return { books: [], highlights: [] };
  }
}

function writeData(data: LocalData): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function calculateNextReview(highlight: Highlight, quality: number): {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewAt: Date;
} {
  let easeFactor = highlight.easeFactor / 100;
  let interval = highlight.interval;
  let repetitions = highlight.repetitions;

  if (quality >= 3) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

  const nextReviewAt = now();
  nextReviewAt.setDate(nextReviewAt.getDate() + interval);

  return {
    easeFactor: Math.round(easeFactor * 100),
    interval,
    repetitions,
    nextReviewAt,
  };
}

async function fetchBooks(): Promise<Book[]> {
  const data = readData();
  return data.books.sort((a, b) => b.lastRead.getTime() - a.lastRead.getTime());
}

async function fetchHighlights(): Promise<Highlight[]> {
  const data = readData();
  return data.highlights.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

async function fetchDueHighlights(limit = 10): Promise<Highlight[]> {
  const data = readData();
  const nowMs = Date.now();
  return data.highlights
    .filter((highlight) => highlight.nextReviewAt.getTime() <= nowMs)
    .sort((a, b) => a.nextReviewAt.getTime() - b.nextReviewAt.getTime())
    .slice(0, limit);
}

async function createBook(insertBook: InsertBook): Promise<Book> {
  const data = readData();
  const createdAt = now();
  const book: Book = {
    id: createId(),
    userId: LOCAL_USER_ID,
    title: insertBook.title,
    author: insertBook.author,
    cover: insertBook.cover,
    category: insertBook.category ?? "Uncategorized",
    lastRead: createdAt,
    createdAt,
  };
  data.books.push(book);
  writeData(data);
  return book;
}

async function createHighlight(insertHighlight: InsertHighlight): Promise<Highlight> {
  const data = readData();
  const book = data.books.find((item) => item.id === insertHighlight.bookId);
  if (!book) {
    throw new Error("Failed to create highlight");
  }

  const createdAt = now();
  const highlight: Highlight = {
    id: createId(),
    userId: LOCAL_USER_ID,
    bookId: insertHighlight.bookId,
    text: insertHighlight.text,
    note: insertHighlight.note ?? null,
    page: insertHighlight.page ?? null,
    easeFactor: 250,
    interval: 0,
    repetitions: 0,
    nextReviewAt: createdAt,
    lastReviewedAt: null,
    createdAt,
  };

  book.lastRead = createdAt;
  data.highlights.push(highlight);
  writeData(data);
  return highlight;
}

async function deleteHighlight(id: string): Promise<void> {
  const data = readData();
  data.highlights = data.highlights.filter((highlight) => highlight.id !== id);
  writeData(data);
}

async function reviewHighlight(id: string, quality: number): Promise<Highlight> {
  if (Number.isNaN(quality) || quality < 0 || quality > 5) {
    throw new Error("Failed to review highlight");
  }

  const data = readData();
  const index = data.highlights.findIndex((highlight) => highlight.id === id);
  if (index < 0) {
    throw new Error("Failed to review highlight");
  }

  const current = data.highlights[index];
  const updates = calculateNextReview(current, quality);
  const reviewed = {
    ...current,
    ...updates,
    lastReviewedAt: now(),
  };
  data.highlights[index] = reviewed;
  writeData(data);
  return reviewed;
}

// React Query Hooks
export function useBooks() {
  return useQuery({
    queryKey: ["books"],
    queryFn: fetchBooks,
    retry: false,
  });
}

export function useHighlights() {
  return useQuery({
    queryKey: ["highlights"],
    queryFn: fetchHighlights,
    retry: false,
  });
}

export function useDueHighlights(limit = 10) {
  return useQuery({
    queryKey: ["highlights", "due", limit],
    queryFn: () => fetchDueHighlights(limit),
    retry: false,
  });
}

export function useCreateBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

export function useCreateHighlight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createHighlight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["highlights"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

export function useDeleteHighlight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteHighlight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["highlights"] });
    },
  });
}

export function useReviewHighlight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quality }: { id: string; quality: number }) => reviewHighlight(id, quality),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["highlights"] });
    },
  });
}
