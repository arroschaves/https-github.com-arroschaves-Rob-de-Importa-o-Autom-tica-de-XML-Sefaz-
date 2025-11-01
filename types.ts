
export type Message = {
  role: 'user' | 'model';
  content: string;
};

export type Client = {
  id: string;
  name: string;
  type: 'CPF' | 'CNPJ';
  identifier: string;
};
