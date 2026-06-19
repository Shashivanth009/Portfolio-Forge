"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.structureResumeText = structureResumeText;
exports.improveBio = improveBio;
exports.enhanceProjectDescription = enhanceProjectDescription;
const axios_1 = __importDefault(require("axios"));
const MODEL_NAME = 'gemini-1.5-flash';
function getApiKey() {
    return process.env.GEMINI_API_KEY || '';
}
async function structureResumeText(rawText, pdfLinks = []) {
    const apiKey = getApiKey();
    if (!apiKey) {
        console.warn('⚠️  GEMINI_API_KEY is not set in backend/.env — using regex fallback parser.');
        console.warn('⚠️  Add your free Gemini key at https://aistudio.google.com for accurate parsing.');
        return enhancedFallbackParser(rawText, pdfLinks);
    }
    const systemPrompt = `You are an expert resume parser. Extract ALL information from the resume text below and return it as a single valid JSON object. Be thorough — extract every project, every skill, every job, every certification mentioned.

RULES:
- Return ONLY raw JSON, no markdown, no code blocks, no comments
- Extract every single skill mentioned anywhere in the resume
- Extract every project with its full description and all technologies
- Write the bio as 2-3 sentences summarizing the person's profile
- For skills level: 5 = expert, 4 = proficient, 3 = intermediate, 2 = beginner
- If a field is not found, use empty string "" or empty array []

JSON structure to return:
{
  "personalInfo": {
    "fullName": "full name",
    "email": "email",
    "phone": "phone number",
    "location": "city, state/country",
    "bio": "2-3 sentence professional summary",
    "avatarUrl": ""
  },
  "socials": {
    "github": "full github URL or empty",
    "linkedin": "full linkedin URL or empty",
    "portfolio": "personal website URL or empty",
    "twitter": ""
  },
  "education": [
    { "degree": "degree name", "college": "institution name", "year": "graduation year", "grade": "GPA or percentage or empty" }
  ],
  "experience": [
    { "company": "company name", "role": "job title", "duration": "date range", "description": "responsibilities and achievements" }
  ],
  "projects": [
    { "title": "project name", "description": "what it does and results", "technologies": ["tech1", "tech2"], "githubLink": "", "liveLink": "" }
  ],
  "skills": [
    { "name": "skill name", "category": "technical", "level": 4 }
  ],
  "certifications": [
    { "name": "cert name", "issuer": "issuing org", "date": "date", "url": "" }
  ],
  "achievements": [
    { "title": "achievement", "description": "details", "date": "" }
  ]
}

Resume text to parse:
`;
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;
        console.log('Calling Gemini API to parse resume...');
        let fullPrompt = systemPrompt + rawText;
        if (pdfLinks && pdfLinks.length > 0) {
            fullPrompt = systemPrompt + `\nExtracted Clickable Links from PDF:\n` + pdfLinks.map(link => `- ${link}`).join('\n') + `\n\n` + rawText;
        }
        const response = await axios_1.default.post(url, {
            contents: [{ parts: [{ text: fullPrompt }] }],
            generationConfig: { responseMimeType: 'application/json' },
        }, { headers: { 'Content-Type': 'application/json' }, timeout: 30000 });
        const jsonText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!jsonText) {
            throw new Error('Empty response from Gemini API');
        }
        console.log('✅ Gemini parsed successfully');
        return JSON.parse(jsonText);
    }
    catch (error) {
        console.error('❌ Gemini API error:', error.response?.data || error.message);
        console.warn('Falling back to regex parser...');
        return enhancedFallbackParser(rawText, pdfLinks);
    }
}
async function improveBio(bio, targetRole) {
    const apiKey = getApiKey();
    if (!apiKey) {
        return bio + ` (Targeting ${targetRole})`;
    }
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;
        const response = await axios_1.default.post(url, {
            contents: [
                {
                    parts: [
                        {
                            text: `Improve the following bio summary for a portfolio website targeting the role of "${targetRole}". Keep it professional, engaging, and under 3 sentences. Output only the improved text. No markdown, no quotes.\n\nOriginal Bio: ${bio}`,
                        },
                    ],
                },
            ],
        });
        const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        return text ? text.trim() : bio;
    }
    catch (error) {
        console.error('Gemini bio improvement error:', error);
        return bio;
    }
}
async function enhanceProjectDescription(title, desc, tech) {
    const apiKey = getApiKey();
    if (!apiKey) {
        return desc;
    }
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`;
        const response = await axios_1.default.post(url, {
            contents: [
                {
                    parts: [
                        {
                            text: `Enhance the following project description for a professional web portfolio. Make it brief (2-3 sentences) and action-oriented. Project title: "${title}". Technologies used: ${tech.join(', ')}. Original Description: ${desc}. Output only the enhanced description, no prefix or extra formatting.`,
                        },
                    ],
                },
            ],
        });
        const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        return text ? text.trim() : desc;
    }
    catch (error) {
        console.error('Gemini project description enhance error:', error);
        return desc;
    }
}
function enhancedFallbackParser(rawText, pdfLinks = []) {
    const normalizedText = rawText
        .replace(/\r/g, '\n')
        .replace(/[•●▪]/g, '-')
        .replace(/[–—]/g, '-')
        .replace(/\n{3,}/g, '\n\n');
    const lines = normalizedText.split('\n').map((line) => line.trim()).filter(Boolean);
    const sectionMap = splitResumeSections(lines);
    const email = extractMatch(normalizedText, /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/) || '';
    const phone = extractMatch(normalizedText, /(\+?\d[\d\s\-().]{8,18}\d)/) || '';
    // Extract profile URLs first from clickable PDF links if available
    let githubUrl = pdfLinks.find(link => /github\.com/i.test(link)) || '';
    let linkedinUrl = pdfLinks.find(link => /linkedin\.com/i.test(link)) || '';
    let portfolioUrl = pdfLinks.find(link => /https?:\/\/(?![^/\s]*(?:github|linkedin))[\w.-]+\.[a-zA-Z]{2,}/i.test(link)) || '';
    // Fallback to searching the extracted text if not found in pdfLinks
    if (!githubUrl) {
        githubUrl = extractMatch(normalizedText, /(https?:\/\/(?:www\.)?github\.com\/[a-zA-Z0-9_-]+|github\.com\/[a-zA-Z0-9_-]+)/i);
    }
    if (!linkedinUrl) {
        linkedinUrl = extractMatch(normalizedText, /(https?:\/\/(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+|linkedin\.com\/in\/[a-zA-Z0-9_-]+)/i);
    }
    if (!portfolioUrl) {
        portfolioUrl = extractMatch(normalizedText, /(https?:\/\/(?![^/\s]*(?:github|linkedin))[\w.-]+\.[a-zA-Z]{2,}[^\s]*)/i);
    }
    const fullName = findResumeName(lines, email);
    const summaryText = getFirstSection(sectionMap, ['summary', 'objective', 'profile', 'about']);
    const skillsText = getFirstSection(sectionMap, ['skills', 'technical skills', 'technologies', 'competencies']) || normalizedText;
    const projectText = getFirstSection(sectionMap, ['projects', 'project experience', 'academic projects', 'personal projects']);
    const experienceText = getFirstSection(sectionMap, ['experience', 'work experience', 'employment', 'internship', 'internships']);
    const educationText = getFirstSection(sectionMap, ['education', 'academic background', 'qualification', 'qualifications']);
    const certificationText = getFirstSection(sectionMap, ['certifications', 'certification', 'certificates', 'courses']);
    const achievementText = getFirstSection(sectionMap, ['achievements', 'awards', 'honors']);
    const skills = parseSkills(skillsText);
    return {
        personalInfo: {
            fullName,
            email,
            phone,
            location: findLocation(lines, email, phone),
            bio: buildFallbackBio(summaryText, fullName, skills),
            avatarUrl: '',
        },
        socials: {
            github: normalizeDetectedUrl(githubUrl),
            linkedin: normalizeDetectedUrl(linkedinUrl),
            portfolio: normalizeDetectedUrl(portfolioUrl),
            twitter: '',
        },
        education: parseEducation(educationText || normalizedText).filter((item) => item.degree || item.college),
        experience: parseExperience(experienceText || '').filter((item) => item.role || item.company || item.description),
        projects: parseProjects(projectText || '', extractGithubUser(githubUrl), pdfLinks.filter(link => /github\.com/i.test(link) && !link.toLowerCase().includes(extractGithubUser(githubUrl).toLowerCase())), pdfLinks.filter(link => !/github\.com/i.test(link) && !/linkedin\.com/i.test(link) && link !== portfolioUrl)).filter((item) => item.title || item.description),
        skills,
        certifications: parseCertifications(certificationText || ''),
        achievements: parseAchievements(achievementText || ''),
    };
}
function splitResumeSections(lines) {
    const headers = [
        'summary', 'objective', 'profile', 'about',
        'skills', 'technical skills', 'technologies', 'competencies',
        'projects', 'project experience', 'academic projects', 'personal projects',
        'experience', 'work experience', 'employment', 'internship', 'internships',
        'education', 'academic background', 'qualification', 'qualifications',
        'certifications', 'certification', 'certificates', 'courses',
        'achievements', 'awards', 'honors',
    ];
    const sections = {};
    let active = 'header';
    for (const line of lines) {
        const cleaned = line.toLowerCase().replace(/[:|]/g, '').trim();
        const matched = headers.find((header) => cleaned === header || cleaned.startsWith(`${header} `));
        if (matched && line.length <= 45) {
            active = matched;
            sections[active] = sections[active] || [];
        }
        else {
            sections[active] = sections[active] || [];
            sections[active].push(line);
        }
    }
    return Object.fromEntries(Object.entries(sections).map(([key, value]) => [key, value.join('\n')]));
}
function getFirstSection(sectionMap, keys) {
    for (const key of keys) {
        if (sectionMap[key])
            return sectionMap[key];
    }
    return '';
}
function findResumeName(lines, email) {
    const emailPrefix = email ? email.split('@')[0].replace(/[._-]+/g, ' ').toLowerCase() : '';
    const headerLines = lines.slice(0, 8);
    const nameLine = headerLines.find((line) => {
        const clean = line.replace(/[|,]/g, ' ').trim();
        return clean.length <= 45 &&
            /^[A-Za-z][A-Za-z.'-]+(?:\s+[A-Za-z][A-Za-z.'-]+){1,3}$/.test(clean) &&
            !/(resume|curriculum|email|phone|linkedin|github|portfolio)/i.test(clean);
    });
    if (nameLine)
        return nameLine.replace(/[|,]/g, ' ').replace(/\s+/g, ' ').trim();
    if (emailPrefix)
        return emailPrefix.replace(/\b\w/g, (char) => char.toUpperCase());
    return '';
}
function findLocation(lines, email, phone) {
    const header = lines.slice(0, 10).join(' ');
    const withoutContact = header.replace(email, '').replace(phone, '');
    return extractMatch(withoutContact, /([A-Z][a-zA-Z\s]+,\s*[A-Z][a-zA-Z\s]{2,}|[A-Z][a-zA-Z\s]+,\s*[A-Z]{2})/) || '';
}
function buildFallbackBio(summaryText, fullName, skills) {
    const summary = summaryText.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    if (summary)
        return summary.slice(0, 450);
    const skillText = skills.slice(0, 5).map((skill) => skill.name).join(', ');
    if (skillText)
        return `${fullName || 'This candidate'} has hands-on experience with ${skillText}.`;
    return '';
}
function normalizeDetectedUrl(url) {
    if (!url)
        return '';
    return url.startsWith('http') ? url : `https://${url}`;
}
function extractGithubUser(url) {
    return extractMatch(url, /github\.com\/([a-zA-Z0-9_-]+)/i);
}
function parseAchievements(text) {
    if (!text)
        return [];
    return text
        .split('\n')
        .map((line) => line.replace(/^[-*]\s*/, '').trim())
        .filter((line) => line.length > 4)
        .slice(0, 6)
        .map((line) => ({
        title: line.slice(0, 90),
        description: line,
        date: extractMatch(line, /\b(19|20)\d{2}\b/) || '',
    }));
}
function extractYearRange(text) {
    return extractMatch(text, /\b((?:19|20)\d{2}\s*[-–]\s*(?:(?:19|20)\d{2}|Present|Current|Now))\b/i);
}
function extractGrade(text) {
    const labeled = text.match(/\b(CGPA|GPA|Percentage|Percent)\s*:?\s*(\d+(?:\.\d+)?\s*(?:\/\s*\d+|%|percent)?)/i);
    if (labeled) {
        const label = /^percent$/i.test(labeled[1]) ? 'Percentage' : labeled[1];
        return `${label}: ${labeled[2].replace(/\s+/g, '')}`;
    }
    return extractMatch(text, /(\d+(?:\.\d+)?\s*(?:CGPA|GPA|%|percent)|\d+(?:\.\d+)?\/\d+)/i);
}
function cleanEducationDegree(line) {
    return line
        .replace(/\b(CGPA|GPA|Percentage|Percent)\s*:?\s*\d+(?:\.\d+)?\s*(?:\/\s*\d+|%|percent)?/ig, '')
        .replace(/\b(?:19|20)\d{2}\s*[-–]\s*(?:(?:19|20)\d{2}|Present|Current|Now)\b/ig, '')
        .replace(/\b(?:19|20)\d{2}\b/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}
function findNearbyInstitution(lines, startIndex) {
    const institutionPattern = /\b(university|college|institute|school|academy|vidyalaya|chaitanya|technologies|engineering)\b/i;
    for (const line of lines.slice(startIndex + 1, startIndex + 4)) {
        const cleaned = line
            .replace(/\b(CGPA|GPA|Percentage|Percent)\s*:?\s*\d+(?:\.\d+)?\s*(?:\/\s*\d+|%|percent)?/ig, '')
            .replace(/\b(?:19|20)\d{2}\s*[-–]\s*(?:(?:19|20)\d{2}|Present|Current|Now)\b/ig, '')
            .replace(/\b(?:19|20)\d{2}\b/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        if (institutionPattern.test(cleaned) && cleaned.length > 3) {
            return cleaned;
        }
    }
    const nextLine = lines[startIndex + 1] || '';
    return nextLine.length > 3 && nextLine.length < 100 ? cleanEducationDegree(nextLine) : '';
}
function extractDateRange(text) {
    return extractMatch(text, /\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\s*(?:[-–]\s*|\s+)(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|Present|Current|Now)|(?:19|20)\d{2}\s*[-–]\s*(?:(?:19|20)\d{2}|Present|Current|Now))\b/i);
}
function cleanRoleTitle(line, duration) {
    return line
        .replace(duration, '')
        .replace(/[-–|·•]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}
function dedupeBy(items, getKey) {
    const seen = new Set();
    return items.filter((item) => {
        const key = getKey(item).toLowerCase();
        if (seen.has(key))
            return false;
        seen.add(key);
        return true;
    });
}
// Improved rule-based regex fallback parser
function fallbackParser(rawText) {
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    // --- Personal Info ---
    const email = extractMatch(rawText, /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/) || '';
    const phone = extractMatch(rawText, /(\+?[\d][\d\s\-().]{7,15}\d)/) || '';
    const github = extractMatch(rawText, /github\.com\/([a-zA-Z0-9_-]+)/) || '';
    const linkedin = extractMatch(rawText, /linkedin\.com\/in\/([a-zA-Z0-9_-]+)/) || '';
    const portfolio = extractMatch(rawText, /https?:\/\/(?!github|linkedin)([a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[^\s]*)/) || '';
    // Name: usually the first line that looks like a proper name (2+ capitalized words)
    const fullName = lines.find(l => /^[A-Z][a-z]+(\s+[A-Z][a-z]+)+$/.test(l) && l.split(' ').length <= 4) || extractMatch(rawText, /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/) || 'Your Name';
    // Location: look for City, State/Country pattern
    const location = extractMatch(rawText, /([A-Z][a-zA-Z\s]+,\s*[A-Z][a-zA-Z\s]{2,})/) || '';
    // Bio: look for a summary/objective section
    const bioSection = extractSection(rawText, ['summary', 'objective', 'profile', 'about']);
    const bio = bioSection
        ? bioSection.slice(0, 400).replace(/\n/g, ' ').trim()
        : `${fullName} is a professional with experience in the field. Please edit this bio.`;
    // --- Education ---
    const eduSection = extractSection(rawText, ['education', 'academic', 'qualification']);
    const education = parseEducation(eduSection || rawText);
    // --- Experience ---
    const expSection = extractSection(rawText, ['experience', 'employment', 'work history', 'career']);
    const experience = parseExperience(expSection || rawText);
    // --- Projects ---
    const projSection = extractSection(rawText, ['project', 'personal project', 'academic project']);
    const projects = parseProjects(projSection || rawText, github);
    // --- Skills ---
    const skillSection = extractSection(rawText, ['skill', 'technical skill', 'technology', 'competenc']);
    const skills = parseSkills(skillSection || rawText);
    // --- Certifications ---
    const certSection = extractSection(rawText, ['certification', 'certificate', 'credential', 'course']);
    const certifications = parseCertifications(certSection || '');
    return {
        personalInfo: {
            fullName,
            email,
            phone,
            location,
            bio,
            avatarUrl: '',
        },
        socials: {
            github: github ? `https://github.com/${github}` : '',
            linkedin: linkedin ? `https://linkedin.com/in/${linkedin}` : '',
            portfolio,
            twitter: '',
        },
        education,
        experience,
        projects,
        skills,
        certifications,
        achievements: [],
    };
}
function extractSection(text, keywords) {
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const lower = lines[i].toLowerCase().trim();
        if (keywords.some(kw => lower.includes(kw))) {
            // Collect lines until next section header (all-caps or title-case short line)
            const section = [];
            for (let j = i + 1; j < lines.length && j < i + 40; j++) {
                const l = lines[j].trim();
                // Stop at next section header
                if (l.length > 0 && l.length < 40 && /^[A-Z\s&\/]+$/.test(l))
                    break;
                section.push(l);
            }
            return section.join('\n');
        }
    }
    return '';
}
function parseEducation(text) {
    const lines = text
        .split('\n')
        .map((line) => line.replace(/\s+/g, ' ').trim())
        .filter(Boolean);
    const degreePattern = /\b(?:B\.?\s?Tech|B\.?\s?E\.?|B\.?\s?Sc|M\.?\s?Tech|M\.?\s?Sc|M\.?\s?E\.?|MBA|BCA|MCA|B\.?\s?A\.?|M\.?\s?A\.?|Ph\.?\s?D|Bachelor(?:'s)?|Master(?:'s)?|Associate|Diploma|Intermediate|MPC|Computer Science|Cyber Security)\b/i;
    const results = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!degreePattern.test(line))
            continue;
        const windowText = lines.slice(i, i + 4).join(' ');
        const year = extractYearRange(windowText) || extractMatch(windowText, /\b(19|20)\d{2}\b/g) || '';
        const grade = extractGrade(windowText);
        const college = findNearbyInstitution(lines, i);
        const degree = cleanEducationDegree(line);
        if (degree || college) {
            results.push({ degree, college, year, grade });
        }
    }
    return dedupeBy(results, (item) => `${item.degree}|${item.college}`).slice(0, 4);
}
function parseExperience(text) {
    const results = [];
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const datePattern = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\s*(?:[-–]\s*|\s+)(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\s*(?:[-–]\s*|\s+)(?:Present|Current|Now)|(?:19|20)\d{2}\s*[-–]\s*(?:(?:19|20)\d{2}|Present|Current|Now)|\b\d{4}\s*[-–]\s*(?:\d{4}|Present)/gi;
    const durations = text.match(datePattern) || [];
    const roleKeywords = /engineer|developer|intern|analyst|manager|lead|architect|designer|consultant|specialist|coordinator|officer|associate|director|head/i;
    let currentExp = null;
    let descLines = [];
    for (const line of lines) {
        const hasDate = datePattern.test(line);
        datePattern.lastIndex = 0;
        const hasRole = roleKeywords.test(line);
        if ((hasRole || hasDate) && line.length < 80) {
            if (currentExp) {
                currentExp.description = descLines.slice(0, 5).join(' ').trim() || 'Responsibilities and achievements.';
                results.push(currentExp);
                descLines = [];
            }
            const duration = extractDateRange(line) || '';
            const lineWithoutDuration = line.replace(duration, '').trim();
            let role = '';
            let company = '';
            const separators = /[|,\-–]/;
            if (separators.test(lineWithoutDuration)) {
                const parts = lineWithoutDuration.split(separators).map(p => p.trim());
                if (parts.length >= 2) {
                    const firstIsRole = roleKeywords.test(parts[0]);
                    const secondIsRole = roleKeywords.test(parts[1]);
                    if (firstIsRole && !secondIsRole) {
                        role = parts[0];
                        company = parts[1];
                    }
                    else {
                        company = parts[0];
                        role = parts[1];
                    }
                }
            }
            else if (/\b(at|for)\b/i.test(lineWithoutDuration)) {
                const parts = lineWithoutDuration.split(/\b(?:at|for)\b/i).map(p => p.trim());
                if (parts.length >= 2) {
                    role = parts[0];
                    company = parts[1];
                }
            }
            else {
                role = lineWithoutDuration;
            }
            role = role.replace(/[-–|·•]/g, ' ').replace(/\s+/g, ' ').trim();
            company = company.replace(/[-–|·•]/g, ' ').replace(/\s+/g, ' ').trim();
            currentExp = {
                role: role || (hasRole ? cleanRoleTitle(line, duration) : ''),
                company: company,
                duration: duration || (hasDate ? line : ''),
                description: '',
            };
        }
        else if (currentExp && !currentExp.company && line.length > 3 && line.length < 60 && !/^[-*]/.test(line)) {
            currentExp.company = line.replace(/[-–|·•]/g, ' ').replace(/\s+/g, ' ').trim();
        }
        else if (currentExp && line.length > 4) {
            descLines.push(line.replace(/^[-•·*]\s*/, ''));
        }
    }
    if (currentExp) {
        currentExp.description = descLines.slice(0, 5).join(' ').trim() || 'Responsibilities and achievements.';
        results.push(currentExp);
    }
    if (results.length === 0 && durations.length > 0) {
        results.push({
            role: 'Professional Role',
            company: 'Company Name',
            duration: durations[0],
            description: 'Details of responsibilities and achievements.',
        });
    }
    return results.slice(0, 5);
}
function parseProjects(text, githubUser, projectGithubLinks = [], projectLiveLinks = []) {
    const results = [];
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const techPattern = /\b(React|Node\.?js|Python|Java|TypeScript|JavaScript|Express|MongoDB|PostgreSQL|MySQL|Redis|Docker|AWS|Azure|GCP|Firebase|GraphQL|REST|HTML|CSS|Tailwind|Next\.?js|Vue|Angular|Flutter|Kotlin|Swift|C\+\+|C#|Go|Rust|PHP|Django|Spring|Laravel|Ruby|Rails)\b/gi;
    let currentProj = null;
    let descLines = [];
    for (const line of lines) {
        // Detect project title: short line, doesn't start with bullet, doesn't look like a sentence
        const looksLikeTitle = line.length < 60 &&
            line.length > 3 &&
            !/^[-•·*]/.test(line) &&
            !line.endsWith('.') &&
            line.split(' ').length <= 7;
        if (looksLikeTitle) {
            if (currentProj) {
                currentProj.description = descLines.join(' ').trim();
                results.push(currentProj);
                descLines = [];
            }
            const found = line.match(techPattern) || [];
            currentProj = {
                title: line,
                description: '',
                technologies: found.map(t => t),
                githubLink: '',
                liveLink: ''
            };
        }
        else if (currentProj) {
            const found = line.match(techPattern) || [];
            currentProj.technologies.push(...found.map((t) => t));
            if (line.match(/https?:\/\//)) {
                if (line.includes('github'))
                    currentProj.githubLink = extractMatch(line, /(https?:\/\/[^\s]+)/);
                else
                    currentProj.liveLink = extractMatch(line, /(https?:\/\/[^\s]+)/);
            }
            else {
                descLines.push(line.replace(/^[-•·*]\s*/, ''));
            }
        }
    }
    if (currentProj) {
        currentProj.description = descLines.join(' ').trim();
        results.push(currentProj);
    }
    // Deduplicate technologies and assign links
    return results.slice(0, 5).map((p, idx) => ({
        ...p,
        technologies: [...new Set(p.technologies)].slice(0, 6),
        description: p.description || 'Project built with modern technologies.',
        githubLink: p.githubLink || projectGithubLinks[idx] || (githubUser ? `https://github.com/${githubUser}` : ''),
        liveLink: p.liveLink || projectLiveLinks[idx] || '',
    }));
}
function parseSkills(text) {
    const techPattern = /\b(React|Node\.?js|Python|Java|TypeScript|JavaScript|Express|MongoDB|PostgreSQL|MySQL|Redis|Docker|Kubernetes|AWS|Azure|GCP|Firebase|GraphQL|REST|HTML|CSS|Tailwind|Next\.?js|Vue|Angular|Flutter|Kotlin|Swift|C\+\+|C#|\.NET|Go|Rust|PHP|Django|Spring|Laravel|Ruby|Rails|Git|Linux|Bash|Pandas|NumPy|TensorFlow|PyTorch|Figma|Photoshop|Illustrator|Excel|PowerPoint)\b/gi;
    const softPattern = /\b(leadership|communication|teamwork|problem.solving|critical.thinking|time.management|adaptability|creativity|collaboration|presentation|research|analytical|negotiation)\b/gi;
    const techMatches = [...new Set((text.match(techPattern) || []).map(s => s.trim()))];
    const softMatches = [...new Set((text.match(softPattern) || []).map(s => s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())))];
    const skills = [
        ...techMatches.slice(0, 12).map(name => ({ name, category: 'technical', level: 4 })),
        ...softMatches.slice(0, 4).map(name => ({ name, category: 'soft', level: 4 })),
    ];
    if (skills.length === 0) {
        return [
            { name: 'JavaScript', category: 'technical', level: 4 },
            { name: 'Problem Solving', category: 'soft', level: 4 },
        ];
    }
    return skills;
}
function parseCertifications(text) {
    if (!text)
        return [];
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 5);
    return lines.slice(0, 5).map(line => ({
        name: line.replace(/^[-•·*]\s*/, '').slice(0, 80),
        issuer: '',
        date: extractMatch(line, /\b(19|20)\d{2}\b/) || '',
        url: extractMatch(line, /(https?:\/\/[^\s]+)/) || '',
    }));
}
function extractMatch(text, regex) {
    const match = text.match(regex);
    return match ? (match[1] || match[0]).trim() : '';
}
