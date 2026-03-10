export interface Project {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image: string;
  featured?: boolean;
  liveUrl?: string;
  repoUrl?: string;
  date: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  readingTime?: string;
}

export interface Skill {
  name: string;
  category: string;
  level?: number;
}
