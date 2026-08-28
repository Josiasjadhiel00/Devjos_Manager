import { db, createPool } from './index.ts';
import * as schema from './schema.ts';
import { ensurePostgresTablesExist } from './initSchema.ts';
import { eq } from 'drizzle-orm';
import {
  initialClients,
  initialProjects,
  initialTasks,
  initialServices,
  initialQuotes,
  initialIncomes,
  initialExpenses,
  initialPayments,
  initialPhotoSessions,
  initialGalleries,
  initialMediaProjects,
  initialFiles,
  initialCalendarEvents,
  initialTeam,
  initialSettings,
} from '../data/initialData.ts';

// Helper to seed initial dataset into PostgreSQL if empty
export async function ensureDatabaseSeeded() {
  try {
    const pool = createPool();
    if (pool) {
      await ensurePostgresTablesExist(pool);
    }
    const existingClients = await db.select().from(schema.clients).limit(1);
    if (existingClients.length === 0) {
      console.log('🌱 Seeding initial DevJos Studio data to Cloud SQL PostgreSQL...');
      
      // Seed Settings
      await db.insert(schema.studioSettings).values({
        id: 'default',
        settingsJson: JSON.stringify(initialSettings),
      }).onConflictDoNothing();

      // Seed Clients
      if (initialClients.length > 0) {
        await db.insert(schema.clients).values(initialClients.map(c => ({
          id: c.id,
          name: c.name,
          company: c.company || '',
          phone: c.phone || '',
          whatsapp: c.whatsapp || '',
          email: c.email || '',
          address: c.address || '',
          instagram: c.instagram || '',
          facebook: c.facebook || '',
          website: c.website || '',
          registeredDate: c.registeredDate,
          status: c.status,
          notes: c.notes || '',
          avatar: c.avatar || '',
        }))).onConflictDoNothing();
      }

      // Seed Projects
      if (initialProjects.length > 0) {
        await db.insert(schema.projects).values(initialProjects.map(p => ({
          id: p.id,
          name: p.name,
          clientId: p.clientId,
          category: p.category,
          description: p.description || '',
          price: p.price,
          startDate: p.startDate,
          deliveryDate: p.deliveryDate,
          status: p.status,
          priority: p.priority,
          progress: p.progress,
          responsibleId: p.responsibleId || '',
          notes: p.notes || '',
          paidAmount: p.paidAmount || 0,
        }))).onConflictDoNothing();
      }

      // Seed Tasks
      if (initialTasks.length > 0) {
        await db.insert(schema.tasks).values(initialTasks.map(t => ({
          id: t.id,
          name: t.name,
          description: t.description || '',
          projectId: t.projectId,
          responsibleId: t.responsibleId || '',
          priority: t.priority,
          dueDate: t.dueDate,
          status: t.status,
        }))).onConflictDoNothing();
      }

      // Seed Services
      if (initialServices.length > 0) {
        await db.insert(schema.services).values(initialServices.map(s => ({
          id: s.id,
          name: s.name,
          category: s.category,
          description: s.description || '',
          basePrice: s.basePrice,
          minPrice: s.minPrice,
          status: s.status,
          unit: s.unit || 'Servicio',
        }))).onConflictDoNothing();
      }

      // Seed Quotes
      if (initialQuotes.length > 0) {
        await db.insert(schema.quotes).values(initialQuotes.map(q => ({
          id: q.id,
          quoteNumber: q.quoteNumber,
          clientId: q.clientId,
          issueDate: q.issueDate,
          expiryDate: q.expiryDate,
          status: q.status,
          itemsJson: JSON.stringify(q.items),
          subtotal: q.subtotal,
          discountTotal: q.discountTotal,
          taxRate: q.taxRate,
          taxAmount: q.taxAmount,
          total: q.total,
          notes: q.notes || '',
          terms: q.terms || '',
          associatedProjectId: q.associatedProjectId || '',
        }))).onConflictDoNothing();
      }

      // Seed Incomes
      if (initialIncomes.length > 0) {
        await db.insert(schema.incomes).values(initialIncomes.map(i => ({
          id: i.id,
          clientId: i.clientId,
          projectId: i.projectId || '',
          amount: i.amount,
          date: i.date,
          method: i.method,
          description: i.description || '',
          invoiceNumber: i.invoiceNumber || '',
        }))).onConflictDoNothing();
      }

      // Seed Expenses
      if (initialExpenses.length > 0) {
        await db.insert(schema.expenses).values(initialExpenses.map(e => ({
          id: e.id,
          category: e.category,
          description: e.description || '',
          amount: e.amount,
          date: e.date,
          method: e.method,
          receiptUrl: e.receiptUrl || '',
        }))).onConflictDoNothing();
      }

      // Seed Payments
      if (initialPayments.length > 0) {
        await db.insert(schema.payments).values(initialPayments.map(pay => ({
          id: pay.id,
          projectId: pay.projectId,
          clientId: pay.clientId,
          totalContract: pay.totalContract,
          advancePayment: pay.advancePayment,
          secondPayment: pay.secondPayment,
          additionalPaymentsJson: JSON.stringify(pay.additionalPayments),
          totalPaid: pay.totalPaid,
          totalPending: pay.totalPending,
          status: pay.status,
          lastPaymentDate: pay.lastPaymentDate || '',
        }))).onConflictDoNothing();
      }

      // Seed Photography Sessions
      if (initialPhotoSessions.length > 0) {
        await db.insert(schema.photoSessions).values(initialPhotoSessions.map(ps => ({
          id: ps.id,
          clientId: ps.clientId,
          projectId: ps.projectId || '',
          title: ps.title,
          date: ps.date,
          time: ps.time,
          location: ps.location || '',
          sessionType: ps.sessionType,
          photosTaken: ps.photosTaken,
          photosSelected: ps.photosSelected,
          photosEdited: ps.photosEdited,
          photosDelivered: ps.photosDelivered,
          status: ps.status,
          notes: ps.notes || '',
        }))).onConflictDoNothing();
      }

      // Seed Galleries
      if (initialGalleries.length > 0) {
        await db.insert(schema.galleries).values(initialGalleries.map(g => ({
          id: g.id,
          title: g.title,
          clientId: g.clientId,
          sessionId: g.sessionId || '',
          projectId: g.projectId || '',
          coverImage: g.coverImage || '',
          imagesJson: JSON.stringify(g.images),
          clientShared: g.clientShared,
          shareToken: g.shareToken,
          description: g.description || '',
          createdAt: g.createdAt,
        }))).onConflictDoNothing();
      }

      // Seed Media Projects
      if (initialMediaProjects.length > 0) {
        await db.insert(schema.mediaProjects).values(initialMediaProjects.map(m => ({
          id: m.id,
          title: m.title,
          clientId: m.clientId,
          projectId: m.projectId || '',
          format: m.format,
          duration: m.duration || '0:30',
          script: m.script || '',
          versionsJson: JSON.stringify(m.versions),
          currentVersion: m.currentVersion,
          status: m.status,
          notes: m.notes || '',
        }))).onConflictDoNothing();
      }

      // Seed Files
      if (initialFiles.length > 0) {
        await db.insert(schema.projectFiles).values(initialFiles.map(f => ({
          id: f.id,
          clientId: f.clientId,
          projectId: f.projectId,
          folder: f.folder,
          name: f.name,
          size: f.size || '0 KB',
          type: f.type || 'Archivo',
          uploadDate: f.uploadDate,
          url: f.url,
          nasSynced: f.nasSynced,
        }))).onConflictDoNothing();
      }

      // Seed Calendar Events
      if (initialCalendarEvents.length > 0) {
        await db.insert(schema.calendarEvents).values(initialCalendarEvents.map(evt => ({
          id: evt.id,
          title: evt.title,
          type: evt.type,
          startDate: evt.startDate,
          endDate: evt.endDate,
          time: evt.time || '',
          clientId: evt.clientId || '',
          projectId: evt.projectId || '',
          location: evt.location || '',
          description: evt.description || '',
          isCompleted: evt.isCompleted || false,
        }))).onConflictDoNothing();
      }

      // Seed Team Members
      if (initialTeam.length > 0) {
        await db.insert(schema.teamMembers).values(initialTeam.map(tm => ({
          id: tm.id,
          name: tm.name,
          email: tm.email,
          phone: tm.phone || '',
          role: tm.role,
          avatar: tm.avatar || '',
          active: tm.active,
          skillsJson: JSON.stringify(tm.skills),
          bio: tm.bio || '',
        }))).onConflictDoNothing();
      }

      console.log('✅ Cloud SQL Database successfully seeded with all initial data.');
    }
  } catch (error) {
    console.error('Warning during database seeding check:', error);
  }
}

