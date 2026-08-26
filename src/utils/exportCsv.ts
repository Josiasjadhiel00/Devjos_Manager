/**
 * CSV / Excel Export Utility for DevJos Studio Suite
 * Includes UTF-8 BOM so Excel opens Spanish accents (ñ, tildes) correctly.
 */

import { Client, Project, Task, Income, Expense, ProjectPayment, Quote } from '../types';

function triggerCsvDownload(csvContent: string, fileName: string) {
  // \uFEFF is UTF-8 Byte Order Mark for Excel
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCsvField(field: any): string {
  if (field === null || field === undefined) return '""';
  const stringified = String(field).replace(/"/g, '""');
  return `"${stringified}"`;
}

export function exportFinancesToCsv(
  incomes: Income[],
  expenses: Expense[],
  clients: Client[],
  projects: Project[]
) {
  const headers = ['Tipo', 'ID', 'Fecha', 'Categoría / Detalle', 'Cliente / Tercero', 'Proyecto', 'Método de Pago', 'Monto'];
  const rows: string[][] = [headers];

  incomes.forEach((inc) => {
    const client = clients.find((c) => c.id === inc.clientId);
    const project = projects.find((p) => p.id === inc.projectId);
    rows.push([
      'Ingreso (+)',
      inc.id,
      inc.date,
      inc.description,
      client ? `${client.name} (${client.company})` : 'N/A',
      project ? project.name : 'N/A',
      inc.method,
      inc.amount.toFixed(2),
    ]);
  });

  expenses.forEach((exp) => {
    rows.push([
      'Gasto (-)',
      exp.id,
      exp.date,
      `${exp.category} - ${exp.description}`,
      'Proveedor / Gasto Operativo',
      'General',
      exp.method,
      (-exp.amount).toFixed(2),
    ]);
  });

  const csvContent = rows.map((r) => r.map(escapeCsvField).join(',')).join('\r\n');
  const dateStr = new Date().toISOString().split('T')[0];
  triggerCsvDownload(csvContent, `DevJos_Finanzas_Ingresos_Gastos_${dateStr}.csv`);
}

export function exportClientsToCsv(clients: Client[]) {
  const headers = ['ID', 'Nombre', 'Empresa', 'Email', 'Teléfono', 'WhatsApp', 'Dirección', 'Instagram', 'Web', 'Estado', 'Fecha Registro'];
  const rows: string[][] = [headers];

  clients.forEach((c) => {
    rows.push([
      c.id,
      c.name,
      c.company || '',
      c.email,
      c.phone || '',
      c.whatsapp || '',
      c.address || '',
      c.instagram || '',
      c.website || '',
      c.status,
      c.registeredDate,
    ]);
  });

  const csvContent = rows.map((r) => r.map(escapeCsvField).join(',')).join('\r\n');
  const dateStr = new Date().toISOString().split('T')[0];
  triggerCsvDownload(csvContent, `DevJos_Directorio_Clientes_${dateStr}.csv`);
}

export function exportProjectsToCsv(projects: Project[], clients: Client[]) {
  const headers = ['ID', 'Proyecto', 'Cliente', 'Categoría', 'Presupuesto', 'Cobrado', 'Pendiente', 'Estado', 'Prioridad', 'Progreso (%)', 'Fecha Inicio', 'Fecha Entrega'];
  const rows: string[][] = [headers];

  projects.forEach((p) => {
    const client = clients.find((c) => c.id === p.clientId);
    const pending = Math.max(0, p.price - (p.paidAmount || 0));
    rows.push([
      p.id,
      p.name,
      client ? `${client.name} (${client.company})` : 'N/A',
      p.category,
      p.price.toFixed(2),
      (p.paidAmount || 0).toFixed(2),
      pending.toFixed(2),
      p.status,
      p.priority,
      `${p.progress}%`,
      p.startDate,
      p.deliveryDate,
    ]);
  });

  const csvContent = rows.map((r) => r.map(escapeCsvField).join(',')).join('\r\n');
  const dateStr = new Date().toISOString().split('T')[0];
  triggerCsvDownload(csvContent, `DevJos_Proyectos_Control_${dateStr}.csv`);
}

export function exportPaymentsToCsv(payments: ProjectPayment[], projects: Project[], clients: Client[]) {
  const headers = ['ID', 'Proyecto', 'Cliente', 'Total Contrato', 'Anticipo Pagado', 'Total Abonado', 'Saldo Pendiente', 'Estado de Pago', 'Último Pago'];
  const rows: string[][] = [headers];

  payments.forEach((pay) => {
    const project = projects.find((p) => p.id === pay.projectId);
    const client = clients.find((c) => c.id === pay.clientId);
    rows.push([
      pay.id,
      project?.name || 'N/A',
      client ? `${client.name} (${client.company})` : 'N/A',
      pay.totalContract.toFixed(2),
      pay.advancePayment.toFixed(2),
      pay.totalPaid.toFixed(2),
      pay.totalPending.toFixed(2),
      pay.status,
      pay.lastPaymentDate || 'Sin registros',
    ]);
  });

  const csvContent = rows.map((r) => r.map(escapeCsvField).join(',')).join('\r\n');
  const dateStr = new Date().toISOString().split('T')[0];
  triggerCsvDownload(csvContent, `DevJos_Facturas_Cobros_${dateStr}.csv`);
}
