import { create } from 'zustand';

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  avatarUrl: string;
}

export interface Socials {
  github: string;
  linkedin: string;
  portfolio: string;
  twitter: string;
}

export interface Education {
  degree: string;
  college: string;
  year: string;
  grade: string;
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  githubLink: string;
  liveLink: string;
}

export interface Skill {
  name: string;
  category: 'technical' | 'soft';
  level: number; // 1-5
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface Achievement {
  title: string;
  description: string;
  date: string;
}

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  fontFamily: string;
  borderRadius: string;
}

export interface SeoConfig {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export interface PortfolioData {
  id?: string;
  title: string;
  slug: string;
  templateId: string;
  personalInfo: PersonalInfo;
  socials: Socials;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: Skill[];
  certifications: Certification[];
  achievements: Achievement[];
  themeConfig: ThemeConfig;
  sectionsOrder: string[];
  seoConfig: SeoConfig;
}

interface AppState {
  // Auth state
  user: { id: string; name: string; email: string; role: string } | null;
  token: string | null;
  setAuth: (user: any, token: string | null) => void;
  logout: () => void;

  // Portfolio Builder State
  portfolio: PortfolioData;
  setPortfolio: (portfolio: Partial<PortfolioData>) => void;
  resetPortfolio: () => void;
  
  // Section Reordering
  setSectionsOrder: (order: string[]) => void;
  
  // Helpers
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const initialPortfolio: PortfolioData = {
  title: 'My Professional Portfolio',
  slug: 'new-portfolio',
  templateId: 'viveportfolio',
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    avatarUrl: '',
  },
  socials: {
    github: '',
    linkedin: '',
    portfolio: '',
    twitter: '',
  },
  education: [],
  experience: [],
  projects: [],
  skills: [],
  certifications: [],
  achievements: [],
  themeConfig: {
    primaryColor: '#3b82f6', // blue-500
    secondaryColor: '#10b981', // emerald-500
    accentColor: '#fbbf24', // amber-400
    backgroundColor: '#0f172a', // slate-900
    fontFamily: 'sans',
    borderRadius: '8px',
  },
  sectionsOrder: ['hero', 'about', 'skills', 'projects', 'experience', 'contact'],
  seoConfig: {
    metaTitle: 'My Portfolio website',
    metaDescription: 'Welcome to my professional developer portfolio.',
    keywords: ['portfolio', 'resume', 'skills', 'experience'],
  },
};

export const useStore = create<AppState>((set) => ({
  // Auth Store
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  token: localStorage.getItem('token') || null,
  setAuth: (user, token) => {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  // Builder Store
  portfolio: initialPortfolio,
  setPortfolio: (updates) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        ...updates,
        // Deep merge only personalInfo, socials, themeConfig, seoConfig
        // Arrays (education, experience, projects, skills, certifications, achievements)
        // are replaced directly via ...updates above — no merging needed
        personalInfo: updates.personalInfo
          ? { ...state.portfolio.personalInfo, ...updates.personalInfo }
          : state.portfolio.personalInfo,
        socials: updates.socials
          ? { ...state.portfolio.socials, ...updates.socials }
          : state.portfolio.socials,
        themeConfig: updates.themeConfig
          ? { ...state.portfolio.themeConfig, ...updates.themeConfig }
          : state.portfolio.themeConfig,
        seoConfig: updates.seoConfig
          ? { ...state.portfolio.seoConfig, ...updates.seoConfig }
          : state.portfolio.seoConfig,
      },
    })),
  resetPortfolio: () => set({ portfolio: initialPortfolio }),
  setSectionsOrder: (order) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        sectionsOrder: order,
      },
    })),

  // Global State
  loading: false,
  setLoading: (loading) => set({ loading }),
  error: null,
  setError: (error) => set({ error }),
}));
