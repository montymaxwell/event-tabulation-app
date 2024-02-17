export type User = {
  id: string;
  email: string;
};

export type Judge = {
  id: string;
  name: string;
  evalutation: any;
};

export type Event = {
  id: string;
  name: string;
  location: string;
  description: string;
};

export type EventData = Event & {
  createdAt: Date;
  updatedAt: Date;
  judges: Array<string>;
  candidates: Array<Candidate>;
  criteria: Array<Criteria>;
};

export type Criteria = {
  name: string;
  minScore: number;
  maxScore: number;
};

export type Candidate = {
  id: string;
  name: string;
  position: string;
  image: string;
};

export namespace Supabase {
  export type Events = Array<Event>;

  export type Event = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    location: string;
    description: string;
    owner: string;
    candidates: JSON;
    criteria: JSON;
  };
}
