type strategy = {
  name: string;
  network: string;
  params: any;
};

export type space = {
  id: string;
  name: string;
  about: string;
  network: string;
  symbol: string;
  strategies: strategy[];
  admins: string[];
  moderators: string[];
  members: string[];
  filters: {
    minScore: number;
    onlyMembers: boolean;
  };
  plugins: any;
};
