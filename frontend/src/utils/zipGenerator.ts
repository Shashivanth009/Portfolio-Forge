import JSZip from 'jszip';
import { PortfolioData } from '../context/store';
import axios from 'axios';

// Import template source files as raw text using Vite's ?raw import syntax
import developerTemplatesRaw from '../templates/developerTemplates.tsx?raw';
import securityTemplatesRaw from '../templates/securityTemplates.tsx?raw';
import studentTemplatesRaw from '../templates/studentTemplates.tsx?raw';
import designerTemplatesRaw from '../templates/designerTemplates.tsx?raw';
import corporateTemplatesRaw from '../templates/corporateTemplates.tsx?raw';
import freelancerTemplatesRaw from '../templates/freelancerTemplates.tsx?raw';
import registryRaw from '../templates/registry.ts?raw';
import rendererCodeRaw from '../templates/rendererCode.ts?raw';

const storeTypes = `
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
  level: number;
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
`;

export async function generatePortfolioZip(portfolioData: PortfolioData): Promise<Blob> {
  // Safe JSZip constructor instantiation handling both ESM and CommonJS structures in Vite
  const JSZipConstructor = (JSZip as any).default || JSZip;
  const zip = new JSZipConstructor();

  // 1. Root Level configuration files
  zip.file('package.json', JSON.stringify({
    name: `portfolioforge-${portfolioData.slug}`,
    private: true,
    version: '1.0.0',
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'tsc && vite build',
      preview: 'vite preview'
    },
    dependencies: {
      react: '^18.2.0',
      'react-dom': '^18.2.0',
      'lucide-react': '^0.331.0'
    },
    devDependencies: {
      '@types/react': '^18.2.56',
      '@types/react-dom': '^18.2.19',
      '@vitejs/plugin-react': '^4.2.1',
      autoprefixer: '^10.4.17',
      postcss: '^8.4.35',
      tailwindcss: '^3.4.1',
      typescript: '^5.2.2',
      vite: '^5.1.3'
    }
  }, null, 2));

  zip.file('vite.config.ts', `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
`);

  zip.file('tailwind.config.js', `
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`);

  zip.file('postcss.config.js', `
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`);

  zip.file('tsconfig.json', `
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
`);

  zip.file('index.html', `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔥</text></svg>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${portfolioData.seoConfig?.metaTitle || portfolioData.title || 'My Portfolio'}</title>
    <meta name="description" content="${portfolioData.seoConfig?.metaDescription || 'My professional portfolio'}" />
    <meta name="keywords" content="${(portfolioData.seoConfig?.keywords || []).join(', ')}" />
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Outfit:wght@400;700&family=JetBrains+Mono&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`);

  // 2. SEO Configurations
  zip.file('robots.txt', `
User-agent: *
Allow: /
Sitemap: https://${portfolioData.slug}.vercel.app/sitemap.xml
`);

  zip.file('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://${portfolioData.slug}.vercel.app/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`);

  // 3. Deployment support configurations
  zip.file('vercel.json', JSON.stringify({
    cleanUrls: true,
    rewrites: [{ source: '/(.*)', destination: '/index.html' }]
  }, null, 2));

  zip.file('netlify.toml', `
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`);

  // 4. Source folder
  const srcFolder = zip.folder('src');
  if (srcFolder) {
    srcFolder.file('main.tsx', `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`);

    srcFolder.file('index.css', `
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: ${portfolioData.themeConfig.backgroundColor || '#0f172a'};
  color: #f1f5f9;
  font-family: 'Inter', sans-serif;
  margin: 0;
}
`);

    // Write context folder and mock store
    const contextFolder = srcFolder.folder('context');
    if (contextFolder) {
      contextFolder.file('store.ts', storeTypes);
    }

    // Write original templates folder
    const templatesFolder = srcFolder.folder('templates');
    if (templatesFolder) {
      templatesFolder.file('developerTemplates.tsx', developerTemplatesRaw);
      templatesFolder.file('securityTemplates.tsx', securityTemplatesRaw);
      templatesFolder.file('studentTemplates.tsx', studentTemplatesRaw);
      templatesFolder.file('designerTemplates.tsx', designerTemplatesRaw);
      templatesFolder.file('corporateTemplates.tsx', corporateTemplatesRaw);
      templatesFolder.file('freelancerTemplates.tsx', freelancerTemplatesRaw);
      templatesFolder.file('registry.ts', registryRaw);
      templatesFolder.file('rendererCode.ts', rendererCodeRaw);
    }

    // Dynamic compilation of entrypoint template router
    srcFolder.file('App.tsx', `
import React from 'react';
import portfolioData from './portfolioData.json';
import { TEMPLATE_REGISTRY } from './templates/registry';

export default function App() {
  const data = portfolioData;
  const template = TEMPLATE_REGISTRY[data.templateId] || TEMPLATE_REGISTRY['codecraft'];
  const TemplateComponent = template.component;

  return (
    <TemplateComponent data={data} />
  );
}
`);

    // Dynamic user customization configuration JSON
    srcFolder.file('portfolioData.json', JSON.stringify(portfolioData, null, 2));
  }

  // 5. Documentation README
  zip.file('README.md', `
# Professional Portfolio - ${portfolioData.personalInfo.fullName || 'Graduate'}

This portfolio project was automatically generated using **PortfolioForge**.

## Getting Started Locally

Install dependencies and start development server:

\`\`\`bash
# Install packages
npm install

# Start Vite server
npm run dev
\`\`\`

Open [http://localhost:5173](http://localhost:5173) in your browser to inspect the output.

## Production Build

To bundle the application for production deployment:

\`\`\`bash
npm run build
\`\`\`

This creates a \`dist/\` folder containing production assets ready to deploy anywhere.

## Deploying

### Deploy to Vercel (Recommended)
1. Commit this folder to a GitHub repository.
2. Link the project inside your [Vercel Dashboard](https://vercel.com).
3. The configuration \`vercel.json\` handles route-rewriting automatically.

### Deploy to Netlify
1. Connect repository to [Netlify Dashboard](https://netlify.com).
2. Set build directory to \`dist\` and run command to \`npm run build\`.
`);

  // Trigger download metrics log asynchronously
  // Using a self-contained catch on the promise to avoid unhandled rejection issues
  axios.post('/api/portfolios/download/log', { templateId: portfolioData.templateId })
    .catch((err) => {
      console.warn('Logging download activity failed', err.message || err);
    });

  return await zip.generateAsync({ type: 'blob' });
}
