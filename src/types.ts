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

export type SnapshotSpaceType = {
  id: string;
  name: string;
  network: string;
  networks: string[];
  categories: string[];
  proposals: number;
  votes: number;
  followers: number;
};

export type Proposal = {
  id: string;
  snapshot: string;
  author: string;
  title: string;
  body: string;
  link: string;
  state: string;
  choices: string[];
  scores: number[];
  space: {
    id: string;
  };
  strategies: {
    name: string;
  };
  symbol: string;
};
