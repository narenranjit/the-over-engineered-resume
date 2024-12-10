export interface Tenure {
  start: number;
  end?: number;
}

export interface Role {
  name: string;
  tenure: Tenure;
  description?: string;
  achievements?: string[];
}

export interface Title {
  name: string;
  tenure: Tenure;
  role: Role[];
}

export interface Job {
  companyName: string;
  titles: Array<Title | Role>;
}

export interface PersonalProject {
  name: string;
  description: string;
  techStack?: string[];
  link?: string;
}

export interface Education {
  degree: string;
  institution: string;
  date: Tenure;
}

export interface Resume {
  name: string;
  contact: string[];
  summary: string;
  experience: Job[];
  education: Education[];
  projects: PersonalProject[];
}
