/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { loadImageAsBase64 } from '@/src/lib/utils/imageToBase64';
import { InvoicePDFPayload } from '@/src/types';

const BUSINESS_BANK_DETAILS = {
  bank_name: 'XXXXXXXXXXX',
  account_name: 'Elite Laundry Services',
  account_number: 'XXXXXXXXXXX',
};

const INVOICE_TITLES: Record<string, string> = {
  INVOICE: 'INVOICE',
  RECEIPT: 'PAYMENT RECEIPT',
  PROFORMA: 'PROFORMA INVOICE',
  CREDIT_NOTE: 'CREDIT NOTE',
};

export const generateInvoicePDF = async ({
  invoice,
}: {
  invoice: InvoicePDFPayload;
}) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  /* ================= LOGO ================= */
  const logoBase64 = await loadImageAsBase64('/logo.png');
  doc.addImage(logoBase64, 'PNG', 14, 10, 28, 20);

  /* ================= HEADER ================= */
  doc.setFontSize(16);
  doc.text(INVOICE_TITLES[invoice.type], pageWidth / 2, 22, {
    align: 'center',
  });

  doc.setFontSize(9);
  doc.text(`Invoice #: ${invoice.invoice_number}`, 14, 38);
  doc.text(`Date: ${new Date(invoice.created_at).toLocaleDateString()}`, 14, 44);

  doc.text(`Customer: ${invoice.customer.customer_name}`, 120, 38);
  doc.text(`Phone: ${invoice.customer.customer_phone}`, 120, 44);

  /* ================= WATERMARK ================= */
  if (invoice.type === 'PROFORMA') {
    addWatermark(doc, 'PROFORMA');
  }

  if (invoice.status === 'paid') {
    addWatermark(doc, 'PAID');
  }

  if (invoice.status === 'unpaid') {
    addWatermark(doc, 'UNPAID');
  }

  /* ================= ITEMS TABLE ================= */
  autoTable(doc, {
    startY: 55,
    head: [['Item', 'Qty', 'Amount (₦)']],
    body: invoice.items.map((i: any) => [
      i.name,
      i.quantity,
      i.total.toLocaleString(),
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [34, 197, 94] },
  });

  const y = (doc as any).lastAutoTable.finalY + 8;

  /* ================= TOTALS ================= */
  doc.setFontSize(10);
  doc.text(`Subtotal: ₦${invoice.subtotal.toLocaleString()}`, 140, y);
  doc.text(`Delivery: ₦${invoice.deliveryFee.toLocaleString()}`, 140, y + 6);

  doc.setFontSize(12);
  doc.text(`Total: ₦${invoice.total.toLocaleString()}`, 140, y + 14);

  /* ================= PAYMENT INFO ================= */
  if (invoice.type === 'RECEIPT') {
    doc.setFontSize(10);
    doc.text(`Amount Paid: ₦${invoice.amount_paid?.toLocaleString()}`, 14, y + 22);
    doc.text(`Balance: ₦${invoice.balance?.toLocaleString()}`, 14, y + 28);
  }

  /* ================= BANK DETAILS (NOT FOR RECEIPT) ================= */
  if (invoice.type !== 'RECEIPT') {
    doc.setFontSize(10);
    doc.text('Bank Transfer Details', 14, y + 40);
    doc.text(`Bank: ${BUSINESS_BANK_DETAILS.bank_name}`, 14, y + 46);
    doc.text(`Account Name: ${BUSINESS_BANK_DETAILS.account_name}`, 14, y + 52);
    doc.text(`Account Number: ${BUSINESS_BANK_DETAILS.account_number}`, 14, y + 58);
  }

  /* ================= FOOTER ================= */
  doc.setFontSize(8);
  doc.text(
    'Elite Laundry Services • Quality | Speed | Care',
    pageWidth / 2,
    287,
    { align: 'center' }
  );

  doc.save(`${INVOICE_TITLES[invoice.type]}-${invoice.invoice_number}.pdf`);
};

/* ================= WATERMARK HELPER ================= */
const addWatermark = (doc: jsPDF, text: string) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setTextColor(200);
  doc.setFontSize(50);
  doc.text(text, pageWidth / 2, pageHeight / 2, {
    angle: 45,
    align: 'center',
  });
  doc.setTextColor(0);
};
