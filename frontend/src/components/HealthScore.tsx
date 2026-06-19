import React from 'react';
import { PortfolioData } from '../context/store';
import { CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

interface HealthScoreProps {
  data: PortfolioData;
}

export const HealthScore: React.FC<HealthScoreProps> = ({ data }) => {
  const calculateScoreAndRecs = () => {
    let score = 0;
    const recs: string[] = [];

    // 1. Personal Info Completeness (Max 30 points)
    const { personalInfo, socials, education, experience, projects, skills } = data;
    if (personalInfo.fullName) score += 10;
    else recs.push('Add your full name.');

    if (personalInfo.email) score += 5;
    else recs.push('Add a contact email address.');

    if (personalInfo.bio && personalInfo.bio.length > 20) score += 10;
    else recs.push('Write a professional bio (at least 20 characters).');

    if (personalInfo.avatarUrl) score += 5;
    else recs.push('Upload a profile picture to personalize the page.');

    // 2. Social Profiles (Max 15 points)
    if (socials.github) score += 5;
    else recs.push('Add your GitHub profile link.');

    if (socials.linkedin) score += 5;
    else recs.push('Add your LinkedIn profile link.');

    if (socials.portfolio || socials.twitter) score += 5;

    // 3. Education (Max 15 points)
    if (education && education.length > 0) {
      score += 15;
    } else {
      recs.push('Add your academic history (undergrad, certifications, etc.).');
    }

    // 4. Experience (Max 20 points)
    if (experience && experience.length > 0) {
      score += 20;
    } else {
      recs.push('Add at least one professional work experience or internship.');
    }

    // 5. Projects (Max 20 points)
    if (projects && projects.length > 0) {
      if (projects.length >= 3) {
        score += 20;
      } else {
        score += 10;
        recs.push('Add at least 3 completed software or security projects.');
      }
    } else {
      recs.push('Add completed projects to show off your active skills.');
    }

    // 6. Skills (Max 10 points - adjusted bounds)
    if (skills && skills.length >= 5) {
      score += 10;
    } else {
      score += 5;
      recs.push('List at least 5 technical or soft skills.');
    }

    // Cap score at 100
    const finalScore = Math.min(100, score);
    return { score: finalScore, recs };
  };

  const { score, recs } = calculateScoreAndRecs();

  // Color mappings for scores
  const getScoreColorClass = (val: number) => {
    if (val >= 85) return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5';
    if (val >= 55) return 'text-amber-500 border-amber-500/20 bg-amber-500/5';
    return 'text-rose-500 border-rose-500/20 bg-rose-500/5';
  };

  return (
    <div className={`p-5 rounded-xl border ${getScoreColorClass(score)}`}>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-gray-200">Portfolio Completeness Score</h4>
          <p className="text-xs text-gray-400 mt-0.5">Optimised for standard hiring filters</p>
        </div>
        <div className="text-3xl font-black">{score}<span className="text-xs text-gray-500 font-semibold">/100</span></div>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden mt-4">
        <div 
          className="h-full transition-all duration-500"
          style={{ 
            width: `${score}%`, 
            backgroundColor: score >= 85 ? '#10b981' : score >= 55 ? '#f59e0b' : '#ef4444' 
          }}
        ></div>
      </div>

      {/* Recommendations */}
      <div className="mt-4 pt-4 border-t border-gray-800/40">
        <h5 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Recommendations</h5>
        {recs.length === 0 ? (
          <p className="text-xs text-emerald-400 flex items-center"><CheckCircle2 size={12} className="mr-1.5" /> Perfect! Your portfolio is ready for recruitment.</p>
        ) : (
          <ul className="space-y-1.5">
            {recs.slice(0, 3).map((rec, i) => (
              <li key={i} className="text-[11px] text-gray-400 flex items-start">
                <AlertTriangle size={12} className="mr-1.5 text-amber-500 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
            {recs.length > 3 && (
              <li className="text-[10px] text-gray-500 flex items-center">
                <HelpCircle size={10} className="mr-1.5" /> And {recs.length - 3} other suggestions...
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};
