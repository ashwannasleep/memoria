import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Loader2 } from "lucide-react";
import { useBooks, useCreateBook, useCreateHighlight } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function QuickAdd() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'highlight' | 'book'>('highlight');
  const { data: books = [] } = useBooks();
  const createBook = useCreateBook();
  const createHighlight = useCreateHighlight();
  const { toast } = useToast();

  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [selectedBookId, setSelectedBookId] = useState("");
  const [highlightText, setHighlightText] = useState("");
  const [highlightNote, setHighlightNote] = useState("");
  
  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    createBook.mutate(
      {
        title: bookTitle,
        author: bookAuthor,
        category: "Uncategorized",
        cover: `https://placehold.co/300x450/e2e8f0/1e293b?text=${encodeURIComponent(bookTitle)}`
      },
      {
        onSuccess: (newBook) => {
          toast({ title: "Book Added", description: `${bookTitle} added to your library.` });
          setSelectedBookId(newBook.id);
          setMode('highlight');
          setBookTitle("");
          setBookAuthor("");
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to add book", variant: "destructive" });
        }
      }
    );
  };

  const handleAddHighlight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookId) {
      toast({ title: "Error", description: "Please select a book first", variant: "destructive" });
      return;
    }

    createHighlight.mutate(
      {
        bookId: selectedBookId,
        text: highlightText,
        note: highlightNote || undefined,
      },
      {
        onSuccess: () => {
          toast({ title: "Highlight Saved", description: "Your highlight has been saved." });
          setOpen(false);
          setHighlightText("");
          setHighlightNote("");
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to save highlight", variant: "destructive" });
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-lg hover:shadow-primary/20 transition-all" data-testid="button-quick-add">
          <PlusCircle className="w-4 h-4" />
          Quick Add
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-serif">
            {mode === 'highlight' ? 'Add Highlight' : 'Add New Book'}
          </DialogTitle>
        </DialogHeader>

        {mode === 'highlight' ? (
          <form onSubmit={handleAddHighlight} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Book</Label>
              <div className="flex gap-2">
                <Select value={selectedBookId} onValueChange={setSelectedBookId}>
                  <SelectTrigger className="flex-1" data-testid="select-book">
                    <SelectValue placeholder="Select a book..." />
                  </SelectTrigger>
                  <SelectContent>
                    {books.map(b => (
                      <SelectItem key={b.id} value={b.id}>{b.title}</SelectItem>
                    ))}
                    {books.length === 0 && (
                      <div className="p-2 text-xs text-muted-foreground text-center">No books found</div>
                    )}
                  </SelectContent>
                </Select>
                <Button type="button" variant="outline" onClick={() => setMode('book')} data-testid="button-new-book">
                  New Book
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Highlight Text</Label>
              <Textarea 
                placeholder="Paste the text here..." 
                className="min-h-[120px] font-serif leading-relaxed"
                value={highlightText}
                onChange={e => setHighlightText(e.target.value)}
                required
                data-testid="input-highlight-text"
              />
            </div>

            <div className="space-y-2">
              <Label>Note (Optional)</Label>
              <Input 
                placeholder="Your thoughts..." 
                value={highlightNote}
                onChange={e => setHighlightNote(e.target.value)}
                data-testid="input-highlight-note"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={createHighlight.isPending} data-testid="button-save-highlight">
                {createHighlight.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Highlight
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleAddBook} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input 
                placeholder="Book Title" 
                value={bookTitle}
                onChange={e => setBookTitle(e.target.value)}
                required
                data-testid="input-book-title"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Author</Label>
              <Input 
                placeholder="Author Name" 
                value={bookAuthor}
                onChange={e => setBookAuthor(e.target.value)}
                required
                data-testid="input-book-author"
              />
            </div>

            <div className="flex justify-between pt-2">
              <Button type="button" variant="ghost" onClick={() => setMode('highlight')}>
                Cancel
              </Button>
              <Button type="submit" disabled={createBook.isPending} data-testid="button-save-book">
                {createBook.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Add Book
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
