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