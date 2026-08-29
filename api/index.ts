import express from 'express';
import { apiRouter } from '../src/apiRouter';
import { ensureDatabaseSeeded } from '../src/db/queries';

const app = express();
app.use(express.json());

// Run light seed/table check lazily on first request
let isInitialized = false;
app.use(async (req, res, next) => {
  if (!isInitialized) {
    try {
      await ensureDatabaseSeeded();
      isInitialized = true;
    } catch (e) {
      console.error('Vercel cold-start db initialization check:', e);
    }
  }
  next();
});

// Mount router on both /api and root to handle any Vercel URL rewrite behavior
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;
