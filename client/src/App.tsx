import { Router as WouterRouter, Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import DailyReview from "@/pages/daily-review";
import Library from "@/pages/library";
import ExtensionPreview from "@/pages/extension-preview";

function AuthenticatedRouter() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/review" component={DailyReview} />
      <Route path="/library" component={Library} />
      <Route path="/books" component={Library} />
      <Route path="/extension" component={ExtensionPreview} />
      <Route component={NotFound} />
    </Switch>
  );
}

const routerBase = import.meta.env.BASE_URL === "/" ? undefined : import.meta.env.BASE_URL.replace(/\/+$/, "");

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <WouterRouter base={routerBase}>
          <AuthenticatedRouter />
        </WouterRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
