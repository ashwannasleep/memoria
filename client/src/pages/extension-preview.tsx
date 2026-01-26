import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBooks, useCreateHighlight } from "@/lib/api";
import { BookMarked, Highlighter, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ExtensionPreview() {
  const { data: books = [] } = useBooks();
  const createHighlight = useCreateHighlight();
  const { toast } = useToast();
  
  const [selectedBookId, setSelectedBookId] = useState("");
  const [highlightText, setHighlightText] = useState("");
  const [note, setNote] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookId) {
       toast({ title: "Select a book", variant: "destructive" });
       return;
    }
    
    createHighlight.mutate(
      {
        bookId: selectedBookId,
        text: highlightText,
        note: note || undefined,
      },
      {
        onSuccess: () => {
          toast({ title: "Saved to Memoria!" });
          setHighlightText("");
          setNote("");
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to save highlight", variant: "destructive" });
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
      <div className="w-[400px] h-[600px] bg-background border border-border shadow-2xl rounded-lg overflow-hidden flex flex-col relative">
        
        {/* Fake Browser Chrome Header */}
        <div className="h-8 bg-neutral-200 border-b border-neutral-300 flex items-center px-4 gap-2">
           <div className="w-3 h-3 rounded-full bg-red-400"></div>
           <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
           <div className="w-3 h-3 rounded-full bg-green-400"></div>
           <div className="ml-auto text-xs text-muted-foreground">Memoria Extension</div>
        </div>

        {/* Extension Header */}
        <div className="p-4 bg-sidebar border-b border-border flex items-center justify-between">
           <div className="flex items-center gap-2 font-serif font-bold text-foreground">
             <span className="w-5 h-5 bg-primary rounded-sm block"></span>
             Memoria
           </div>
           <div className="flex gap-1">
             <Button variant="ghost" size="icon" className="h-8 w-8">
               <BookMarked className="w-4 h-4" />
             </Button>
           </div>
        </div>

        {/* Extension Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase text-muted-foreground font-bold tracking-wider">Highlight Selection</Label>
              <Textarea 
                placeholder="Highlight text will appear here..." 
                className="font-serif bg-secondary/30 min-h-[150px] text-sm resize-none focus-visible:ring-1"
                value={highlightText}
                onChange={e => setHighlightText(e.target.value)}
                data-testid="input-extension-highlight"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase text-muted-foreground font-bold tracking-wider">Book</Label>
              <Select value={selectedBookId} onValueChange={setSelectedBookId}>
                <SelectTrigger data-testid="select-extension-book">
                  <SelectValue placeholder="Select book..." />
                </SelectTrigger>
                <SelectContent>
                  {books.map(b => (
                    <SelectItem key={b.id} value={b.id}>{b.title}</SelectItem>
                  ))}
                  {books.length === 0 && (
                    <div className="p-2 text-xs text-muted-foreground text-center">No books found. Add one first!</div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase text-muted-foreground font-bold tracking-wider">Note</Label>
              <Input 
                placeholder="Add a thought..." 
                className="text-sm"
                value={note}
                onChange={e => setNote(e.target.value)}
                data-testid="input-extension-note"
              />
            </div>

            <Button type="submit" className="w-full gap-2" disabled={createHighlight.isPending} data-testid="button-extension-save">
              {createHighlight.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Highlighter className="w-4 h-4" />
              )}
              Save Highlight
            </Button>
          </form>
        </div>
        
        <div className="p-3 bg-muted/30 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            Highlight text on any page, right click, and select "Save to Memoria"
          </p>
        </div>

      </div>
      
      {/* Context Label */}
      <div className="fixed bottom-8 text-center space-y-2">
        <p className="font-medium text-muted-foreground">Extension Preview Mode</p>
        <p className="text-sm text-muted-foreground/60 max-w-md">
          This preview demonstrates how the browser extension popup would function. 
          Data saved here persists to your database.
        </p>
      </div>
    </div>
  );
}
