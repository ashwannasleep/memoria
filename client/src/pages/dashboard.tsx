import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Flame, Trophy, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import heroImage from "@/assets/knowledge-hero.svg";
import { useBooks, useHighlights } from "@/lib/api";
import { QuickAdd } from "@/components/quick-add";

export default function Dashboard() {
  const { data: books = [], isLoading: booksLoading } = useBooks();
  const { data: highlights = [], isLoading: highlightsLoading } = useHighlights();

  if (booksLoading || highlightsLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  const streak = books.length > 0 ? 1 : 0;
  
  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Welcome / Hero Section */}
        <div className="relative overflow-hidden rounded-xl bg-sidebar border border-border">
          <div className="grid md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)] gap-6 md:gap-8 items-center p-6 md:p-10 lg:p-12 relative z-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground" data-testid="text-welcome-title">
                  Ready to remember?
                </h2>
                <p className="text-muted-foreground text-lg max-w-md" data-testid="text-welcome-subtitle">
                  {highlights.length > 0 
                    ? `You have ${Math.min(5, highlights.length)} highlights ready for your daily review.` 
                    : "Add your first book or highlight to start your knowledge journey."}
                </p>
              </div>
              
              <div className="flex gap-4">
                {highlights.length > 0 ? (
                  <Link href="/review">
                    <Button size="lg" className="rounded-full px-8 font-medium text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all" data-testid="button-start-review">
                      Start Daily Review
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                ) : (
                  <QuickAdd />
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative h-full min-h-[260px] lg:min-h-[300px] rounded-xl border border-border/60 bg-background/40 p-3">
                <img
                  src={heroImage}
                  alt="Knowledge retention visualization"
                  className="w-full h-full object-contain rounded-lg opacity-95"
                />
              </div>
            </div>
          </div>
          
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card/50 backdrop-blur-sm border-border/60 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Day Streak</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-serif" data-testid="text-streak">{streak}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-border/60 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Highlights</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-serif" data-testid="text-highlights-count">{highlights.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-border/60 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Books</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-serif" data-testid="text-books-count">{books.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/60 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Mastery</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-serif">--</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Books Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-serif font-bold">Your Library</h3>
            <div className="flex gap-2">
              <QuickAdd />
              <Link href="/books">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" data-testid="button-view-all">
                  View all <ArrowRight className="ml-1 w-3 h-3" />
                </Button>
              </Link>
            </div>
          </div>

          {books.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-lg bg-muted/20">
              <p className="text-muted-foreground mb-4" data-testid="text-empty-library">Your library is empty.</p>
              <QuickAdd />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.slice(0, 3).map((book) => {
                const bookHighlights = highlights.filter(h => h.bookId === book.id).length;
                return (
                  <div key={book.id} className="group flex gap-4 p-4 rounded-lg border border-transparent hover:border-border hover:bg-card/50 transition-all cursor-pointer" data-testid={`card-book-${book.id}`}>
                    <div className="w-16 h-24 flex-shrink-0 shadow-sm rounded-sm overflow-hidden bg-muted">
                      <img src={book.cover} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-testid={`img-book-cover-${book.id}`} />
                    </div>
                    <div className="flex flex-col justify-center space-y-1">
                      <h4 className="font-serif font-semibold leading-tight group-hover:text-primary transition-colors" data-testid={`text-book-title-${book.id}`}>{book.title}</h4>
                      <p className="text-sm text-muted-foreground" data-testid={`text-book-author-${book.id}`}>{book.author}</p>
                      <div className="flex items-center gap-2 pt-2">
                        <span className="text-xs font-medium bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground" data-testid={`text-highlights-${book.id}`}>
                          {bookHighlights} highlights
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
