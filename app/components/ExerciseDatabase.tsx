'use client';

import { useState, useMemo } from 'react';
import { velocityExercises, exerciseCategories, Exercise } from '../data/exercises-database';

export default function ExerciseDatabase() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);

  const filteredExercises = useMemo(() => {
    return velocityExercises.filter((exercise) => {
      const matchesSearch = 
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.velocityBenefit.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || exercise.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchTerm, selectedCategory, selectedDifficulty]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Lower Body Power': 'bg-orange-500',
      'Lower Body Strength': 'bg-orange-600',
      'Upper Body Push': 'bg-blue-500',
      'Upper Body Pull': 'bg-blue-600',
      'Rotational Power': 'bg-purple-500',
      'Core Stability': 'bg-indigo-500',
      'Shoulder Health': 'bg-pink-500',
      'Hip Mobility': 'bg-teal-500',
      'Olympic Lifts': 'bg-red-500',
      'Arm Care': 'bg-cyan-500',
      'Weighted Ball Throws': 'bg-green-500',
      'Speed & Agility': 'bg-yellow-500',
      'Band Work': 'bg-violet-500',
      'Grip Strength': 'bg-amber-500',
      'Posterior Chain': 'bg-rose-500',
      'Single Leg': 'bg-lime-500',
      'Anti-Rotation': 'bg-emerald-500',
      'Mobility & Flexibility': 'bg-sky-500',
      'Medicine Ball': 'bg-fuchsia-500',
      'Plyometrics': 'bg-orange-400',
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-4">Exercise Database</h2>
      <p className="text-center text-gray-600 mb-2">
        {velocityExercises.length} exercises to help you throw harder
      </p>
      <p className="text-center text-sm text-gray-500 mb-8">
        Curated from Driveline Baseball, JAEGER Sports, Eric Cressey, and sports science research
      </p>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search exercises..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {exerciseCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Showing {filteredExercises.length} of {velocityExercises.length} exercises
        </p>
      </div>

      {/* Category Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition ${
            selectedCategory === 'all' 
              ? 'bg-gray-800 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        {exerciseCategories.slice(0, 10).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              selectedCategory === cat 
                ? `${getCategoryColor(cat)} text-white` 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Exercise Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.slice(0, 50).map((exercise) => (
          <div
            key={exercise.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer"
            onClick={() => setExpandedExercise(expandedExercise === exercise.id ? null : exercise.id)}
          >
            <div className={`h-2 rounded-t-lg ${getCategoryColor(exercise.category)}`} />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{exercise.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(exercise.difficulty)}`}>
                  {exercise.difficulty}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-2">{exercise.category} • {exercise.subcategory}</p>
              
              {expandedExercise === exercise.id ? (
                <div className="mt-3 space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Description</p>
                    <p className="text-sm text-gray-600">{exercise.description}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Velocity Benefit</p>
                    <p className="text-sm text-blue-600">{exercise.velocityBenefit}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Muscles Worked</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {exercise.musclesWorked.map((muscle, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Equipment</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {exercise.equipment.map((eq, idx) => (
                        <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600 line-clamp-2">{exercise.description}</p>
              )}
              
              <p className="text-xs text-gray-400 mt-2">
                {expandedExercise === exercise.id ? 'Click to collapse' : 'Click for details'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredExercises.length > 50 && (
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            Showing 50 of {filteredExercises.length} exercises. Use filters to narrow down.
          </p>
        </div>
      )}

      {filteredExercises.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No exercises found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedDifficulty('all');
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg">
        <h3 className="text-2xl font-bold mb-6 text-center">Exercise Database Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-4xl font-bold">{velocityExercises.length}</p>
            <p className="text-sm opacity-80">Total Exercises</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold">{exerciseCategories.length}</p>
            <p className="text-sm opacity-80">Categories</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold">
              {velocityExercises.filter(e => e.difficulty === 'Beginner').length}
            </p>
            <p className="text-sm opacity-80">Beginner Exercises</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold">
              {velocityExercises.filter(e => e.difficulty === 'Advanced').length}
            </p>
            <p className="text-sm opacity-80">Advanced Exercises</p>
          </div>
        </div>
      </div>
    </div>
  );
}
