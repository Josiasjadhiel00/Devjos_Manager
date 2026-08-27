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
      db.select().from(schema.studioSettings).where(eq(schema.studioSettings.id, 'default')),
      db.select().from(schema.clients),
      db.select().from(schema.projects),
      db.select().from(schema.tasks),
      db.select().from(schema.services),
      db.select().from(schema.quotes),
      db.select().from(schema.incomes),
      db.select().from(schema.expenses),
      db.select().from(schema.payments),
      db.select().from(schema.photoSessions),
      db.select().from(schema.galleries),
      db.select().from(schema.mediaProjects),
      db.select().from(schema.projectFiles),
      db.select().from(schema.calendarEvents),
      db.select().from(schema.teamMembers),
    ]);

    const settings = settingsRows[0] ? JSON.parse(settingsRows[0].settingsJson) : initialSettings;

    const quotes = quotesList.map(q => ({
      ...q,
      items: JSON.parse(q.itemsJson || '[]'),
    }));

    const payments = paymentsList.map(p => ({
      ...p,
      additionalPayments: JSON.parse(p.additionalPaymentsJson || '[]'),
    }));

    const galleries = galleriesList.map(g => ({
      ...g,
      images: JSON.parse(g.imagesJson || '[]'),
    }));

    const mediaProjects = mediaProjectsList.map(m => ({
      ...m,
      versions: JSON.parse(m.versionsJson || '[]'),
    }));

    const team = teamList.map(tm => ({
      ...tm,
      skills: JSON.parse(tm.skillsJson || '[]'),
    }));

    return {
      settings,
      clients: clientsList,
      projects: projectsList,
      tasks: tasksList,
      services: servicesList,
      quotes,
      incomes: incomesList,
      expenses: expensesList,
      payments,
      photoSessions: photoSessionsList,
      galleries,
      mediaProjects,
      files: filesList,
      calendarEvents: calendarEventsList,
      team,
    };
  } catch (error) {
    console.error('Database query failed in getAllAppData:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
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
    const result = await db.insert(schema.clients).values(data).returning();
    return result[0];
  } catch (error) {
    console.error('Failed to insert client:', error);
    throw new Error('Database error inserting client', { cause: error });
  }
}

export async function updateClientInDb(id: string, data: any) {
  try {
    const result = await db.update(schema.clients).set(data).where(eq(schema.clients.id, id)).returning();
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
    const result = await db.insert(schema.projects).values(data).returning();
    return result[0];
  } catch (error) {
    console.error('Failed to insert project:', error);
    throw new Error('Database error inserting project', { cause: error });
  }
}

export async function updateProjectInDb(id: string, data: any) {
  try {
    const result = await db.update(schema.projects).set(data).where(eq(schema.projects.id, id)).returning();
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
    const result = await db.insert(schema.tasks).values(data).returning();
    return result[0];
  } catch (error) {
    console.error('Failed to insert task:', error);
    throw new Error('Database error inserting task', { cause: error });
  }
}

export async function updateTaskInDb(id: string, data: any) {
  try {
    const result = await db.update(schema.tasks).set(data).where(eq(schema.tasks.id, id)).returning();
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
      ...data,
      itemsJson: JSON.stringify(data.items || []),
    };
    delete payload.items;
    const result = await db.insert(schema.quotes).values(payload).returning();
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
    const result = await db.insert(schema.incomes).values(data).returning();
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
    const result = await db.insert(schema.expenses).values(data).returning();
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
