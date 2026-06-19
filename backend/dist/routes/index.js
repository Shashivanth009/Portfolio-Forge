"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const resume_controller_1 = require("../controllers/resume.controller");
const portfolio_controller_1 = require("../controllers/portfolio.controller");
const analytics_controller_1 = require("../controllers/analytics.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload_middleware_1 = __importDefault(require("../middleware/upload.middleware"));
const router = (0, express_1.Router)();
// Auth Routes
router.post('/auth/signup', auth_controller_1.signup);
router.post('/auth/login', auth_controller_1.login);
router.get('/auth/profile', auth_middleware_1.authenticateJWT, auth_middleware_1.requireAuth, auth_controller_1.getProfile);
// Resume Route
router.post('/resume/parse', upload_middleware_1.default.single('resume'), resume_controller_1.parseResume);
// Portfolio Routes
router.post('/portfolios', auth_middleware_1.authenticateJWT, portfolio_controller_1.createPortfolio);
router.get('/portfolios/my', auth_middleware_1.authenticateJWT, auth_middleware_1.requireAuth, portfolio_controller_1.getMyPortfolios);
router.put('/portfolios/:id', auth_middleware_1.authenticateJWT, auth_middleware_1.requireAuth, portfolio_controller_1.updatePortfolio);
router.delete('/portfolios/:id', auth_middleware_1.authenticateJWT, auth_middleware_1.requireAuth, portfolio_controller_1.deletePortfolio);
router.get('/portfolios/check-slug/:slug', portfolio_controller_1.checkSlugAvailability);
router.get('/portfolios/slug/:slug', portfolio_controller_1.getPortfolioBySlug);
// AI & Github Integrations
router.post('/portfolios/ai/improve-bio', auth_middleware_1.authenticateJWT, portfolio_controller_1.aiImproveBio);
router.post('/portfolios/ai/enhance-project', auth_middleware_1.authenticateJWT, portfolio_controller_1.aiEnhanceProject);
router.get('/portfolios/github/repos/:username', portfolio_controller_1.fetchGitHubRepos);
router.post('/portfolios/download/log', portfolio_controller_1.logDownload);
// Analytics & Template Seeding Routes
router.get('/analytics/dashboard', auth_middleware_1.authenticateJWT, auth_middleware_1.requireAuth, auth_middleware_1.requireAdmin, analytics_controller_1.getDashboardStats);
router.post('/analytics/seed-templates', analytics_controller_1.seedTemplates);
exports.default = router;
