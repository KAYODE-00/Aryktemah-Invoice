"use client";

import { useEffect, useState } from "react";
import { Invoice } from "@/lib/types";
import Link from "next/link";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("arykyeemah-invoices");
    if (saved) {
      setInvoices(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-serif text-[#558467]">All Invoices</h1>
        <Link href="/" className="text-[#558467] hover:underline">
          ← Back to New Invoice
        </Link>
      </div>

      {invoices.length === 0 ? (
        <p className="text-zinc-400 text-center py-20">No invoices found yet.</p>
      ) : (
        <div className="grid gap-6">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 flex justify-between items-center">
              <div>
                <p className="font-mono text-lg">{invoice.invoiceNumber}</p>
                <p className="text-xl mt-1">{invoice.client.name}</p>
                <p className="text-zinc-400 text-sm">{invoice.date}</p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-semibold text-[#558467]">
                  ₦{invoice.items.reduce((sum, i) => sum + i.quantity * i.price, 0) * 1.075}
                </p>
                <p className="text-sm text-zinc-500">VAT Inclusive</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}