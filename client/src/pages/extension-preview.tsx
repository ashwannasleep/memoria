import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBooks, useCreateHighlight } from "@/lib/api";
import { ArrowLeft, BookMarked, Download, ExternalLink, FolderOpen, Highlighter, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function ExtensionPreview() {
  const { data: books = [] } = useBooks();
  const createHighlight = useCreateHighlight();
  const { toast } = useToast();
  
  const [selectedBookId, setSelectedBookId] = useState("");
  const [highlightText, setHighlightText] = useState("");
  const [note, setNote] = useState("");

  const extensionFolderUrl = "https://github.com/ashwannasleep/memoria/tree/main/extension";
  const extensionZipUrl = "https://github.com/ashwannasleep/memoria/archive/refs/heads/main.zip";

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
    <div className="min-h-screen bg-neutral-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-between gap-3">
          <Link href="/">
            <Button variant="outline" className="gap-2" data-testid="button-extension-back">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
          <p className="text-xs md:text-sm text-muted-foreground">
            Install once, then save highlights from any website with right click.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_400px] items-start">
          <Card className="p-5 md:p-6 space-y-4" data-testid="card-extension-install-guide">
            <div>
              <h1 className="text-2xl font-serif font-bold">Install The Chrome Extension</h1>
              <p className="text-sm text-muted-foreground mt-1">
                This is a real unpacked extension from this repo. No sign-in required.
              </p>
            </div>

            <ol className="space-y-2 text-sm list-decimal list-inside">
              <li>Open Chrome and go to <code>chrome://extensions</code>.</li>
              <li>Turn on <strong>Developer mode</strong> (top-right).</li>
              <li>Download this repo ZIP, unzip it, then click <strong>Load unpacked</strong>.</li>
              <li>Select the unzipped <code>extension</code> folder.</li>
              <li>Open the extension popup and confirm Memoria URL is <code>https://ashwannasleep.github.io/memoria/</code>.</li>
              <li>Highlight text on any website, right click, and choose <strong>Save selection to Memoria</strong>.</li>
            </ol>

            <div className="flex flex-wrap gap-2">
              <Button asChild className="gap-2" data-testid="button-extension-open-folder">
                <a href={extensionFolderUrl} target="_blank" rel="noreferrer">
                  <FolderOpen className="w-4 h-4" />
                  Open Extension Folder
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
              <Button asChild variant="secondary" className="gap-2" data-testid="button-extension-download-zip">
                <a href={extensionZipUrl} target="_blank" rel="noreferrer">
                  <Download className="w-4 h-4" />
                  Download Repo ZIP
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Note: data is saved to this browser&apos;s local storage. Use the same browser profile for clipping and reviewing.
            </p>
          </Card>

          <div className="w-full h-[600px] bg-background border border-border shadow-2xl rounded-lg overflow-hidden flex flex-col relative">
            <div className="h-8 bg-neutral-200 border-b border-neutral-300 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="ml-auto text-xs text-muted-foreground">Memoria Extension Preview</div>
            </div>

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

            <div className="px-4 py-2 border-b border-border bg-primary/5">
              <p className="text-xs text-muted-foreground">
                This simulates the popup UI. The real extension is loaded from <code>extension/</code>.
              </p>
            </div>

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
          </div>
        </div>
      </div>
    </div>
  );
}
