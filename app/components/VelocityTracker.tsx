'use client';

import { useState } from 'react';

type ThrowType = 'knees' | 'long-toss' | 'mound' | 'infield';

interface VelocityRecord {
  date: string;
  type: ThrowType;
  velocity: number;
  notes: string;
}

const throwTypeLabels: Record<ThrowType, string> = {
  'knees': 'From Knees',
  'long-toss': 'Long Toss',
  'mound': 'Mound',
  'infield': 'Infield',
};

const throwTypeColors: Record<ThrowType, { bg: string; text: string; border: string }> = {
  'knees': { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
  'long-toss': { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
  'mound': { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
  'infield': { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
};

export default function VelocityTracker() {
  const [records, setRecords] = useState<VelocityRecord[]>([]);
  const [throwType, setThrowType] = useState<ThrowType>('mound');
  const [velocity, setVelocity] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [filterType, setFilterType] = useState<ThrowType | 'all'>('all');

  const addRecord = () => {
    if (velocity > 0) {
      const newRecord: VelocityRecord = {
        date: new Date().toLocaleDateString(),
        type: throwType,
        velocity,
        notes,
      };
      setRecords([newRecord, ...records]);
      setVelocity(0);
      setNotes('');
    }
  };

  const deleteRecord = (index: number) => {
    setRecords(records.filter((_, i) => i !== index));
  };

  const filteredRecords = filterType === 'all' 
    ? records 
    : records.filter(r => r.type === filterType);

  const getStats = (type: ThrowType | 'all') => {
    const filtered = type === 'all' ? records : records.filter(r => r.type === type);
    if (filtered.length === 0) return { avg: 0, max: 0, count: 0 };
    return {
      avg: filtered.reduce((sum, r) => sum + r.velocity, 0) / filtered.length,
      max: Math.max(...filtered.map(r => r.velocity)),
      count: filtered.length,
    };
  };

  const allStats = getStats('all');


  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-4">Velocity Tracker</h2>
      <p className="text-center text-gray-600 mb-12">
        Track throwing velocities from different positions over time
      </p>

      {/* Stats by Type */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {(Object.keys(throwTypeLabels) as ThrowType[]).map((type) => {
          const stats = getStats(type);
          const colors = throwTypeColors[type];
          return (
            <div key={type} className={`${colors.bg} p-4 rounded-lg shadow`}>
              <p className="text-sm text-gray-600 mb-1">{throwTypeLabels[type]}</p>
              <p className={`text-2xl font-bold ${colors.text}`}>
                {stats.max > 0 ? `${stats.max.toFixed(1)} mph` : '—'}
              </p>
              <p className="text-xs text-gray-500">
                {stats.count > 0 ? `Avg: ${stats.avg.toFixed(1)} mph (${stats.count})` : 'No data'}
              </p>
            </div>
          );
        })}
      </div>

      {/* Overall Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-purple-100 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600 mb-1">Overall Max Velocity</p>
          <p className="text-3xl font-bold text-purple-600">
            {allStats.max > 0 ? `${allStats.max.toFixed(1)} mph` : '—'}
          </p>
        </div>
        <div className="bg-indigo-100 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600 mb-1">Overall Average</p>
          <p className="text-3xl font-bold text-indigo-600">
            {allStats.avg > 0 ? `${allStats.avg.toFixed(1)} mph` : '—'}
          </p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600 mb-1">Total Readings</p>
          <p className="text-3xl font-bold text-gray-600">{allStats.count}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-6">Log Velocity</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-black">Throw Type</label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(throwTypeLabels) as ThrowType[]).map((type) => {
                  const colors = throwTypeColors[type];
                  return (
                    <button
                      key={type}
                      onClick={() => setThrowType(type)}
                      className={`px-4 py-2 rounded-lg font-medium transition border-2 ${
                        throwType === type
                          ? `${colors.bg} ${colors.text} ${colors.border}`
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {throwTypeLabels[type]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-black">Velocity (mph)</label>
              <input
                type="number"
                value={velocity || ''}
                onChange={(e) => setVelocity(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Enter velocity"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-black">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Add notes about this throw"
                rows={3}
              />
            </div>

            <button
              onClick={addRecord}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Add Velocity
            </button>
          </div>
        </div>

        {/* History Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">History</h3>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as ThrowType | 'all')}
              className="px-3 py-1 border rounded-lg text-sm"
            >
              <option value="all">All Types</option>
              {(Object.keys(throwTypeLabels) as ThrowType[]).map((type) => (
                <option key={type} value={type}>{throwTypeLabels[type]}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredRecords.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No velocities logged yet. Add your first reading!</p>
            ) : (
              filteredRecords.map((record, index) => {
                const colors = throwTypeColors[record.type];
                return (
                  <div key={index} className={`${colors.bg} p-4 rounded-lg border ${colors.border}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${colors.text} bg-white`}>
                            {throwTypeLabels[record.type]}
                          </span>
                          <span className="text-sm text-gray-600">{record.date}</span>
                        </div>
                        <p className={`text-2xl font-bold ${colors.text}`}>
                          {record.velocity} mph
                        </p>
                      </div>
                      <button
                        onClick={() => deleteRecord(records.indexOf(record))}
                        className="text-red-500 hover:text-red-700 text-sm font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                    {record.notes && (
                      <p className="text-sm text-gray-700 mt-2">{record.notes}</p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
