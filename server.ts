import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import {
  ensureDatabaseSeeded,
  getAllAppData,
  insertClient,
  updateClientInDb,
  deleteClientFromDb,
  insertProject,
  updateProjectInDb,
  deleteProjectFromDb,
  insertTask,
  updateTaskInDb,
  deleteTaskFromDb,
  insertQuote,
  updateQuoteInDb,
  deleteQuoteFromDb,
  insertIncome,
  deleteIncomeFromDb,
  insertExpense,
  deleteExpenseFromDb,
  updateSettingsInDb,
} from "./src/db/queries.ts";
import { optionalAuth, AuthRequest } from "./src/middleware/auth.ts";

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

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", database: "postgresql" });
  });

  // Fetch full dataset from Cloud SQL database
  app.get("/api/bootstrap", optionalAuth, async (req: AuthRequest, res) => {
    try {
      const data = await getAllAppData();
      res.json(data);
    } catch (error: any) {
      console.error("Failed to fetch app data from Cloud SQL:", error);
      res.status(500).json({ error: error.message || "Failed to fetch database data" });
    }
  });

  // Clients Endpoints
  app.post("/api/clients", optionalAuth, async (req: AuthRequest, res) => {
    try {
      const newClient = await insertClient(req.body);
      res.status(201).json(newClient);
    } catch (error: any) {
      console.error("Error creating client in DB:", error);
      res.status(500).json({ error: error.message || "Failed to create client" });
    }
  });

  app.put("/api/clients/:id", optionalAuth, async (req: AuthRequest, res) => {
    try {
      const updated = await updateClientInDb(req.params.id, req.body);
      res.json(updated);
    } catch (error: any) {
      console.error("Error updating client in DB:", error);
      res.status(500).json({ error: error.message || "Failed to update client" });
    }
  });

  app.delete("/api/clients/:id", optionalAuth, async (req: AuthRequest, res) => {
    try {
      await deleteClientFromDb(req.params.id);
      res.json({ success: true, id: req.params.id });
    } catch (error: any) {
      console.error("Error deleting client from DB:", error);
      res.status(500).json({ error: error.message || "Failed to delete client" });
    }
  });

  // Projects Endpoints
  app.post("/api/projects", optionalAuth, async (req: AuthRequest, res) => {
    try {
      const newProj = await insertProject(req.body);
      res.status(201).json(newProj);
    } catch (error: any) {
      console.error("Error creating project in DB:", error);
      res.status(500).json({ error: error.message || "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", optionalAuth, async (req: AuthRequest, res) => {
    try {
      const updated = await updateProjectInDb(req.params.id, req.body);
      res.json(updated);
    } catch (error: any) {
      console.error("Error updating project in DB:", error);
      res.status(500).json({ error: error.message || "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", optionalAuth, async (req: AuthRequest, res) => {
    try {
      await deleteProjectFromDb(req.params.id);
      res.json({ success: true, id: req.params.id });
    } catch (error: any) {
      console.error("Error deleting project from DB:", error);
      res.status(500).json({ error: error.message || "Failed to delete project" });
    }
  });

  // Tasks Endpoints
  app.post("/api/tasks", optionalAuth, async (req: AuthRequest, res) => {
    try {
      const newTask = await insertTask(req.body);
      res.status(201).json(newTask);
    } catch (error: any) {
      console.error("Error creating task in DB:", error);
      res.status(500).json({ error: error.message || "Failed to create task" });
    }
  });

  app.put("/api/tasks/:id", optionalAuth, async (req: AuthRequest, res) => {
    try {
      const updated = await updateTaskInDb(req.params.id, req.body);
      res.json(updated);
    } catch (error: any) {
      console.error("Error updating task in DB:", error);
      res.status(500).json({ error: error.message || "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", optionalAuth, async (req: AuthRequest, res) => {
    try {
      await deleteTaskFromDb(req.params.id);
      res.json({ success: true, id: req.params.id });
    } catch (error: any) {
      console.error("Error deleting task from DB:", error);
      res.status(500).json({ error: error.message || "Failed to delete task" });
    }
  });

  // Quotes Endpoints
  app.post("/api/quotes", optionalAuth, async (req: AuthRequest, res) => {
    try {
      const newQuote = await insertQuote(req.body);
      res.status(201).json(newQuote);
    } catch (error: any) {
      console.error("Error creating quote in DB:", error);
      res.status(500).json({ error: error.message || "Failed to create quote" });
    }
  });

  app.put("/api/quotes/:id", optionalAuth, async (req: AuthRequest, res) => {
    try {
      const updated = await updateQuoteInDb(req.params.id, req.body);
      res.json(updated);
    } catch (error: any) {
      console.error("Error updating quote in DB:", error);
      res.status(500).json({ error: error.message || "Failed to update quote" });
    }
  });

  app.delete("/api/quotes/:id", optionalAuth, async (req: AuthRequest, res) => {
    try {
      await deleteQuoteFromDb(req.params.id);
      res.json({ success: true, id: req.params.id });
    } catch (error: any) {
      console.error("Error deleting quote from DB:", error);
      res.status(500).json({ error: error.message || "Failed to delete quote" });
    }
  });

  // Incomes & Expenses Endpoints
  app.post("/api/incomes", optionalAuth, async (req: AuthRequest, res) => {
    try {
      const newInc = await insertIncome(req.body);
      res.status(201).json(newInc);
    } catch (error: any) {
      console.error("Error recording income in DB:", error);
      res.status(500).json({ error: error.message || "Failed to record income" });
    }
  });

  app.delete("/api/incomes/:id", optionalAuth, async (req: AuthRequest, res) => {
    try {
      await deleteIncomeFromDb(req.params.id);
      res.json({ success: true, id: req.params.id });
    } catch (error: any) {
      console.error("Error deleting income from DB:", error);
      res.status(500).json({ error: error.message || "Failed to delete income" });
    }
  });

  app.post("/api/expenses", optionalAuth, async (req: AuthRequest, res) => {
    try {
      const newExp = await insertExpense(req.body);
      res.status(201).json(newExp);
    } catch (error: any) {
      console.error("Error recording expense in DB:", error);
      res.status(500).json({ error: error.message || "Failed to record expense" });
    }
  });

  app.delete("/api/expenses/:id", optionalAuth, async (req: AuthRequest, res) => {
    try {
      await deleteExpenseFromDb(req.params.id);
      res.json({ success: true, id: req.params.id });
    } catch (error: any) {
      console.error("Error deleting expense from DB:", error);
      res.status(500).json({ error: error.message || "Failed to delete expense" });
    }
  });

  // Settings Endpoint
  app.post("/api/settings", optionalAuth, async (req: AuthRequest, res) => {
    try {
      await updateSettingsInDb(req.body);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error saving settings in DB:", error);
      res.status(500).json({ error: error.message || "Failed to save settings" });
    }
  });

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
