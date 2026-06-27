"use client";
import { useState } from "react";
import { Plus, Trash2, Download } from "lucide-react";
import { Client, InvoiceItem, Invoice } from "@/lib/types";
import { toast } from "sonner";

type Props = {
  onSave: (invoice: Invoice) => void;
};

export default function InvoiceForm({ onSave }: Props) {
  const [client, setClient] = useState<Client>({
    id: Date.now(),
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: Date.now(), description: "", quantity: 1, price: 0 },
  ]);
  const [notes, setNotes] = useState("");
  const [taxRate] = useState(7.5);

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: "", quantity: 1, price: 0 }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: number, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const tax = (subtotal * taxRate) / 100;
  const total = subtotal + tax;

  const handleSubmit = () => {
    if (!client.name || items.some(i => !i.description)) {
      toast.error("Please fill all required fields");
      return;
    }

    const invoice: Invoice = {
      id: Date.now(),
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      client,
      items,
      taxRate,
      notes,
    };

    onSave(invoice);
    toast.success("Invoice saved successfully!");
    
    // Reset form
    setClient({ id: Date.now(), name: "", email: "", phone: "", address: "" });
    setItems([{ id: Date.now(), description: "", quantity: 1, price: 0 }]);
    setNotes("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-[#558467]">Arykyeemah House</h1>
          <p className="text-zinc-400">Premium Perfumes & Fashion</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-zinc-400">Invoice Generator</p>
        </div>
      </div>

      {/* Client Info */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Client Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Client Name *"
            value={client.name}
            onChange={(e) => setClient({ ...client, name: e.target.value })}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3"
          />
          <input
            placeholder="Email"
            type="email"
            value={client.email}
            onChange={(e) => setClient({ ...client, email: e.target.value })}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3"
          />
          <input
            placeholder="Phone"
            value={client.phone}
            onChange={(e) => setClient({ ...client, phone: e.target.value })}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3"
          />
          <input
            placeholder="Address"
            value={client.address}
            onChange={(e) => setClient({ ...client, address: e.target.value })}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3"
          />
        </div>
      </div>

      {/* Items */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Invoice Items</h2>
          <button
            onClick={addItem}
            className="flex items-center gap-2 bg-[#558467] text-white px-4 py-2 rounded-lg hover:bg-[#3f5f4b]"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>

        <table className="w-full invoice-table">
          <thead>
            <tr className="bg-zinc-800">
              <th className="text-left">Description</th>
              <th className="text-right">Qty</th>
              <th className="text-right">Price (₦)</th>
              <th className="text-right">Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td>
                  <input
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 w-full"
                    placeholder="Item description"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                    className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 w-20 text-right"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value) || 0)}
                    className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 w-28 text-right"
                  />
                </td>
                <td className="text-right font-medium">
                  ₦{(item.quantity * item.price).toLocaleString()}
                </td>
                <td>
                  {items.length > 1 && (
                    <button onClick={() => removeItem(item.id)} className="text-red-500">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <label className="block mb-2 text-sm">Notes / Terms</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-24 bg-zinc-800 border border-zinc-700 rounded-xl p-4"
            placeholder="Thank you for your business..."
          />
        </div>

        <div className="md:w-80 bg-zinc-800 rounded-2xl p-6 border border-zinc-700">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>VAT (7.5%)</span>
              <span>₦{tax.toFixed(0)}</span>
            </div>
            <div className="border-t border-zinc-700 pt-3 flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-[#558467]">₦{total.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full mt-6 bg-[#558467] hover:bg-[#3f5f4b] text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" /> Save & Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}