import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Book, Highlight, InsertBook, InsertHighlight } from "@shared/schema";
import { apiUrl } from "@/lib/api-base";

// API Functions
async function fetchBooks(): Promise<Book[]> {
  const res = await fetch(apiUrl("/api/books"), { credentials: "include" });
  if (res.status === 401) throw new Error("401: Unauthorized");
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
}

async function fetchHighlights(): Promise<Highlight[]> {
  const res = await fetch(apiUrl("/api/highlights"), { credentials: "include" });
  if (res.status === 401) throw new Error("401: Unauthorized");
  if (!res.ok) throw new Error("Failed to fetch highlights");
  return res.json();
}

async function fetchDueHighlights(limit = 10): Promise<Highlight[]> {
  const res = await fetch(apiUrl(`/api/review/due?limit=${limit}`), { credentials: "include" });
  if (res.status === 401) throw new Error("401: Unauthorized");
  if (!res.ok) throw new Error("Failed to fetch due highlights");
  return res.json();
}

async function createBook(book: InsertBook): Promise<Book> {
  const res = await fetch(apiUrl("/api/books"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(book),
  });
  if (res.status === 401) throw new Error("401: Unauthorized");
  if (!res.ok) throw new Error("Failed to create book");
  return res.json();
}

async function createHighlight(highlight: InsertHighlight): Promise<Highlight> {
  const res = await fetch(apiUrl("/api/highlights"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(highlight),
  });
  if (res.status === 401) throw new Error("401: Unauthorized");
  if (!res.ok) throw new Error("Failed to create highlight");
  return res.json();
}

async function deleteHighlight(id: string): Promise<void> {
  const res = await fetch(apiUrl(`/api/highlights/${id}`), {
    method: "DELETE",
    credentials: "include",
  });
  if (res.status === 401) throw new Error("401: Unauthorized");
  if (!res.ok) throw new Error("Failed to delete highlight");
}

async function reviewHighlight(id: string, quality: number): Promise<Highlight> {
  const res = await fetch(apiUrl(`/api/review/${id}`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ quality }),
  });
  if (res.status === 401) throw new Error("401: Unauthorized");
  if (!res.ok) throw new Error("Failed to review highlight");
  return res.json();
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
