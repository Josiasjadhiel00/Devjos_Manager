import { Router } from 'express';
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
  insertService,
  updateServiceInDb,
  deleteServiceFromDb,
  insertPayment,
  updatePaymentInDb,
  deletePaymentFromDb,
  syncAllAppData,
  updateSettingsInDb,
} from './db/queries.ts';
import { createPool, db } from './db/index.ts';
import { sql } from 'drizzle-orm';
import { requireAuth, requireRole, AuthRequest } from './middleware/auth.ts';

export const apiRouter = Router();

// Health & Status check endpoint for PostgreSQL / Vercel Postgres
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database: 'postgresql',
    hasPostgresUrl: Boolean(process.env.POSTGRES_URL || process.env.DATABASE_URL),
    timestamp: new Date().toISOString(),
  });
});

// Diagnostic endpoint to check Vercel Postgres / Neon / Cloud SQL connection
apiRouter.get('/db-status', requireAuth, requireRole('Administrador'), async (req: AuthRequest, res) => {
  try {
    const pool = createPool();
    const result = await pool.query('SELECT current_database(), current_user, NOW() as current_time;');
    const clientCountRes = await pool.query('SELECT COUNT(*) FROM clients;');
    const clientCount = parseInt(clientCountRes.rows[0]?.count || '0', 10);
    
    res.json({
      success: true,
      connected: true,
      database: result.rows[0]?.current_database,
      user: result.rows[0]?.current_user,
      serverTime: result.rows[0]?.current_time,
      totalClientsInPostgres: clientCount,
      message: `Conectado exitosamente a PostgreSQL en Vercel (${clientCount} clientes registrados).`,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      connected: false,
      error: err?.message || String(err),
      hasEnvVar: Boolean(process.env.POSTGRES_URL || process.env.DATABASE_URL),
      message: 'No se pudo conectar a la base de datos PostgreSQL en Vercel.',
    });
  }
});

// Initialize / Seed Tables
apiRouter.get('/init-db', requireAuth, requireRole('Administrador'), async (req: AuthRequest, res) => {
  try {
    await ensureDatabaseSeeded();
    res.json({
      success: true,
      message: 'Tablas y datos inicializados correctamente en PostgreSQL / Vercel Postgres',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || String(err) });
  }
});

// Fetch full dataset from PostgreSQL backend
apiRouter.get('/bootstrap', requireAuth, async (req: AuthRequest, res) => {
  try {
    const data = await getAllAppData();
    if (data) {
      res.json(data);
    } else {
      res.json({
        isConnected: false,
        message: 'PostgreSQL aún no está inicializado o no hay cadena de conexión activa.',
      });
    }
  } catch (error: any) {
    console.warn('PostgreSQL bootstrap info:', error?.message || error);
    res.json({
      isConnected: false,
      error: error?.message || 'Database not ready',
    });
  }
});

// Clients Endpoints
apiRouter.post('/clients', requireAuth, async (req: AuthRequest, res) => {
  try {
    const newClient = await insertClient(req.body);
    res.status(201).json(newClient);
  } catch (error: any) {
    console.error('Error creating client in DB:', error);
    res.status(500).json({ error: error.message || 'Failed to create client' });
  }
});

apiRouter.put('/clients/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const updated = await updateClientInDb(req.params.id, req.body);
    res.json(updated);
  } catch (error: any) {
    console.error('Error updating client in DB:', error);
    res.status(500).json({ error: error.message || 'Failed to update client' });
  }
});

apiRouter.delete('/clients/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    await deleteClientFromDb(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (error: any) {
    console.error('Error deleting client from DB:', error);
    res.status(500).json({ error: error.message || 'Failed to delete client' });
  }
});

// Projects Endpoints
apiRouter.post('/projects', requireAuth, async (req: AuthRequest, res) => {
  try {
    const newProj = await insertProject(req.body);
    res.status(201).json(newProj);
  } catch (error: any) {
    console.error('Error creating project in DB:', error);
    res.status(500).json({ error: error.message || 'Failed to create project' });
  }
});

apiRouter.put('/projects/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const updated = await updateProjectInDb(req.params.id, req.body);
    res.json(updated);
  } catch (error: any) {
    console.error('Error updating project in DB:', error);
    res.status(500).json({ error: error.message || 'Failed to update project' });
  }
});

apiRouter.delete('/projects/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    await deleteProjectFromDb(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (error: any) {
    console.error('Error deleting project from DB:', error);
    res.status(500).json({ error: error.message || 'Failed to delete project' });
  }
});

// Tasks Endpoints
apiRouter.post('/tasks', requireAuth, async (req: AuthRequest, res) => {
  try {
    const newTask = await insertTask(req.body);
    res.status(201).json(newTask);
  } catch (error: any) {
    console.error('Error creating task in DB:', error);
    res.status(500).json({ error: error.message || 'Failed to create task' });
  }
});

