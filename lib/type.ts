export type Client = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
};

export type InvoiceItem = {
  id: number;
  description: string;
  quantity: number;
  price: number;
};

export type Invoice = {
  id: number;
  invoiceNumber: string;
  date: string;
  client: Client;
  items: InvoiceItem[];
  taxRate: number;
  notes?: string;
};