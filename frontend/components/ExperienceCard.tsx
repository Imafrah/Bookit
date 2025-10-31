
import React from 'react';
import type { Experience } from '../../types';
import { useAppContext } from './context/AppContext';

interface ExperienceCardProps {
  experience: Experience;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
  const { selectExperience } = useAppContext();

  return (
    <article 
        className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-1 transition-transform duration-300 group cursor-pointer"
        onClick={() => selectExperience(experience.id)}
        aria-label={`View details for ${experience.title}`}
    >
      <div className="relative">
        <img className="w-full h-48 object-cover" src={experience.imageUrl} alt={experience.title} />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-base font-bold text-slate-800 pr-2 group-hover:text-amber-600 transition-colors">{experience.title}</h3>
            <span className="flex-shrink-0 bg-slate-200 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-md">{experience.location.split(',')[0]}</span>
        </div>
        
        <p className="text-sm text-slate-600 mb-4 flex-grow">{experience.description}</p>
        
        <div className="flex justify-between items-center mt-auto pt-3 border-t border-slate-200">
          <p className="text-lg font-extrabold text-slate-900">
            <span className="text-sm font-medium text-slate-500">From </span>
            ₹{experience.price.toLocaleString('en-IN')}
          </p>
          <div className="px-4 py-2 bg-amber-400 text-black text-sm font-bold rounded-md group-hover:bg-amber-500 transition-colors">
            View Details
          </div>
        </div>
      </div>
    </article>
  );
};

export default ExperienceCard;