apiRouter.put('/tasks/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const updated = await updateTaskInDb(req.params.id, req.body);
    res.json(updated);
  } catch (error: any) {
    console.error('Error updating task in DB:', error);
    res.status(500).json({ error: error.message || 'Failed to update task' });
  }
});

apiRouter.delete('/tasks/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    await deleteTaskFromDb(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (error: any) {
    console.error('Error deleting task from DB:', error);
    res.status(500).json({ error: error.message || 'Failed to delete task' });
  }
});

// Quotes Endpoints
apiRouter.post('/quotes', requireAuth, async (req: AuthRequest, res) => {
  try {
    const newQuote = await insertQuote(req.body);
    res.status(201).json(newQuote);
  } catch (error: any) {
    console.error('Error creating quote in DB:', error);
    res.status(500).json({ error: error.message || 'Failed to create quote' });
  }
});

apiRouter.put('/quotes/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const updated = await updateQuoteInDb(req.params.id, req.body);
    res.json(updated);
  } catch (error: any) {
    console.error('Error updating quote in DB:', error);
    res.status(500).json({ error: error.message || 'Failed to update quote' });
  }
});

apiRouter.delete('/quotes/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    await deleteQuoteFromDb(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (error: any) {
    console.error('Error deleting quote from DB:', error);
    res.status(500).json({ error: error.message || 'Failed to delete quote' });
  }
});

// Incomes & Expenses Endpoints
apiRouter.post('/incomes', requireAuth, async (req: AuthRequest, res) => {
  try {
    const newInc = await insertIncome(req.body);
    res.status(201).json(newInc);
  } catch (error: any) {
    console.error('Error recording income in DB:', error);
    res.status(500).json({ error: error.message || 'Failed to record income' });
  }
});

apiRouter.delete('/incomes/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    await deleteIncomeFromDb(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (error: any) {
    console.error('Error deleting income from DB:', error);
    res.status(500).json({ error: error.message || 'Failed to delete income' });
  }
});

apiRouter.post('/expenses', requireAuth, async (req: AuthRequest, res) => {
  try {
    const newExp = await insertExpense(req.body);
    res.status(201).json(newExp);
  } catch (error: any) {
    console.error('Error recording expense in DB:', error);
    res.status(500).json({ error: error.message || 'Failed to record expense' });
  }
});

apiRouter.delete('/expenses/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    await deleteExpenseFromDb(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (error: any) {
    console.error('Error deleting expense from DB:', error);
    res.status(500).json({ error: error.message || 'Failed to delete expense' });
  }
});

// Services Endpoints
apiRouter.post('/services', requireAuth, async (req: AuthRequest, res) => {
  try {
    const newSrv = await insertService(req.body);
    res.status(201).json(newSrv);
  } catch (error: any) {
    console.error('Error saving service in DB:', error);
    res.status(500).json({ error: error.message || 'Failed to save service' });
  }
});

apiRouter.put('/services/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const updated = await updateServiceInDb(req.params.id, req.body);
    res.json(updated);
  } catch (error: any) {
    console.error('Error updating service in DB:', error);
    res.status(500).json({ error: error.message || 'Failed to update service' });
  }
});

apiRouter.delete('/services/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    await deleteServiceFromDb(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (error: any) {
    console.error('Error deleting service from DB:', error);
    res.status(500).json({ error: error.message || 'Failed to delete service' });
  }
});

// Payments Endpoints
apiRouter.post('/payments', requireAuth, async (req: AuthRequest, res) => {
  try {
    const newPay = await insertPayment(req.body);
    res.status(201).json(newPay);
  } catch (error: any) {
    console.error('Error saving payment in DB:', error);
    res.status(500).json({ error: error.message || 'Failed to save payment' });
  }
});

apiRouter.put('/payments/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const updated = await updatePaymentInDb(req.params.id, req.body);
    res.json(updated);
  } catch (error: any) {
    console.error('Error updating payment in DB:', error);
    res.status(500).json({ error: error.message || 'Failed to update payment' });
  }
});

apiRouter.delete('/payments/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    await deletePaymentFromDb(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (error: any) {
    console.error('Error deleting payment from DB:', error);
    res.status(500).json({ error: error.message || 'Failed to delete payment' });
  }
});

// Bulk Sync Endpoint (Upload all state to PostgreSQL)
apiRouter.post('/sync-all', requireAuth, async (req: AuthRequest, res) => {
  try {
    const result = await syncAllAppData(req.body);
    res.json(result);
  } catch (error: any) {
    console.warn('Bulk sync to PostgreSQL info:', error?.message || error);
    res.status(200).json({
      success: false,
      error: error?.message || 'Database not ready for bulk sync',
    });
  }
});

// Settings Endpoint
apiRouter.post('/settings', requireAuth, async (req: AuthRequest, res) => {
  try {
    await updateSettingsInDb(req.body);
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error saving settings in DB:', error);
    res.status(500).json({ error: error.message || 'Failed to save settings' });
  }
});
