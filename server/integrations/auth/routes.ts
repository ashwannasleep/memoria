import type { Express } from "express";
import { authStorage } from "./storage";
import { isAuthenticated, isAuthEnabled } from "./Auth";

// Register auth-specific routes
export function registerAuthRoutes(app: Express): void {
  const frontendUrl = process.env.FRONTEND_URL ?? "/";

  if (!isAuthEnabled()) {
    app.get("/api/login", (_req, res) => {
      res.redirect(frontendUrl);
    });

    app.get("/api/callback", (_req, res) => {
      res.redirect(frontendUrl);
    });

    app.get("/api/logout", (_req, res) => {
      res.redirect(frontendUrl);
    });
  }

  // Get current authenticated user
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await authStorage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
}
