"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPortfolio = createPortfolio;
exports.getPortfolioBySlug = getPortfolioBySlug;
exports.getMyPortfolios = getMyPortfolios;
exports.updatePortfolio = updatePortfolio;
exports.deletePortfolio = deletePortfolio;
exports.checkSlugAvailability = checkSlugAvailability;
exports.aiImproveBio = aiImproveBio;
exports.aiEnhanceProject = aiEnhanceProject;
exports.fetchGitHubRepos = fetchGitHubRepos;
exports.logDownload = logDownload;
const axios_1 = __importDefault(require("axios"));
const client_1 = __importDefault(require("../prisma/client"));
const gemini_1 = require("../services/gemini");
async function createPortfolio(req, res) {
    const { title, slug, personalInfo, socials, education, experience, projects, skills, certifications, achievements, templateId, themeConfig, sectionsOrder, seoConfig, } = req.body;
    if (!title || !slug || !templateId) {
        return res.status(400).json({ message: 'Title, slug, and templateId are required.' });
    }
    const userId = req.user?.id || null;
    try {
        const existingPortfolio = await client_1.default.portfolio.findUnique({ where: { slug } });
        if (existingPortfolio) {
            return res.status(409).json({ message: 'Slug is already in use.' });
        }
        const portfolio = await client_1.default.portfolio.create({
            data: {
                title,
                slug,
                userId,
                personalInfo: personalInfo || {},
                socials: socials || {},
                education: education || [],
                experience: experience || [],
                projects: projects || [],
                skills: skills || [],
                certifications: certifications || [],
                achievements: achievements || [],
                templateId,
                themeConfig: themeConfig || {},
                sectionsOrder: sectionsOrder || ['hero', 'about', 'skills', 'projects', 'experience', 'contact'],
                seoConfig: seoConfig || { metaTitle: title, metaDescription: '', keywords: [] },
            },
        });
        return res.status(201).json(portfolio);
    }
    catch (error) {
        console.error('Create portfolio error:', error);
        return res.status(500).json({ message: 'Failed to create portfolio.', error: error.message });
    }
}
async function getPortfolioBySlug(req, res) {
    const { slug } = req.params;
    try {
        const portfolio = await client_1.default.portfolio.findUnique({
            where: { slug },
        });
        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found.' });
        }
        // Log the view to analytics
        try {
            await client_1.default.analyticsLog.create({
                data: {
                    action: 'VIEW',
                    templateId: portfolio.templateId,
                },
            });
        }
        catch (dbErr) {
            console.warn('Analytics logging failed:', dbErr);
        }
        return res.json(portfolio);
    }
    catch (error) {
        console.error('Get portfolio error:', error);
        return res.status(500).json({ message: 'Failed to fetch portfolio.', error: error.message });
    }
}
async function getMyPortfolios(req, res) {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const portfolios = await client_1.default.portfolio.findMany({
            where: { userId: req.user.id },
            orderBy: { updatedAt: 'desc' },
        });
        return res.json(portfolios);
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to fetch your portfolios.', error: error.message });
    }
}
async function updatePortfolio(req, res) {
    const { id } = req.params;
    const { title, slug, personalInfo, socials, education, experience, projects, skills, certifications, achievements, templateId, themeConfig, sectionsOrder, seoConfig, } = req.body;
    try {
        const portfolio = await client_1.default.portfolio.findUnique({ where: { id } });
        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found.' });
        }
        // Check permissions
        if (portfolio.userId && portfolio.userId !== req.user?.id) {
            return res.status(403).json({ message: 'You do not have permission to update this portfolio.' });
        }
        // If slug is changing, verify it is unique
        if (slug && slug !== portfolio.slug) {
            const existingSlug = await client_1.default.portfolio.findUnique({ where: { slug } });
            if (existingSlug) {
                return res.status(409).json({ message: 'Slug is already in use.' });
            }
        }
        const updatedPortfolio = await client_1.default.portfolio.update({
            where: { id },
            data: {
                title: title || portfolio.title,
                slug: slug || portfolio.slug,
                personalInfo: personalInfo || portfolio.personalInfo,
                socials: socials || portfolio.socials,
                education: education || portfolio.education,
                experience: experience || portfolio.experience,
                projects: projects || portfolio.projects,
                skills: skills || portfolio.skills,
                certifications: certifications || portfolio.certifications,
                achievements: achievements || portfolio.achievements,
                templateId: templateId || portfolio.templateId,
                themeConfig: themeConfig || portfolio.themeConfig,
                sectionsOrder: sectionsOrder || portfolio.sectionsOrder,
                seoConfig: seoConfig || portfolio.seoConfig,
            },
        });
        return res.json(updatedPortfolio);
    }
    catch (error) {
        console.error('Update portfolio error:', error);
        return res.status(500).json({ message: 'Failed to update portfolio.', error: error.message });
    }
}
async function deletePortfolio(req, res) {
    const { id } = req.params;
    try {
        const portfolio = await client_1.default.portfolio.findUnique({ where: { id } });
        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found.' });
        }
        if (portfolio.userId && portfolio.userId !== req.user?.id) {
            return res.status(403).json({ message: 'You do not have permission to delete this portfolio.' });
        }
        await client_1.default.portfolio.delete({ where: { id } });
        return res.json({ message: 'Portfolio deleted successfully.' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to delete portfolio.', error: error.message });
    }
}
async function checkSlugAvailability(req, res) {
    const { slug } = req.params;
    try {
        const portfolio = await client_1.default.portfolio.findUnique({ where: { slug } });
        return res.json({ available: !portfolio });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to check slug.', error: error.message });
    }
}
// AI operations
async function aiImproveBio(req, res) {
    const { bio, targetRole } = req.body;
    if (!bio || !targetRole) {
        return res.status(400).json({ message: 'Bio and targetRole are required.' });
    }
    try {
        const improved = await (0, gemini_1.improveBio)(bio, targetRole);
        return res.json({ bio: improved });
    }
    catch (error) {
        return res.status(500).json({ message: 'AI enhancement failed.', error: error.message });
    }
}
async function aiEnhanceProject(req, res) {
    const { title, description, technologies } = req.body;
    if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required.' });
    }
    try {
        const enhanced = await (0, gemini_1.enhanceProjectDescription)(title, description, technologies || []);
        return res.json({ description: enhanced });
    }
    catch (error) {
        return res.status(500).json({ message: 'AI project enhancement failed.', error: error.message });
    }
}
// GitHub Repositories Fetching
async function fetchGitHubRepos(req, res) {
    const { username } = req.params;
    try {
        const response = await axios_1.default.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`, {
            headers: {
                'User-Agent': 'PortfolioForge-App',
            },
        });
        const repos = response.data.map((repo) => ({
            title: repo.name,
            description: repo.description || '',
            technologies: repo.language ? [repo.language] : [],
            githubLink: repo.html_url,
            liveLink: repo.homepage || '',
            stars: repo.stargazers_count,
            forks: repo.forks_count,
        }));
        return res.json(repos);
    }
    catch (error) {
        console.error('GitHub API error:', error.message || error);
        return res.status(500).json({
            message: 'Failed to fetch repositories from GitHub.',
            error: error.response?.data?.message || error.message,
        });
    }
}
// Log Portfolio Downloads
async function logDownload(req, res) {
    const { templateId } = req.body;
    try {
        // Record download activity
        await client_1.default.analyticsLog.create({
            data: {
                action: 'DOWNLOAD',
                templateId,
            },
        });
        if (templateId) {
            // Increment usage count of the template if it exists
            await client_1.default.template.updateMany({
                where: { id: templateId },
                data: {
                    usageCount: {
                        increment: 1,
                    },
                },
            });
        }
        return res.json({ message: 'Download logged successfully.' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to log download.', error: error.message });
    }
}
