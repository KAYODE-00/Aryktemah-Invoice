"use client";
import { useState, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton, RedirectToSignIn } from "@clerk/nextjs";
import InvoiceForm from "@/components/InvoiceForm";
import InvoiceList from "@/components/InvoiceList";
import { Invoice } from "@/lib/types";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "sonner";

export default function Home() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("arykyeemah-invoices");
    if (saved) setInvoices(JSON.parse(saved));
  }, []);

  const saveInvoice = (invoice: Invoice) => {
    const updated = [invoice, ...invoices];
    setInvoices(updated);
    localStorage.setItem("arykyeemah-invoices", JSON.stringify(updated));
    generatePDF(invoice);
  };

  const generatePDF = async (invoice: Invoice) => {
    const element = document.createElement("div");
    element.innerHTML = `
      <div style="padding: 40px; font-family: Arial; max-width: 800px; margin: auto; background: white; color: black; border: 1px solid #ddd;">
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #558467; padding-bottom: 20px;">
          <h1 style="color: #558467; font-size: 32px; margin: 0;">Arykyeemah House</h1>
          <p style="margin: 5px 0;">Premium Perfumes & Fashion Accessories</p>
          <p>Lagos, Nigeria | +234 XXX XXX XXXX</p>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin: 30px 0;">
          <div>
            <strong>Bill To:</strong><br/>
            ${invoice.client.name}<br/>
            ${invoice.client.email}<br/>
            ${invoice.client.phone}<br/>
            ${invoice.client.address}
          </div>
          <div style="text-align: right;">
            <strong>Invoice #:</strong> ${invoice.invoiceNumber}<br/>
            <strong>Date:</strong> ${invoice.date}
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #558467; color: white;">
              <th style="padding: 12px; text-align: left;">Description</th>
              <th style="padding: 12px; text-align: right;">Qty</th>
              <th style="padding: 12px; text-align: right;">Unit Price</th>
              <th style="padding: 12px; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map(item => `
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #ddd;">${item.description}</td>
                <td style="padding: 12px; text-align: right; border-bottom: 1px solid #ddd;">${item.quantity}</td>
                <td style="padding: 12px; text-align: right; border-bottom: 1px solid #ddd;">₦${item.price.toLocaleString()}</td>
                <td style="padding: 12px; text-align: right; border-bottom: 1px solid #ddd;">₦${(item.quantity * item.price).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="text-align: right; margin-top: 30px; font-size: 18px;">
          <p>Subtotal: ₦${invoice.items.reduce((sum, i) => sum + i.quantity * i.price, 0).toLocaleString()}</p>
          <p>VAT (7.5%): ₦${(invoice.items.reduce((sum, i) => sum + i.quantity * i.price, 0) * 0.075).toFixed(0)}</p>
          <p style="font-weight: bold; color: #558467; font-size: 20px;">
            Total: ₦${(invoice.items.reduce((sum, i) => sum + i.quantity * i.price, 0) * 1.075).toFixed(0)}
          </p>
        </div>

        ${invoice.notes ? `<p style="margin-top: 40px; font-style: italic;">${invoice.notes}</p>` : ''}
        <p style="text-align: center; margin-top: 60px; color: #666;">Thank you for your continued patronage!</p>
      </div>
    `;

    document.body.appendChild(element);
    const canvas = await html2canvas(element, { scale: 2 });
    document.body.removeChild(element);

    const pdf = new jsPDF("p", "pt", "a4");
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 30, 30, 530, 0);
    pdf.save(`${invoice.invoiceNumber}.pdf`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <SignedOut>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-5xl font-serif text-[#558467] mb-6">Arykyeemah House</h1>
            <p className="text-xl mb-8">Private Invoice Portal</p>
            <SignInButton mode="modal">
              <button className="bg-[#558467] hover:bg-[#3f5f4b] px-10 py-4 rounded-xl text-lg font-medium">
                Sign in to Access
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-5xl font-serif text-[#558467]">Arykyeemah House</h1>
              <p className="text-zinc-400">Private Invoice Generator</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowList(!showList)}
                className="px-6 py-3 border border-zinc-700 rounded-full hover:bg-zinc-900"
              >
                {showList ? "New Invoice" : "View Invoices"}
              </button>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>

          {!showList ? (
            <InvoiceForm onSave={saveInvoice} />
          ) : (
            <InvoiceList invoices={invoices} />
          )}
        </div>
      </SignedIn>
    </div>
  );
}