import React, { useState, useEffect, useMemo } from 'react';
import { getExperiences } from '../../../services/api';
import type { Experience } from '../../../types';
import ExperienceCard from '../ExperienceCard';
import Spinner from '../Spinner';

const HomePage: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const data = await getExperiences();
        setExperiences(data);
      } catch (err) {
        setError('Failed to fetch experiences. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const filteredExperiences = useMemo(() => {
    const trimmedSearchTerm = activeSearchTerm.trim().toLowerCase();
    if (!trimmedSearchTerm) {
      return experiences;
    }

    const searchTokens = trimmedSearchTerm.split(/\s+/).filter(Boolean);

    return experiences.filter(exp => {
      const searchableText = [
        exp.title,
        exp.location,
        ...exp.tags,
      ].join(' ').toLowerCase();
      
      return searchTokens.every(token => searchableText.includes(token));
    });
  }, [experiences, activeSearchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearchTerm(searchTerm);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    // Reset search when input is cleared
    if (newSearchTerm === '') {
        setActiveSearchTerm('');
    }
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-96">
            <Spinner size="12" color="amber-500" />
        </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  }

  return (
    <main>
        <div className="bg-gray-800 shadow-sm">
            <div className="container mx-auto p-4 md:px-8 md:py-6">
                 <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 items-center">
                    <input 
                        type="search" 
                        placeholder="Search experiences, destinations or activities..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full px-4 py-3 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow"
                        aria-label="Search experiences"
                    />
                    <button type="submit" className="w-full md:w-auto px-8 py-3 bg-amber-400 text-black font-bold rounded-md hover:bg-amber-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
                        Search
                    </button>
                </form>
            </div>
        </div>
        <div className="container mx-auto p-4 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {filteredExperiences.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
                ))}
            </div>
            {filteredExperiences.length === 0 && !loading && (
                <div className="col-span-full text-center py-16">
                    <h2 className="text-2xl font-bold text-slate-700">No Experiences Found</h2>
                    <p className="text-slate-500 mt-2">Try adjusting your search term.</p>
                </div>
            )}
        </div>
    </main>
  );
};

export default HomePage;