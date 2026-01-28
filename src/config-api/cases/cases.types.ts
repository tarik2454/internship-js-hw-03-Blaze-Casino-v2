export type Case = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  items: never[];
};

export type CasesResponse = {
  cases: Case[];
};

export type CaseItem = {
  id: string;
  name: string;
  rarity: string;
  value: number;
  chance: number;
};

export type CaseResponse = {
  id: string;
  name: string;
  price: number;
  items: CaseItem[];
};

export type CaseOpeningItem = {
  id: string;
  name: string;
  rarity: string;
  image: string;
  value: number;
};

export type CaseOpeningResponse = {
  openingId: string;
  item: CaseOpeningItem;
  serverSeed: string;
  clientSeed: string;
  nonce: number;
  roll: number;
  newBalance: number;
  casePrice: number;
  itemValue: number;
};

export type CaseOpening = {
  id: string;
  createdAt: string;
  caseName: string;
  casePrice: number;
  itemName: string;
  itemValue: number;
  itemRarity: string;
  itemImage: string;
  profit: number;
};

export type CaseUserHistoryResponse = {
  openings: CaseOpening[];
};
