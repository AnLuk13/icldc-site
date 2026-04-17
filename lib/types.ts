export interface MultilingualText {
  ro: string;
  ru: string;
  en: string;
}

export interface Project {
  id: string;
  name: MultilingualText | string;
  description: MultilingualText | string;
  status: "ongoing" | "completed" | "planned";
  startDate?: Date;
  endDate?: Date;
  partners?: Partner[]; // Resolved Partner objects
  documents?: string[]; // Firebase Storage URLs
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Partner {
  id: string;
  name: MultilingualText | string;
  description?: MultilingualText | string;
  logo?: string; // Firebase Storage URL
  website?: string;
  projects?: Project[]; // Resolved Project objects
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Event {
  id: string;
  name: MultilingualText | string;
  description?: MultilingualText | string;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  organizer?: string;
  registrationLink?: string;
  bannerImage?: string; // Firebase Storage URL
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface News {
  id: string;
  name: MultilingualText | string;
  content: MultilingualText | string;
  summary?: MultilingualText | string;
  author?: string;
  documents?: string[]; // Firebase Storage URLs
  category?: string;
  tags?: string[];
  bannerImage?: string; // Firebase Storage URL
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  id?: string;
  email: string;
  password?: string; // Hashed password
  name?: string;
  role?: "admin" | "editor";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface HomeContent {
  id: string;
  heroTitle: MultilingualText;
  heroSubtitle: MultilingualText;
  heroDescription: MultilingualText;
  aboutTitle: MultilingualText;
  aboutContent: MultilingualText;
  metaTitle: MultilingualText;
  metaDescription: MultilingualText;
  heroImage?: string; // Base64 encoded image
  aboutImage?: string; // Base64 encoded image
  createdAt: string;
  updatedAt: string;
}

export type Language = "ro" | "ru" | "en";
