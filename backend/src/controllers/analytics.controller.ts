import { Request, Response } from 'express';
import prisma from '../prisma/client';

export async function getDashboardStats(req: Request, res: Response) {
  try {
    const totalUsers = await prisma.user.count();
    const totalPortfolios = await prisma.portfolio.count();
    
    // Aggregate activities from logs
    const totalDownloads = await prisma.analyticsLog.count({
      where: { action: 'DOWNLOAD' },
    });
    const totalGenerations = await prisma.analyticsLog.count({
      where: { action: 'GENERATE' },
    });
    const totalViews = await prisma.analyticsLog.count({
      where: { action: 'VIEW' },
    });

    // Template usage statistics
    const templates = await prisma.template.findMany({
      orderBy: { usageCount: 'desc' },
      take: 10,
    });

    const templateStats = templates.map((t) => ({
      name: t.name,
      usage: t.usageCount,
      category: t.category,
    }));

    // Recent activity log (last 20 entries)
    const logs = await prisma.analyticsLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 20,
    });

    const recentActivity = logs.map((l) => ({
      id: l.id,
      action: l.action,
      templateId: l.templateId,
      timestamp: l.timestamp,
    }));

    // Portfolio generations over time (mocked/grouped by date)
    // For a simple PostgreSQL query, we can get counts grouped by date
    const generationsByDate = await prisma.analyticsLog.groupBy({
      by: ['timestamp'],
      where: { action: 'GENERATE' },
      _count: {
        id: true,
      },
    });

    // Format dates into YYYY-MM-DD and group them
    const dateMap: { [key: string]: number } = {};
    // Seed last 7 days with 0
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      dateMap[dateStr] = 0;
    }

    generationsByDate.forEach((g) => {
      const dateStr = g.timestamp.toISOString().split('T')[0];
      if (dateMap[dateStr] !== undefined) {
        dateMap[dateStr] += g._count.id;
      }
    });

    const timelineData = Object.keys(dateMap).map((date) => ({
      date,
      generations: dateMap[date],
    }));

    return res.json({
      summary: {
        users: totalUsers,
        portfolios: totalPortfolios,
        downloads: totalDownloads,
        generations: totalGenerations,
        views: totalViews,
      },
      templateStats,
      recentActivity,
      timelineData,
    });
  } catch (error: any) {
    console.error('Dashboard stats fetch failed:', error);
    return res.status(500).json({ message: 'Failed to fetch dashboard metrics.', error: error.message });
  }
}

export async function seedTemplates(req: Request, res: Response) {
  const defaultTemplates = [
    // Developer
    { id: 'codecraft', name: 'CodeCraft', category: 'DEVELOPER', style: 'DARK', description: 'Terminal-themed profile with tabs and interactive console features.' },
    { id: 'devhub', name: 'DevHub', category: 'DEVELOPER', style: 'MODERN', description: 'Clean layout highlighting projects and skill grids.' },
    { id: 'stackfolio', name: 'Stackfolio', category: 'DEVELOPER', style: 'MINIMAL', description: 'High-contrast typography for full stack developers.' },
    // Cybersecurity
    { id: 'redteam', name: 'RedTeam', category: 'CYBERSECURITY', style: 'DARK', description: 'Cyberpunk Red aesthetic highlighting security tools and certs.' },
    { id: 'terminal', name: 'Terminal', category: 'CYBERSECURITY', style: 'DARK', description: 'Classic UNIX terminal simulator style.' },
    { id: 'matrix', name: 'Matrix', category: 'CYBERSECURITY', style: 'PREMIUM', description: 'Neo-futuristic green console theme with retro typography.' },
    // Student
    { id: 'campus', name: 'Campus', category: 'STUDENT', style: 'LIGHT', description: 'Bright design focused on coursework and academic achievements.' },
    { id: 'freshgrad', name: 'FreshGrad', category: 'STUDENT', style: 'MODERN', description: 'Showcases internships, certifications, and entry-level projects.' },
    // Designer
    { id: 'aurora', name: 'Aurora', category: 'DESIGNER', style: 'PREMIUM', description: 'Colorful mesh gradients, glassmorphism, and bold layouts.' },
    { id: 'neo', name: 'Neo', category: 'DESIGNER', style: 'MODERN', description: 'Neo-brutalist layouts with thick borders and striking accents.' },
    // Corporate
    { id: 'executive', name: 'Executive', category: 'CORPORATE', style: 'MINIMAL', description: 'Ultra-clean dark corporate layout with detailed work history.' },
    { id: 'enterprise', name: 'Enterprise', category: 'CORPORATE', style: 'LIGHT', description: 'Traditional blue-tinted professional profile for leaders.' },
    // Freelancer
    { id: 'freelancerpro', name: 'Freelancer Pro', category: 'FREELANCER', style: 'MODERN', description: 'Features a pricing page, service descriptions, and reviews.' },
    { id: 'creativestudio', name: 'Creative Studio', category: 'FREELANCER', style: 'PREMIUM', description: 'Bold layout with full-bleed imagery grids.' },
    { id: 'consultant', name: 'Consultant', category: 'FREELANCER', style: 'LIGHT', description: 'Focused on client case-studies, booking forms, and credentials.' }
  ];

  try {
    for (const t of defaultTemplates) {
      await prisma.template.upsert({
        where: { id: t.id },
        update: {
          name: t.name,
          category: t.category,
          style: t.style,
          description: t.description,
        },
        create: {
          id: t.id,
          name: t.name,
          category: t.category,
          style: t.style,
          description: t.description,
          previewImg: '',
        },
      });
    }

    return res.json({ message: 'Templates seeded successfully.' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Templates seeding failed.', error: error.message });
  }
}
