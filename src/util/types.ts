export interface Job {
  company: string;
  roles: {
    title: string;
    date: string;
    description: string;
    achievements: string[];
  }[];
}

export interface Tenure {
  start: number;
  end?: number;
}

export interface Role {
  title: string;
  tenure: Tenure;
  description?: string;
  achievements?: string[];
}

export interface Title {
  name: string;
  role: Role[];
}

export interface JobNew {
  companyName: string;
  titles: Array<Title | Role>;
}

export interface Education {
  degree: string;
  institution: string;
  date: string;
}

export interface Project {
  name: string;
  description: string;
  techStack?: string;
}
export interface Resume {
  name: string;
  contact: string[];
  summary: string;
  experience: Job[];
  education: Education[];
  projects: Project[];
}
