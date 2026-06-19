import { Router } from 'express';
import { signup, login, getProfile } from '../controllers/auth.controller';
import { parseResume } from '../controllers/resume.controller';
import {
  createPortfolio,
  getPortfolioBySlug,
  getMyPortfolios,
  updatePortfolio,
  deletePortfolio,
  checkSlugAvailability,
  aiImproveBio,
  aiEnhanceProject,
  fetchGitHubRepos,
  logDownload,
} from '../controllers/portfolio.controller';
import { getDashboardStats, seedTemplates } from '../controllers/analytics.controller';
import { authenticateJWT, requireAuth, requireAdmin } from '../middleware/auth.middleware';
import upload from '../middleware/upload.middleware';

const router = Router();

// Auth Routes
router.post('/auth/signup', signup);
router.post('/auth/login', login);
router.get('/auth/profile', authenticateJWT, requireAuth, getProfile);

// Resume Route
router.post('/resume/parse', upload.single('resume'), parseResume);

// Portfolio Routes
router.post('/portfolios', authenticateJWT, createPortfolio);
router.get('/portfolios/my', authenticateJWT, requireAuth, getMyPortfolios);
router.put('/portfolios/:id', authenticateJWT, requireAuth, updatePortfolio);
router.delete('/portfolios/:id', authenticateJWT, requireAuth, deletePortfolio);
router.get('/portfolios/check-slug/:slug', checkSlugAvailability);
router.get('/portfolios/slug/:slug', getPortfolioBySlug);

// AI & Github Integrations
router.post('/portfolios/ai/improve-bio', authenticateJWT, aiImproveBio);
router.post('/portfolios/ai/enhance-project', authenticateJWT, aiEnhanceProject);
router.get('/portfolios/github/repos/:username', fetchGitHubRepos);
router.post('/portfolios/download/log', logDownload);

// Analytics & Template Seeding Routes
router.get('/analytics/dashboard', authenticateJWT, requireAuth, requireAdmin, getDashboardStats);
router.post('/analytics/seed-templates', seedTemplates);

export default router;
