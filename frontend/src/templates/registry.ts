import React from 'react';
import { CodeCraft, DevHub, Stackfolio, VivePortfolio } from './developerTemplates';
import { RedTeam, Terminal, Matrix } from './securityTemplates';
import { Campus, FreshGrad } from './studentTemplates';
import { Aurora, Neo } from './designerTemplates';
import { Executive, Enterprise } from './corporateTemplates';
import { FreelancerPro, CreativeStudio, Consultant } from './freelancerTemplates';
import { getRendererCode } from './rendererCode';

export interface TemplateMetadata {
  id: string;
  name: string;
  category: 'DEVELOPER' | 'CYBERSECURITY' | 'STUDENT' | 'DESIGNER' | 'CORPORATE' | 'FREELANCER';
  style: 'MINIMAL' | 'MODERN' | 'DARK' | 'LIGHT' | 'PREMIUM';
  description: string;
  component: React.ComponentType<{ data: any }>;
  sourceCode: string;
}

export const TEMPLATE_REGISTRY: Record<string, TemplateMetadata> = {
  codecraft: {
    id: 'codecraft',
    name: 'CodeCraft',
    category: 'DEVELOPER',
    style: 'DARK',
    description: 'Terminal-themed profile with tabs and interactive console features.',
    component: CodeCraft,
    sourceCode: 'CODECRAFT_SOURCE'
  },
  devhub: {
    id: 'devhub',
    name: 'DevHub',
    category: 'DEVELOPER',
    style: 'MODERN',
    description: 'Clean layout highlighting projects and skill grids.',
    component: DevHub,
    sourceCode: 'DEVHUB_SOURCE'
  },
  stackfolio: {
    id: 'stackfolio',
    name: 'Stackfolio',
    category: 'DEVELOPER',
    style: 'MINIMAL',
    description: 'High-contrast typography for full stack developers.',
    component: Stackfolio,
    sourceCode: 'STACKFOLIO_SOURCE'
  },
  viveportfolio: {
    id: 'viveportfolio',
    name: 'VivePortfolio',
    category: 'DEVELOPER',
    style: 'LIGHT',
    description: 'Minimalistic cream-paper layout with dynamic typing effects and badges.',
    component: VivePortfolio,
    sourceCode: 'VIVEPORTFOLIO_SOURCE'
  },
  redteam: {
    id: 'redteam',
    name: 'RedTeam',
    category: 'CYBERSECURITY',
    style: 'DARK',
    description: 'Cyberpunk Red aesthetic highlighting security tools and certs.',
    component: RedTeam,
    sourceCode: 'REDTEAM_SOURCE'
  },
  terminal: {
    id: 'terminal',
    name: 'Terminal',
    category: 'CYBERSECURITY',
    style: 'DARK',
    description: 'Classic UNIX terminal simulator style.',
    component: Terminal,
    sourceCode: 'TERMINAL_SOURCE'
  },
  matrix: {
    id: 'matrix',
    name: 'Matrix',
    category: 'CYBERSECURITY',
    style: 'PREMIUM',
    description: 'Neo-futuristic green console theme with retro typography.',
    component: Matrix,
    sourceCode: 'MATRIX_SOURCE'
  },
  campus: {
    id: 'campus',
    name: 'Campus',
    category: 'STUDENT',
    style: 'LIGHT',
    description: 'Bright design focused on coursework and academic achievements.',
    component: Campus,
    sourceCode: 'CAMPUS_SOURCE'
  },
  freshgrad: {
    id: 'freshgrad',
    name: 'FreshGrad',
    category: 'STUDENT',
    style: 'MODERN',
    description: 'Showcases internships, certifications, and entry-level projects.',
    component: FreshGrad,
    sourceCode: 'FRESHGRAD_SOURCE'
  },
  aurora: {
    id: 'aurora',
    name: 'Aurora',
    category: 'DESIGNER',
    style: 'PREMIUM',
    description: 'Colorful mesh gradients, glassmorphism, and bold layouts.',
    component: Aurora,
    sourceCode: 'AURORA_SOURCE'
  },
  neo: {
    id: 'neo',
    name: 'Neo',
    category: 'DESIGNER',
    style: 'MODERN',
    description: 'Neo-brutalist layouts with thick borders and striking accents.',
    component: Neo,
    sourceCode: 'NEO_SOURCE'
  },
  executive: {
    id: 'executive',
    name: 'Executive',
    category: 'CORPORATE',
    style: 'MINIMAL',
    description: 'Ultra-clean dark corporate layout with detailed work history.',
    component: Executive,
    sourceCode: 'EXECUTIVE_SOURCE'
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    category: 'CORPORATE',
    style: 'LIGHT',
    description: 'Traditional blue-tinted professional profile for leaders.',
    component: Enterprise,
    sourceCode: 'ENTERPRISE_SOURCE'
  },
  freelancerpro: {
    id: 'freelancerpro',
    name: 'Freelancer Pro',
    category: 'FREELANCER',
    style: 'MODERN',
    description: 'Features a pricing page, service descriptions, and reviews.',
    component: FreelancerPro,
    sourceCode: 'FREELANCERPRO_SOURCE'
  },
  creativestudio: {
    id: 'creativestudio',
    name: 'Creative Studio',
    category: 'FREELANCER',
    style: 'PREMIUM',
    description: 'Bold layout with full-bleed imagery grids.',
    component: CreativeStudio,
    sourceCode: 'CREATIVESTUDIO_SOURCE'
  },
  consultant: {
    id: 'consultant',
    name: 'Consultant',
    category: 'FREELANCER',
    style: 'LIGHT',
    description: 'Focused on client case-studies, booking forms, and credentials.',
    component: Consultant,
    sourceCode: 'CONSULTANT_SOURCE'
  }
};

// Helper function to fetch the source template code for JSZip generation
export function getTemplateSource(templateId: string): string {
  const rendererCode = getRendererCode(templateId);
  const header = [
    "import React from 'react';",
    "import portfolioData from './portfolioData.json';",
    "import { Terminal, Code, Cpu, FolderGit2, Mail, ExternalLink, Calendar, GraduationCap, Award, ShieldAlert, Shield, Server, FileText, ChevronRight, BookOpen, Compass, Globe, MapPin, Sparkles, Palette, Layers, Link2, Monitor, Briefcase, CheckCircle, BadgeCheck, DollarSign, Grid } from 'lucide-react';",
    '',
    '// Render Chosen Template: ' + templateId,
    'export default function App() {',
    '  const data = portfolioData;',
    '  const dynamicStyles = {',
    "    '--primary': data.themeConfig.primaryColor,",
    "    '--secondary': data.themeConfig.secondaryColor,",
    "    '--accent': data.themeConfig.accentColor,",
    "    '--bg': data.themeConfig.backgroundColor,",
    "    '--radius': data.themeConfig.borderRadius,",
    '  };',
    '  const getFontClass = (font) => {',
    "    if (font === 'mono') return 'font-mono';",
    "    if (font === 'display') return 'font-display';",
    "    return 'font-sans';",
    '  };',
    '  return (',
    '    <div style={dynamicStyles} className={`min-h-screen ${getFontClass(data.themeConfig.fontFamily)}`}>',
    '      <TemplateRenderer data={data} id="' + templateId + '" />',
    '    </div>',
    '  );',
    '}',
    '',
    'function TemplateRenderer({ data, id }) {',
    '  const { personalInfo, socials, education, experience, projects, skills, certifications, achievements, themeConfig, sectionsOrder } = data;',
    '  ' + rendererCode,
    '}',
  ].join('\n');
  return header;
}