// Fetch all database records for initial client hydrate
export async function getAllAppData() {
  try {
    await ensureDatabaseSeeded();

    const [
      settingsRows,
      clientsList,
      projectsList,
      tasksList,
      servicesList,
      quotesList,
      incomesList,
      expensesList,
      paymentsList,
      photoSessionsList,
      galleriesList,
      mediaProjectsList,
      filesList,
      calendarEventsList,
      teamList,
    ] = await Promise.all([
      db.select().from(schema.studioSettings).where(eq(schema.studioSettings.id, 'default')).catch(() => []),
      db.select().from(schema.clients).catch(() => []),
      db.select().from(schema.projects).catch(() => []),
      db.select().from(schema.tasks).catch(() => []),
      db.select().from(schema.services).catch(() => []),
      db.select().from(schema.quotes).catch(() => []),
      db.select().from(schema.incomes).catch(() => []),
      db.select().from(schema.expenses).catch(() => []),
      db.select().from(schema.payments).catch(() => []),
      db.select().from(schema.photoSessions).catch(() => []),
      db.select().from(schema.galleries).catch(() => []),
      db.select().from(schema.mediaProjects).catch(() => []),
      db.select().from(schema.projectFiles).catch(() => []),
      db.select().from(schema.calendarEvents).catch(() => []),
      db.select().from(schema.teamMembers).catch(() => []),
    ]);

    const settings = settingsRows && settingsRows[0] ? JSON.parse(settingsRows[0].settingsJson) : initialSettings;

    const quotes = (quotesList || []).map(q => ({
      ...q,
      items: JSON.parse(q.itemsJson || '[]'),
    }));

    const payments = (paymentsList || []).map(p => ({
      ...p,
      additionalPayments: JSON.parse(p.additionalPaymentsJson || '[]'),
    }));

    const galleries = (galleriesList || []).map(g => ({
      ...g,
      images: JSON.parse(g.imagesJson || '[]'),
    }));

    const mediaProjects = (mediaProjectsList || []).map(m => ({
      ...m,
      versions: JSON.parse(m.versionsJson || '[]'),
    }));

    const team = (teamList || []).map(tm => ({
      ...tm,
      skills: JSON.parse(tm.skillsJson || '[]'),
    }));

    return {
      settings,
      clients: clientsList || [],
      projects: projectsList || [],
      tasks: tasksList || [],
      services: servicesList || [],
      quotes,
      incomes: incomesList || [],
      expenses: expensesList || [],
      payments,
      photoSessions: photoSessionsList || [],
      galleries,
      mediaProjects,
      files: filesList || [],
      calendarEvents: calendarEventsList || [],
      team: team.length > 0 ? team : initialTeam,
    };
  } catch (error) {
    console.error('Database query failed in getAllAppData:', error);
    return null;
  }
}

