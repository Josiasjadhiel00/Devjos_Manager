import { formatCurrency } from './formatCurrency';

/**
 * WhatsApp Helper Utilities for DevJos Studio Suite
 */

export function cleanPhoneNumber(phone: string): string {
  // Remove non-numeric characters except leading +
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // If starts with +, remove +
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }
  
  // If 10 digits (Dominican/US format e.g. 8095551234), prepend 1
  if (cleaned.length === 10) {
    cleaned = '1' + cleaned;
  }
  
  return cleaned;
}

export function openWhatsAppChat(phone: string, message: string = '') {
  const cleanNumber = cleanPhoneNumber(phone);
  if (!cleanNumber) {
    alert('El cliente no tiene un número telefónico o WhatsApp configurado.');
    return;
  }
  const encodedText = encodeURIComponent(message);
  const url = `https://wa.me/${cleanNumber}${encodedText ? `?text=${encodedText}` : ''}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function createQuoteWhatsAppMessage(
  clientName: string,
  quoteNumber: string,
  total: number,
  currency: string = 'DOP',
  studioName: string = 'DevJos Studio'
): string {
  const formattedTotal = formatCurrency(total, currency, { includeCode: true });
  return `¡Hola ${clientName}! 👋 Te saludamos desde *${studioName}*.\n\nTe compartimos los detalles de tu Cotización *${quoteNumber}* por un valor total de *${formattedTotal}*.\n\nPuedes revisarla, aprobarla y firmarla en línea en tu portal interactivo.\n\n¿Tienes alguna duda o te gustaría iniciar de inmediato? Quedamos a tu entera disposición. 🚀`;
}

export function getWhatsAppQuoteUrl(
  quote: { quoteNumber: string; total: number },
  client: { name: string; phone?: string; whatsapp?: string } | null | undefined,
  currency: string = 'DOP',
  studioName: string = 'DevJos Studio'
): string {
  const phone = client?.whatsapp || client?.phone || '';
  const cleanNumber = cleanPhoneNumber(phone);
  const message = createQuoteWhatsAppMessage(
    client?.name || 'Cliente',
    quote.quoteNumber,
    quote.total,
    currency,
    studioName
  );
  const encodedText = encodeURIComponent(message);
  return cleanNumber ? `https://wa.me/${cleanNumber}?text=${encodedText}` : `https://wa.me/?text=${encodedText}`;
}

export function createPaymentReminderWhatsAppMessage(
  clientName: string,
  projectName: string,
  pendingAmount: number,
  currency: string = 'DOP',
  studioName: string = 'DevJos Studio'
): string {
  const formattedPending = formatCurrency(pendingAmount, currency, { includeCode: true });
  return `¡Hola ${clientName}! 👋 Desde *${studioName}* te recordamos el saldo pendiente de *${formattedPending}* correspondiente al proyecto *${projectName}*.\n\nCualquier consulta con los métodos de pago estamos a la orden. ¡Gracias por confiar en nosotros! ✨`;
}

export function createPaymentReceiptWhatsAppMessage(
  clientName: string,
  projectName: string,
  paidAmount: number,
  remainingAmount: number,
  currency: string = 'DOP',
  studioName: string = 'DevJos Studio'
): string {
  const formattedPaid = formatCurrency(paidAmount, currency, { includeCode: true });
  const formattedRemaining = formatCurrency(remainingAmount, currency, { includeCode: true });
  return `¡Hola ${clientName}! 🎉 Confirmamos con éxito la recepción de tu pago por *${formattedPaid}* para el proyecto *${projectName}*.\n\n${
    remainingAmount > 0 
      ? `Saldo restante por pagar: *${formattedRemaining}*` 
      : '✅ ¡Proyecto 100% saldado y liquidado!'
  }\n\n¡Gracias por tu pago a *${studioName}*!`;
}
