"use client";
import { Invoice } from "@/lib/types";

export default function InvoiceList({ invoices }: { invoices: Invoice[] }) {
  return (
    <div className="bg-zinc-900 rounded-2xl p-8">
      <h2 className="text-2xl mb-6">Saved Invoices</h2>
      {invoices.length === 0 ? (
        <p className="text-zinc-400">No invoices yet. Create one above.</p>
      ) : (
        <div className="space-y-4">
          {invoices.map((inv) => (
            <div key={inv.id} className="flex justify-between bg-zinc-800 p-5 rounded-xl">
              <div>
                <p className="font-mono">{inv.invoiceNumber}</p>
                <p className="text-zinc-400">{inv.client.name}</p>
              </div>
              <div className="text-right">
                <p className="text-[#558467] font-semibold">
                  ₦{inv.items.reduce((s, i) => s + i.quantity * i.price, 0) * 1.075}
                </p>
                <p className="text-sm text-zinc-500">{inv.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}