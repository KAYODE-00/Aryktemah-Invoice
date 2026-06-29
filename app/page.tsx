"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Download, LogOut, FileText, User } from "lucide-react";
import { Invoice, Client, InvoiceItem } from "../lib/types";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import Link from "next/link";

export default function ArykyeemahInvoice() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const TEAM_SECRET = process.env.NEXT_PUBLIC_TEAM_SECRET || "arykyeemah2026";

  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [client, setClient] = useState<Client>({
    id: Date.now(),
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: Date.now(), description: "", quantity: 1, price: 0 }
  ]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const savedAuth = localStorage.getItem("isAuthenticated");
    if (savedAuth === "true") setIsAuthenticated(true);

    const saved = localStorage.getItem("arykyeemah-invoices");
    if (saved) setInvoices(JSON.parse(saved));
  }, []);

  const handleLogin = () => {
    if (passwordInput === TEAM_SECRET) {
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
      toast.success("Welcome to Arykyeemah Invoice Portal");
    } else {
      toast.error("Incorrect Team Secret");
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    toast.info("Logged out successfully");
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: "", quantity: 1, price: 0 }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: number, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const tax = subtotal * 0.075;
  const total = subtotal + tax;

  const saveInvoice = () => {
    if (!client.name || items.some(i => !i.description.trim())) {
      toast.error("Please fill all required fields");
      return;
    }

    const invoice: Invoice = {
      id: Date.now(),
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      client,
      items,
      taxRate: 7.5,
      notes,
    };

    const updated = [invoice, ...invoices];
    setInvoices(updated);
    localStorage.setItem("arykyeemah-invoices", JSON.stringify(updated));

    generatePDF(invoice);
    toast.success("Invoice saved successfully");

    // Reset form
    setClient({ id: Date.now(), name: "", email: "", phone: "", address: "" });
    setItems([{ id: Date.now(), description: "", quantity: 1, price: 0 }]);
    setNotes("");
  };

  const generatePDF = async (invoice: Invoice) => {
    const element = document.createElement("div");
    element.innerHTML = `
      <div style="padding:50px; font-family:Arial; max-width:800px; margin:auto; background:white; color:black;">
        <h1 style="color:#558467; text-align:center; font-size:36px;">Arykyeemah House</h1>
        <p style="text-align:center;">Premium Perfumes & Fashion</p>
        
        <div style="display:flex;justify-content:space-between;margin:40px 0;">
          <div><strong>Bill To:</strong><br/>${invoice.client.name}<br/>${invoice.client.email}<br/>${invoice.client.phone}<br/>${invoice.client.address}</div>
          <div style="text-align:right;">
            <strong>Invoice #:</strong> ${invoice.invoiceNumber}<br/>
            <strong>Date:</strong> ${invoice.date}
          </div>
        </div>

        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#558467;color:white;">
              <th style="padding:12px;text-align:left;">Description</th>
              <th style="padding:12px;text-align:right;">Qty</th>
              <th style="padding:12px;text-align:right;">Price</th>
              <th style="padding:12px;text-align:right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map(item => `
              <tr>
                <td style="padding:12px;border-bottom:1px solid #ddd;">${item.description}</td>
                <td style="padding:12px;text-align:right;border-bottom:1px solid #ddd;">${item.quantity}</td>
                <td style="padding:12px;text-align:right;border-bottom:1px solid #ddd;">₦${item.price}</td>
                <td style="padding:12px;text-align:right;border-bottom:1px solid #ddd;">₦${(item.quantity * item.price).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="text-align:right;margin-top:30px;font-size:20px;">
          <p>Total: ₦${total.toLocaleString()}</p>
        </div>
      </div>
    `;

    document.body.appendChild(element);
    const canvas = await html2canvas(element);
    document.body.removeChild(element);

    const pdf = new jsPDF("p", "pt", "a4");
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 30, 30, 530, 0);
    pdf.save(`${invoice.invoiceNumber}.pdf`);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <div className="bg-zinc-900 p-12 rounded-3xl w-full max-w-md text-center">
          <h1 className="text-5xl font-serif text-[#558467] mb-6">Arykyeemah House</h1>
          <p className="text-zinc-400 mb-8">Private Invoice Portal</p>
          
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full bg-zinc-800 p-5 rounded-2xl text-center mb-6"
            placeholder="Team Secret"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          
          <button 
            onClick={handleLogin}
            className="w-full bg-[#558467] py-4 rounded-2xl text-lg font-medium flex items-center justify-center gap-2"
          >
            <User size={20} /> Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-serif text-[#558467]">Arykyeemah tor</h1>
          <div className="flex gap-4">
            <Link 
              href="/Invoices" 
              className="flex items-center gap-2 border border-zinc-700 px-6 py-3 rounded-full hover:bg-zinc-900"
            >
              <FileText size={18} /> All Invoices
            </Link>
            <button 
              onClick={logout} 
              className="flex items-center gap-2 border border-red-500 text-red-400 px-6 py-3 rounded-full hover:bg-zinc-900"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-3xl p-10">
          <h2 className="text-3xl mb-8">Create New Invoice</h2>

          {/* Client Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <input 
              value={client.name} 
              onChange={(e) => setClient({ ...client, name: e.target.value })} 
              placeholder="Client Name *" 
              className="bg-zinc-800 p-4 rounded-2xl" 
            />
            <input 
              value={client.email} 
              onChange={(e) => setClient({ ...client, email: e.target.value })} 
              placeholder="Email Address" 
              className="bg-zinc-800 p-4 rounded-2xl" 
            />
            <input 
              value={client.phone} 
              onChange={(e) => setClient({ ...client, phone: e.target.value })} 
              placeholder="Phone Number" 
              className="bg-zinc-800 p-4 rounded-2xl" 
            />
            <input 
              value={client.address} 
              onChange={(e) => setClient({ ...client, address: e.target.value })} 
              placeholder="Address" 
              className="bg-zinc-800 p-4 rounded-2xl" 
            />
          </div>

          {/* Items */}
          <h3 className="text-xl mb-4">Invoice Items</h3>
          
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 mb-6 bg-zinc-800 p-6 rounded-2xl">
              <input 
                value={item.description} 
                onChange={(e) => updateItem(item.id, "description", e.target.value)} 
                placeholder="Item description" 
                className="flex-1 bg-zinc-900 p-4 rounded-xl" 
              />
              <input 
                type="number" 
                value={item.quantity} 
                onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)} 
                className="w-24 bg-zinc-900 p-4 rounded-xl text-center" 
              />
              <input 
                type="number" 
                value={item.price} 
                onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value) || 0)} 
                placeholder="Price" 
                className="w-40 bg-zinc-900 p-4 rounded-xl" 
              />
              <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-600">
                <Trash2 size={24} />
              </button>
            </div>
          ))}

          <button 
            onClick={addItem} 
            className="flex items-center gap-2 text-[#558467] mb-8 hover:text-[#3f5f4b]"
          >
            <Plus size={20} /> Add New Item
          </button>

          <textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            placeholder="Notes / Payment Terms / Remarks..." 
            className="w-full h-32 bg-zinc-800 p-5 rounded-2xl mb-8" 
          />

          <button 
            onClick={saveInvoice} 
            className="w-full bg-[#558467] hover:bg-[#3f5f4b] py-5 rounded-2xl text-xl font-medium flex items-center justify-center gap-3"
          >
            <Download size={24} /> Save Invoice & Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}