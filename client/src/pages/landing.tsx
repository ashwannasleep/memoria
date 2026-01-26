import { Button } from "@/components/ui/button";
import { BookOpen, Brain, Lightbulb, Sparkles, ArrowRight } from "lucide-react";
import heroImage from "@/assets/knowledge-hero.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-serif font-bold text-xl">
            <span className="w-6 h-6 bg-primary rounded-sm"></span>
            Memoria
          </div>
          <a href="/api/login">
            <Button className="rounded-full" data-testid="button-login">
              Sign In
            </Button>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight tracking-tight text-foreground">
                Remember everything you read.
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Memoria uses spaced repetition to help you retain the best ideas from your books, articles, and highlights. Never forget a great insight again.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/api/login">
                <Button size="lg" className="rounded-full px-8 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all" data-testid="button-get-started">
                  Get Started Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </a>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground pt-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Free forever plan
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                No credit card required
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl"></div>
              <img 
                src={heroImage} 
                alt="Knowledge retention visualization" 
                className="relative rounded-2xl shadow-2xl ring-1 ring-black/5 hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-sidebar border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-in fade-in duration-500">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Your personal knowledge retention system
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stop losing the insights from your reading. Memoria brings them back at the perfect moment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-background/50 hover:bg-background border border-transparent hover:border-border transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">Capture Highlights</h3>
              <p className="text-muted-foreground leading-relaxed">
                Save your favorite passages from any book or article. Build your personal library of wisdom.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-background/50 hover:bg-background border border-transparent hover:border-border transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">Spaced Repetition</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our SM-2 algorithm shows you highlights at scientifically-optimal intervals for long-term retention.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-background/50 hover:bg-background border border-transparent hover:border-border transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3">Daily Review</h3>
              <p className="text-muted-foreground leading-relaxed">
                Spend just 5 minutes a day reviewing. Watch your knowledge compound over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-in fade-in duration-500">
          <h2 className="text-3xl md:text-4xl font-serif font-bold">
            Ready to remember more?
          </h2>
          <p className="text-lg text-muted-foreground">
            Join readers who never lose their best ideas.
          </p>
          <a href="/api/login">
            <Button size="lg" className="rounded-full px-10 text-base font-medium shadow-lg">
              Start Your Free Account
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-serif font-medium">
            <span className="w-4 h-4 bg-primary rounded-sm"></span>
            Memoria
          </div>
          <p>&copy; {new Date().getFullYear()} Memoria. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
