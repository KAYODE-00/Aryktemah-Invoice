"use client";

import { useEffect, useState } from "react";
import { Invoice } from "../../lib/types";   // ← Relative import fix
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
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-serif text-[#558467]">All Invoices</h1>
          <Link 
            href="/" 
            className="text-[#558467] hover:underline flex items-center gap-2"
          >
            ← Back to New Invoice
          </Link>
        </div>

        {invoices.length === 0 ? (
          <div className="bg-zinc-900 rounded-3xl p-20 text-center">
            <p className="text-zinc-400 text-xl">No invoices found yet.</p>
            <p className="text-zinc-500 mt-2">Create your first invoice from the home page.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {invoices.map((invoice) => {
              const total = invoice.items.reduce((sum: number, i: any) => 
                sum + (i.quantity || 1) * i.price, 0
              ) * 1.075;

              return (
                <div 
                  key={invoice.id} 
                  className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl flex justify-between items-center hover:border-[#558467] transition-colors"
                >
                  <div>
                    <p className="font-mono text-lg text-[#558467]">{invoice.invoiceNumber}</p>
                    <p className="text-2xl mt-2">{invoice.client.name}</p>
                    <p className="text-zinc-400 text-sm mt-1">{invoice.date}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-3xl font-semibold text-[#558467]">
                      ₦{total.toLocaleString()}
                    </p>
                    <p className="text-sm text-zinc-500">VAT Inclusive</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}