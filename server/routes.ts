import type { Express } from "express";
import { createServer, type Server } from "http";

export function registerRoutes(app: Express): Server {
  // Since this is a client-side only application, we don't need any API routes
  const httpServer = createServer(app);
  return httpServer;
}