// User upsert helper
export async function getOrCreateUser(uid: string, email: string) {
  try {
    const result = await db.insert(schema.users)
      .values({
        uid,
        email,
        role: 'Administrador',
      })
      .onConflictDoUpdate({
        target: schema.users.uid,
        set: {
          email,
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Failed to get or create user:', error);
    throw new Error('User database operation failed', { cause: error });
  }
}

// Clients operations
export async function insertClient(data: any) {
  try {
    const payload = {
      id: data.id || 'cli-' + Date.now(),
      name: data.name || '',
      company: data.company || '',
      phone: data.phone || '',
      whatsapp: data.whatsapp || '',
      email: data.email || '',
      address: data.address || '',
      instagram: data.instagram || '',
      facebook: data.facebook || '',
      website: data.website || '',
      registeredDate: data.registeredDate || new Date().toISOString().split('T')[0],
      status: data.status || 'Prospecto',
      notes: data.notes || '',
      avatar: data.avatar || '',
    };
    const result = await db.insert(schema.clients).values(payload).onConflictDoUpdate({
      target: schema.clients.id,
      set: payload,
    }).returning();
    return result[0];
  } catch (error) {
    console.error('Failed to insert client:', error);
    throw new Error('Database error inserting client', { cause: error });
  }
}

export async function updateClientInDb(id: string, data: any) {
  try {
    const payload = { ...data };
    delete payload.createdAt;
    const result = await db.update(schema.clients).set(payload).where(eq(schema.clients.id, id)).returning();
    return result[0];
  } catch (error) {
    console.error('Failed to update client:', error);
    throw new Error('Database error updating client', { cause: error });
  }
}

export async function deleteClientFromDb(id: string) {
  try {
    await db.delete(schema.clients).where(eq(schema.clients.id, id));
  } catch (error) {
    console.error('Failed to delete client:', error);
    throw new Error('Database error deleting client', { cause: error });
  }
}

// Projects operations
export async function insertProject(data: any) {
  try {
    const payload = {
      id: data.id || 'proj-' + Date.now(),
      name: data.name || '',
      clientId: data.clientId || '',
      category: data.category || 'Desarrollo',
      description: data.description || '',
      price: typeof data.price === 'number' ? data.price : (Number(data.price) || 0),
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      deliveryDate: data.deliveryDate || new Date().toISOString().split('T')[0],
      status: data.status || 'Lead',
      priority: data.priority || 'Media',
      progress: typeof data.progress === 'number' ? data.progress : (Number(data.progress) || 0),
      responsibleId: data.responsibleId || '',
      notes: data.notes || '',
      paidAmount: typeof data.paidAmount === 'number' ? data.paidAmount : (Number(data.paidAmount) || 0),
    };
    const result = await db.insert(schema.projects).values(payload).onConflictDoUpdate({
      target: schema.projects.id,
      set: payload,
    }).returning();
    return result[0];
  } catch (error) {
    console.error('Failed to insert project:', error);
    throw new Error('Database error inserting project', { cause: error });
  }
}

export async function updateProjectInDb(id: string, data: any) {
  try {
    const payload = { ...data };
    delete payload.createdAt;
    const result = await db.update(schema.projects).set(payload).where(eq(schema.projects.id, id)).returning();
    return result[0];
  } catch (error) {
    console.error('Failed to update project:', error);
    throw new Error('Database error updating project', { cause: error });
  }
}

export async function deleteProjectFromDb(id: string) {
  try {
    await db.delete(schema.projects).where(eq(schema.projects.id, id));
  } catch (error) {
    console.error('Failed to delete project:', error);
    throw new Error('Database error deleting project', { cause: error });
  }
}

// Tasks operations
export async function insertTask(data: any) {
  try {
    const payload = {
      id: data.id || 'task-' + Date.now(),
      name: data.name || '',
      description: data.description || '',
      projectId: data.projectId || '',
      responsibleId: data.responsibleId || '',
      priority: data.priority || 'Media',
      dueDate: data.dueDate || new Date().toISOString().split('T')[0],
      status: data.status || 'Pendiente',
    };
    const result = await db.insert(schema.tasks).values(payload).onConflictDoUpdate({
      target: schema.tasks.id,
      set: payload,
    }).returning();
    return result[0];
  } catch (error) {
    console.error('Failed to insert task:', error);
    throw new Error('Database error inserting task', { cause: error });
  }
}

export async function updateTaskInDb(id: string, data: any) {
  try {
    const payload = { ...data };
    delete payload.createdAt;
    const result = await db.update(schema.tasks).set(payload).where(eq(schema.tasks.id, id)).returning();
    return result[0];
  } catch (error) {
    console.error('Failed to update task:', error);
    throw new Error('Database error updating task', { cause: error });
  }
}

export async function deleteTaskFromDb(id: string) {
  try {
    await db.delete(schema.tasks).where(eq(schema.tasks.id, id));
  } catch (error) {
    console.error('Failed to delete task:', error);
    throw new Error('Database error deleting task', { cause: error });
  }
}

// Quotes operations
export async function insertQuote(data: any) {
  try {
    const payload = {
      id: data.id || 'quo-' + Date.now(),
      quoteNumber: data.quoteNumber || 'COT-' + Date.now(),
      clientId: data.clientId || '',
      issueDate: data.issueDate || new Date().toISOString().split('T')[0],
      expiryDate: data.expiryDate || new Date().toISOString().split('T')[0],
      status: data.status || 'Borrador',
      itemsJson: typeof data.itemsJson === 'string' ? data.itemsJson : JSON.stringify(data.items || []),
      subtotal: typeof data.subtotal === 'number' ? data.subtotal : (Number(data.subtotal) || 0),
      discountTotal: typeof data.discountTotal === 'number' ? data.discountTotal : (Number(data.discountTotal) || 0),
      taxRate: typeof data.taxRate === 'number' ? data.taxRate : (Number(data.taxRate) || 0.18),
      taxAmount: typeof data.taxAmount === 'number' ? data.taxAmount : (Number(data.taxAmount) || 0),
      total: typeof data.total === 'number' ? data.total : (Number(data.total) || 0),
      notes: data.notes || '',
      terms: data.terms || '',
      associatedProjectId: data.associatedProjectId || '',
    };
    const result = await db.insert(schema.quotes).values(payload).onConflictDoUpdate({
      target: schema.quotes.id,
      set: payload,
    }).returning();
    return {
      ...result[0],
      items: JSON.parse(result[0].itemsJson || '[]'),
    };
  } catch (error) {
    console.error('Failed to insert quote:', error);
    throw new Error('Database error inserting quote', { cause: error });
  }
}

export async function updateQuoteInDb(id: string, data: any) {
  try {
    const payload = { ...data };
    if (data.items) {
      payload.itemsJson = JSON.stringify(data.items);
      delete payload.items;
    }
    delete payload.createdAt;
    const result = await db.update(schema.quotes).set(payload).where(eq(schema.quotes.id, id)).returning();
    return {
      ...result[0],
      items: JSON.parse(result[0].itemsJson || '[]'),
    };
  } catch (error) {
    console.error('Failed to update quote:', error);
    throw new Error('Database error updating quote', { cause: error });
  }
}

export async function deleteQuoteFromDb(id: string) {
  try {
    await db.delete(schema.quotes).where(eq(schema.quotes.id, id));
  } catch (error) {
    console.error('Failed to delete quote:', error);
    throw new Error('Database error deleting quote', { cause: error });
  }
}

// Incomes & Expenses operations
export async function insertIncome(data: any) {
  try {
    const payload = {
      id: data.id || 'inc-' + Date.now(),
      clientId: data.clientId || '',
      projectId: data.projectId || '',
      amount: typeof data.amount === 'number' ? data.amount : (Number(data.amount) || 0),
      date: data.date || new Date().toISOString().split('T')[0],
      method: data.method || 'Transferencia',
      description: data.description || '',
      invoiceNumber: data.invoiceNumber || '',
    };
    const result = await db.insert(schema.incomes).values(payload).onConflictDoUpdate({
      target: schema.incomes.id,
      set: payload,
    }).returning();
    return result[0];
  } catch (error) {
    console.error('Failed to insert income:', error);
    throw new Error('Database error inserting income', { cause: error });
  }
}

export async function deleteIncomeFromDb(id: string) {
  try {
    await db.delete(schema.incomes).where(eq(schema.incomes.id, id));
  } catch (error) {
    console.error('Failed to delete income:', error);
    throw new Error('Database error deleting income', { cause: error });
  }
}

export async function insertExpense(data: any) {
  try {
    const payload = {
      id: data.id || 'exp-' + Date.now(),
      category: data.category || 'Otros',
      description: data.description || '',
      amount: typeof data.amount === 'number' ? data.amount : (Number(data.amount) || 0),
      date: data.date || new Date().toISOString().split('T')[0],
      method: data.method || 'Transferencia',
      receiptUrl: data.receiptUrl || '',
    };
    const result = await db.insert(schema.expenses).values(payload).onConflictDoUpdate({
      target: schema.expenses.id,
      set: payload,
    }).returning();
    return result[0];
  } catch (error) {
    console.error('Failed to insert expense:', error);
    throw new Error('Database error inserting expense', { cause: error });
  }
}

export async function deleteExpenseFromDb(id: string) {
  try {
    await db.delete(schema.expenses).where(eq(schema.expenses.id, id));
  } catch (error) {
    console.error('Failed to delete expense:', error);
    throw new Error('Database error deleting expense', { cause: error });
  }
}

// Services operations
export async function insertService(data: any) {
  try {
    const payload = {
      id: data.id || 'srv-' + Date.now(),
      name: data.name || '',
      category: data.category || 'Desarrollo',
      description: data.description || '',
      basePrice: typeof data.basePrice === 'number' ? data.basePrice : (Number(data.basePrice) || 0),
      minPrice: typeof data.minPrice === 'number' ? data.minPrice : (Number(data.minPrice) || 0),
      status: data.status || 'Activo',
      unit: data.unit || 'Servicio',
    };
    const result = await db.insert(schema.services).values(payload).onConflictDoUpdate({
      target: schema.services.id,
      set: payload,
    }).returning();
    return result[0];
  } catch (error) {
    console.error('Failed to insert service:', error);
    throw new Error('Database error inserting service', { cause: error });
  }
}

export async function updateServiceInDb(id: string, data: any) {
  try {
    const payload = { ...data };
    delete payload.createdAt;
    const result = await db.update(schema.services).set(payload).where(eq(schema.services.id, id)).returning();
    return result[0];
  } catch (error) {
    console.error('Failed to update service:', error);
    throw new Error('Database error updating service', { cause: error });
  }
}

export async function deleteServiceFromDb(id: string) {
  try {
    await db.delete(schema.services).where(eq(schema.services.id, id));
  } catch (error) {
    console.error('Failed to delete service:', error);
    throw new Error('Database error deleting service', { cause: error });
  }
}

// Payments operations
export async function insertPayment(data: any) {
  try {
    const payload = {
      id: data.id || 'pay-' + Date.now(),
      projectId: data.projectId || '',
      clientId: data.clientId || '',
      totalContract: typeof data.totalContract === 'number' ? data.totalContract : (Number(data.totalContract) || 0),
      advancePayment: typeof data.advancePayment === 'number' ? data.advancePayment : (Number(data.advancePayment) || 0),
      secondPayment: typeof data.secondPayment === 'number' ? data.secondPayment : (Number(data.secondPayment) || 0),
      additionalPaymentsJson: typeof data.additionalPaymentsJson === 'string' ? data.additionalPaymentsJson : JSON.stringify(data.additionalPayments || []),
      totalPaid: typeof data.totalPaid === 'number' ? data.totalPaid : (Number(data.totalPaid) || 0),
      totalPending: typeof data.totalPending === 'number' ? data.totalPending : (Number(data.totalPending) || 0),
      status: data.status || 'Pendiente',
      lastPaymentDate: data.lastPaymentDate || '',
    };
    const result = await db.insert(schema.payments).values(payload).onConflictDoUpdate({
      target: schema.payments.id,
      set: payload,
    }).returning();
    return {
      ...result[0],
      additionalPayments: JSON.parse(result[0].additionalPaymentsJson || '[]'),
    };
  } catch (error) {
    console.error('Failed to insert payment:', error);
    throw new Error('Database error inserting payment', { cause: error });
  }
}

export async function updatePaymentInDb(id: string, data: any) {
  try {
    const payload: any = { ...data };
    if (data.additionalPayments) {
      payload.additionalPaymentsJson = JSON.stringify(data.additionalPayments);
      delete payload.additionalPayments;
    }
    delete payload.createdAt;
    const result = await db.update(schema.payments).set(payload).where(eq(schema.payments.id, id)).returning();
    return {
      ...result[0],
      additionalPayments: JSON.parse(result[0].additionalPaymentsJson || '[]'),
    };
  } catch (error) {
    console.error('Failed to update payment:', error);
    throw new Error('Database error updating payment', { cause: error });
  }
}

export async function deletePaymentFromDb(id: string) {
  try {
    await db.delete(schema.payments).where(eq(schema.payments.id, id));
  } catch (error) {
    console.error('Failed to delete payment:', error);
    throw new Error('Database error deleting payment', { cause: error });
  }
}

// Bulk Sync full app data into PostgreSQL
export async function syncAllAppData(data: any) {
  try {
    if (data.settings) {
      await updateSettingsInDb(data.settings);
    }
    if (Array.isArray(data.clients) && data.clients.length > 0) {
      for (const client of data.clients) {
        await insertClient(client);
      }
    }
    if (Array.isArray(data.projects) && data.projects.length > 0) {
      for (const project of data.projects) {
        await insertProject(project);
      }
    }
    if (Array.isArray(data.tasks) && data.tasks.length > 0) {
      for (const task of data.tasks) {
        await insertTask(task);
      }
    }
    if (Array.isArray(data.services) && data.services.length > 0) {
      for (const service of data.services) {
        await insertService(service);
      }
    }
    if (Array.isArray(data.quotes) && data.quotes.length > 0) {
      for (const quote of data.quotes) {
        await insertQuote(quote);
      }
    }
    if (Array.isArray(data.payments) && data.payments.length > 0) {
      for (const pay of data.payments) {
        await insertPayment(pay);
      }
    }
    if (Array.isArray(data.incomes) && data.incomes.length > 0) {
      for (const inc of data.incomes) {
        await insertIncome(inc);
      }
    }
    if (Array.isArray(data.expenses) && data.expenses.length > 0) {
      for (const exp of data.expenses) {
        await insertExpense(exp);
      }
    }
    return { success: true };
  } catch (error) {
    console.error('Failed to sync all app data:', error);
    throw new Error('Database sync all failed', { cause: error });
  }
}

// Settings update
export async function updateSettingsInDb(settings: any) {
  try {
    await db.insert(schema.studioSettings).values({
      id: 'default',
      settingsJson: JSON.stringify(settings),
    }).onConflictDoUpdate({
      target: schema.studioSettings.id,
      set: {
        settingsJson: JSON.stringify(settings),
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Failed to update settings:', error);
    throw new Error('Database error updating settings', { cause: error });
  }
}
