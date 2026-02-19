import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useBooks, useDueHighlights, useReviewHighlight } from "@/lib/api";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Quote, ThumbsDown, ThumbsUp, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function DailyReview() {
  const { data: books = [] } = useBooks();
  const { data: dueHighlights = [], isLoading, refetch } = useDueHighlights(10);
  const reviewMutation = useReviewHighlight();
  const { toast } = useToast();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());

  // Filter out already reviewed highlights
  const highlights = dueHighlights.filter(h => !reviewedIds.has(h.id));

  useEffect(() => {
    // Reset when we get new data
    setCurrentIndex(0);
    setCompleted(false);
    setReviewedIds(new Set());
  }, [dueHighlights.length]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  // If no highlights due, show empty state
  if (highlights.length === 0 && !completed) {
    return (
       <Layout>
        <div className="max-w-xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <Check className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-serif font-bold" data-testid="text-no-highlights">All caught up!</h2>
          <p className="text-muted-foreground max-w-md">
            No highlights are due for review right now. Add more highlights or check back later.
          </p>
          <Link href="/">
             <Button data-testid="button-go-dashboard">Go to Dashboard</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const currentHighlight = highlights[currentIndex];
  const book = currentHighlight ? books.find(b => b.id === currentHighlight.bookId) : null;

  const handleReview = async (quality: number) => {
    if (!currentHighlight) return;

    try {
      await reviewMutation.mutateAsync({ id: currentHighlight.id, quality });
      
      // Mark as reviewed
      setReviewedIds(prev => new Set(Array.from(prev).concat(currentHighlight.id)));
      
      // Move to next or complete
      if (currentIndex >= highlights.length - 1) {
        setCompleted(true);
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save review",
        variant: "destructive",
      });
    }
  };

  if (completed) {
    const reviewedCount = reviewedIds.size;
    return (
      <Layout>
        <div className="max-w-xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <Check className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-serif font-bold" data-testid="text-review-complete">Review Complete!</h1>
          <p className="text-muted-foreground text-lg max-w-md">
            You've reviewed {reviewedCount} highlight{reviewedCount !== 1 ? 's' : ''} today. Great work keeping your mind sharp!
          </p>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 pt-4">
             <Link href="/">
              <Button variant="outline" size="lg" className="w-full" data-testid="button-back-dashboard">Back to Dashboard</Button>
            </Link>
            <Button size="lg" className="w-full" onClick={() => { refetch(); setCompleted(false); setCurrentIndex(0); setReviewedIds(new Set()); }} data-testid="button-review-more">
              Check for More
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!currentHighlight) {
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
      <div className="max-w-2xl mx-auto space-y-6 md:space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif font-semibold text-muted-foreground">Daily Review</h2>
          <span className="text-sm font-medium bg-secondary px-3 py-1 rounded-full" data-testid="text-review-progress">
            {currentIndex + 1} / {highlights.length}
          </span>
        </div>

        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHighlight.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full"
            >
              <Card className="border-none shadow-xl bg-card text-card-foreground overflow-hidden relative min-h-[400px] flex flex-col">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/50"></div>
                <CardContent className="flex-1 p-5 sm:p-6 md:p-12 flex flex-col justify-center gap-6 md:gap-8">
                  
                  <div className="space-y-4 md:space-y-6">
                    <Quote className="w-8 h-8 text-primary/40 rotate-180" />
                    <p className="text-xl sm:text-2xl md:text-3xl font-serif leading-relaxed selection:bg-primary/30" data-testid="text-highlight-content">
                      {currentHighlight.text}
                    </p>
                    {currentHighlight.note && (
                      <div className="bg-secondary/50 p-4 rounded-md border border-secondary text-sm text-muted-foreground italic" data-testid="text-highlight-note">
                        Note: {currentHighlight.note}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 border-t border-border pt-6 mt-auto">
                    {book?.cover && (
                      <img 
                        src={book.cover} 
                        alt={book?.title} 
                        className="w-12 h-16 object-cover rounded shadow-sm"
                        data-testid="img-highlight-book-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold font-serif text-lg" data-testid="text-highlight-book-title">{book?.title || "Unknown Book"}</h3>
                      <p className="text-sm text-muted-foreground" data-testid="text-highlight-book-author">{book?.author || "Unknown Author"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Bar - SM-2 quality ratings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 md:pt-4">
          <Button 
            variant="outline" 
            className="h-12 sm:h-14 border-2 hover:border-destructive hover:bg-destructive/10 hover:text-destructive transition-colors gap-2"
            onClick={() => handleReview(1)} // Failed - don't remember
            disabled={reviewMutation.isPending}
            data-testid="button-forgot"
          >
            <ThumbsDown className="w-6 h-6" />
            Forgot
          </Button>

          <Button 
            variant="outline" 
            className="h-12 sm:h-14 border-2 hover:border-primary hover:bg-primary/10 transition-colors gap-2"
            onClick={() => handleReview(4)} // Good recall
            disabled={reviewMutation.isPending}
            data-testid="button-remembered"
          >
            <ThumbsUp className="w-6 h-6" />
            Remembered
          </Button>
        </div>
        
        <p className="text-center text-xs text-muted-foreground pt-4">
          Rate how well you remembered this highlight
        </p>
      </div>
    </Layout>
  );
}
