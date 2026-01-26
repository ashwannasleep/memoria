import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBooks, useHighlights } from "@/lib/api";
import { QuickAdd } from "@/components/quick-add";
import { Filter, Search, SortDesc } from "lucide-react";

export default function Library() {
  const { data: books = [], isLoading: booksLoading } = useBooks();
  const { data: highlights = [] } = useHighlights();

  if (booksLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold" data-testid="text-library-title">Library</h1>
            <p className="text-muted-foreground mt-1" data-testid="text-library-stats">
              {books.length} books, {highlights.length} highlights
            </p>
          </div>
          <div className="flex gap-2">
            <QuickAdd />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center bg-card p-2 rounded-lg border border-border shadow-sm">
           <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
             <Input 
               placeholder="Search title, author, or highlights..." 
               className="pl-9 border-none bg-transparent shadow-none focus-visible:ring-0" 
               data-testid="input-search"
             />
           </div>
           <div className="flex items-center gap-2 border-l border-border pl-4">
             <Button variant="ghost" size="sm" className="gap-2">
               <Filter className="w-4 h-4" /> Filter
             </Button>
             <Button variant="ghost" size="sm" className="gap-2">
               <SortDesc className="w-4 h-4" /> Sort
             </Button>
           </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map((book) => {
             const bookHighlights = highlights.filter(h => h.bookId === book.id).length;
             return (
              <div key={book.id} className="group relative bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col" data-testid={`card-library-book-${book.id}`}>
                <div className="aspect-[2/3] w-full overflow-hidden bg-muted relative">
                  <img 
                    src={book.cover} 
                    alt={book.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    data-testid={`img-library-cover-${book.id}`}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary" className="font-medium">View</Button>
                  </div>
                </div>
                
                <div className="p-4 flex-1 flex flex-col">
                  <div className="mb-2">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-primary-foreground/70 bg-primary/10 px-2 py-0.5 rounded-sm">
                      {book.category}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-lg leading-tight mb-1 group-hover:text-primary transition-colors" data-testid={`text-library-title-${book.id}`}>
                    {book.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4" data-testid={`text-library-author-${book.id}`}>{book.author}</p>
                  
                  <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
                    <span data-testid={`text-library-highlights-${book.id}`}>{bookHighlights} highlights</span>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Add New Placeholder */}
          <div className="flex justify-center h-full items-center min-h-[300px]">
             <QuickAdd />
          </div>
        </div>
      </div>
    </Layout>
  );
}
