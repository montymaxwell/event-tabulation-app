export type Status = 'error' | 'success' | 'warn'

export type ClientResponse = {
  status: Status,
  message: string
}

export type User = {
  id: string,
  created_at?: Date,
  updated_at?: Date,
  email: string,
  username: string | null,
}

export type Criteria = {
  name: string,
  minScore: number,
  maxScore: number
}

export type Candidate = {
  id: string,
  name: string,
  gender: 'male' | 'female',
  image: string | null,
  position: string,
}

export type EventData = {
  id: string,
  name: string,
  owner: string,
  location: string,
  description: string,
  criteriaList: Array<Criteria>,
  candidateList: Array<Candidate>
}
