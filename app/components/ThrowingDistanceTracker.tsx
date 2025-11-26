'use client';

import { useState } from 'react';

interface ThrowRecord {
  date: string;
  distance: number;
  velocity: number;
  notes: string;
}

export default function ThrowingDistanceTracker() {
  const [throws, setThrows] = useState<ThrowRecord[]>([]);
  const [distance, setDistance] = useState<number>(0);
  const [velocity, setVelocity] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');

  const addThrow = () => {
    if (distance > 0 || velocity > 0) {
      const newThrow: ThrowRecord = {
        date: new Date().toLocaleDateString(),
        distance,
        velocity,
        notes,
      };
      setThrows([newThrow, ...throws]);
      setDistance(0);
      setVelocity(0);
      setNotes('');
    }
  };

  const deleteThrow = (index: number) => {
    setThrows(throws.filter((_, i) => i !== index));
  };

  const avgDistance = throws.length > 0 
    ? throws.reduce((sum, t) => sum + t.distance, 0) / throws.length 
    : 0;
  
  const avgVelocity = throws.length > 0 
    ? throws.reduce((sum, t) => sum + t.velocity, 0) / throws.length 
    : 0;

  const maxDistance = throws.length > 0 
    ? Math.max(...throws.map(t => t.distance)) 
    : 0;
  
  const maxVelocity = throws.length > 0 
    ? Math.max(...throws.map(t => t.velocity)) 
    : 0;

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-4">Throwing Distance Tracker</h2>
      <p className="text-center text-gray-600 mb-12">
        Track your throwing progress over time
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600 mb-1">Average Distance</p>
          <p className="text-3xl font-bold text-blue-600">{avgDistance.toFixed(1)} ft</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600 mb-1">Average Velocity</p>
          <p className="text-3xl font-bold text-green-600">{avgVelocity.toFixed(1)} mph</p>
        </div>
        <div className="bg-purple-100 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600 mb-1">Total Throws</p>
          <p className="text-3xl font-bold text-purple-600">{throws.length}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-6">Log a Throw</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Distance (feet)</label>
              <input
                type="number"
                value={distance || ''}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter distance"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Velocity (mph)</label>
              <input
                type="number"
                value={velocity || ''}
                onChange={(e) => setVelocity(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter velocity"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Add notes about this throw"
                rows={3}
              />
            </div>

            <button
              onClick={addThrow}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Add Throw
            </button>
          </div>

          {maxDistance > 0 && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm font-semibold text-yellow-800 mb-2">Personal Records</p>
              <p className="text-sm text-gray-700">Max Distance: {maxDistance.toFixed(1)} ft</p>
              <p className="text-sm text-gray-700">Max Velocity: {maxVelocity.toFixed(1)} mph</p>
            </div>
          )}
        </div>

        {/* History Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-6">Throw History</h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {throws.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No throws logged yet. Add your first throw!</p>
            ) : (
              throws.map((throwRecord, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm text-gray-600">{throwRecord.date}</p>
                      <div className="flex gap-4 mt-1">
                        <span className="text-lg font-bold text-blue-600">
                          {throwRecord.distance} ft
                        </span>
                        <span className="text-lg font-bold text-green-600">
                          {throwRecord.velocity} mph
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteThrow(index)}
                      className="text-red-500 hover:text-red-700 text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                  {throwRecord.notes && (
                    <p className="text-sm text-gray-700 mt-2">{throwRecord.notes}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
