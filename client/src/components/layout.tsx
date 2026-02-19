import { 
  Brain, 
  LayoutDashboard, 
  Library
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Brain, label: "Daily Review", href: "/review" },
    { icon: Library, label: "Library", href: "/library" },
  ];

  const isItemActive = (href: string) => {
    if (href === "/library") {
      return location === "/library" || location === "/books";
    }
    return location === href;
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-sidebar flex flex-col fixed h-full z-10 hidden md:flex">
        <div className="p-6">
          <h1 className="text-2xl font-serif font-bold tracking-tight flex items-center gap-2">
            <span className="bg-primary w-6 h-6 rounded-sm inline-block"></span>
            Memoria
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
                  isItemActive(item.href)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
                )}
                data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </div>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <p className="px-3 py-2 text-xs text-muted-foreground">
            Local mode: data is stored in this browser only.
          </p>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="fixed top-0 inset-x-0 z-20 md:hidden border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-serif font-bold text-lg tracking-tight flex items-center gap-2">
            <span className="bg-primary w-5 h-5 rounded-sm inline-block"></span>
            Memoria
          </h1>
          <span className="text-xs text-muted-foreground">Local mode</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 pt-20 pb-24 md:p-12 md:pb-12">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 inset-x-0 z-20 md:hidden border-t border-border bg-sidebar/95 backdrop-blur">
        <div className="max-w-5xl mx-auto px-2 py-1 grid grid-cols-3 gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2 rounded-md text-[11px] font-medium transition-colors",
                  isItemActive(item.href)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground"
                )}
                data-testid={`nav-mobile-${item.label.toLowerCase().replace(' ', '-')}`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
