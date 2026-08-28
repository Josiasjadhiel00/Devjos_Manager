import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { apiRouter } from "./src/apiRouter.ts";
import { ensureDatabaseSeeded } from "./src/db/queries.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Attempt database seed if needed on startup
  try {
    await ensureDatabaseSeeded();
  } catch (err) {
    console.error("Database seed check encountered:", err);
  }

  // Mount API router
  app.use("/api", apiRouter);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 DevJos Manager Backend running on http://localhost:${PORT}`);
  });
}

startServer();
