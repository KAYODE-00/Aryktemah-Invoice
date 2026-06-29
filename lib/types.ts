export type ProposalItem = {
  id: number;
  service: string;
  description: string;
  price: number;
};

export type Proposal = {
  id: number;
  proposalNumber: string;
  date: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  items: ProposalItem[];
  notes: string;
};

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