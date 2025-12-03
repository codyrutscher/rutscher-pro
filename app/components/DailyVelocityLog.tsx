'use client';

import { useState } from 'react';

type VelocityType = 'pitching' | 'pulldown' | 'infield';

interface VelocityReading {
  id: string;
  velocity: number;
  type: VelocityType;
  time: string;
}

interface DayLog {
  date: string;
  readings: VelocityReading[];
  notes: string;
}

const typeLabels: Record<VelocityType, string> = {
  pitching: 'Pitching',
  pulldown: 'Pull Down',
  infield: 'Infield',
};

const typeColors: Record<VelocityType, { bg: string; text: string; border: string }> = {
  pitching: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
  pulldown: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
  infield: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
};

export default function DailyVelocityLog() {
  const [days, setDays] = useState<DayLog[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [velocity, setVelocity] = useState<number>(0);
  const [velocityType, setVelocityType] = useState<VelocityType>('pitching');
  const [dayNotes, setDayNotes] = useState('');
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const getCurrentDayLog = () => {
    return days.find(d => d.date === selectedDate);
  };

  const addReading = () => {
    if (velocity <= 0) return;

    const newReading: VelocityReading = {
      id: Date.now().toString(),
      velocity,
      type: velocityType,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setDays(prev => {
      const existingDay = prev.find(d => d.date === selectedDate);
      if (existingDay) {
        return prev.map(d => 
          d.date === selectedDate 
            ? { ...d, readings: [...d.readings, newReading] }
            : d
        );
      } else {
        return [{ date: selectedDate, readings: [newReading], notes: '' }, ...prev]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }
    });
    setVelocity(0);
  };

  const deleteReading = (date: string, readingId: string) => {
    setDays(prev => prev.map(d => 
      d.date === date 
        ? { ...d, readings: d.readings.filter(r => r.id !== readingId) }
        : d
    ).filter(d => d.readings.length > 0));
  };

  const updateDayNotes = (date: string, notes: string) => {
    setDays(prev => prev.map(d => 
      d.date === date ? { ...d, notes } : d
    ));
  };

  const getTypeStats = (type: VelocityType) => {
    const allReadings = days.flatMap(d => d.readings).filter(r => r.type === type);
    if (allReadings.length === 0) return { max: 0, avg: 0, count: 0 };
    const velocities = allReadings.map(r => r.velocity);
    return {
      max: Math.max(...velocities),
      avg: velocities.reduce((a, b) => a + b, 0) / velocities.length,
      count: allReadings.length,
    };
  };

  const getDayStats = (day: DayLog, type: VelocityType) => {
    const readings = day.readings.filter(r => r.type === type);
    if (readings.length === 0) return null;
    const velocities = readings.map(r => r.velocity);
    return {
      max: Math.max(...velocities),
      avg: velocities.reduce((a, b) => a + b, 0) / velocities.length,
      count: readings.length,
    };
  };

  const currentDay = getCurrentDayLog();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };


  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-4">Daily Velocity Log</h2>
      <p className="text-center text-gray-600 mb-8">
        Track pitching, pull down, and infield velocities day by day
      </p>

      {/* Overall Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {(Object.keys(typeLabels) as VelocityType[]).map((type) => {
          const stats = getTypeStats(type);
          const colors = typeColors[type];
          return (
            <div key={type} className={`${colors.bg} p-4 rounded-lg shadow`}>
              <p className={`text-sm font-semibold ${colors.text} mb-1`}>{typeLabels[type]}</p>
              <p className={`text-3xl font-bold ${colors.text}`}>
                {stats.max > 0 ? `${stats.max}` : '—'}
              </p>
              <p className="text-xs text-gray-500">
                {stats.count > 0 ? `Max mph • Avg: ${stats.avg.toFixed(1)} (${stats.count} readings)` : 'No data yet'}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-6">Add Reading</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(typeLabels) as VelocityType[]).map((type) => {
                  const colors = typeColors[type];
                  return (
                    <button
                      key={type}
                      onClick={() => setVelocityType(type)}
                      className={`px-3 py-2 rounded-lg font-medium transition border-2 text-sm ${
                        velocityType === type
                          ? `${colors.bg} ${colors.text} ${colors.border}`
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {typeLabels[type]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Velocity (mph)</label>
              <input
                type="number"
                value={velocity || ''}
                onChange={(e) => setVelocity(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-2xl font-bold text-center"
                placeholder="0"
              />
            </div>

            <button
              onClick={addReading}
              disabled={velocity <= 0}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add Reading
            </button>
          </div>

          {/* Today's Readings */}
          {currentDay && currentDay.readings.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-semibold mb-3">Today&apos;s Readings ({formatDate(selectedDate)})</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {currentDay.readings.map((reading) => {
                  const colors = typeColors[reading.type];
                  return (
                    <div key={reading.id} className={`flex justify-between items-center ${colors.bg} p-2 rounded`}>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${colors.text} bg-white`}>
                          {typeLabels[reading.type]}
                        </span>
                        <span className={`font-bold ${colors.text}`}>{reading.velocity} mph</span>
                        <span className="text-xs text-gray-500">{reading.time}</span>
                      </div>
                      <button
                        onClick={() => deleteReading(selectedDate, reading.id)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* History Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-6">Daily History</h3>
          
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {days.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No readings logged yet. Add your first velocity!</p>
            ) : (
              days.map((day) => (
                <div key={day.date} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedDay(expandedDay === day.date ? null : day.date)}
                    className="w-full p-4 bg-gray-50 hover:bg-gray-100 transition text-left"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold">{formatDate(day.date)}</p>
                        <p className="text-xs text-gray-500">{day.readings.length} readings</p>
                      </div>
                      <div className="flex gap-3">
                        {(Object.keys(typeLabels) as VelocityType[]).map((type) => {
                          const stats = getDayStats(day, type);
                          if (!stats) return null;
                          const colors = typeColors[type];
                          return (
                            <div key={type} className={`text-center px-2 py-1 rounded ${colors.bg}`}>
                              <p className={`text-xs ${colors.text}`}>{typeLabels[type]}</p>
                              <p className={`font-bold ${colors.text}`}>{stats.max}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </button>
                  
                  {expandedDay === day.date && (
                    <div className="p-4 border-t bg-white">
                      <div className="space-y-2 mb-4">
                        {day.readings.map((reading) => {
                          const colors = typeColors[reading.type];
                          return (
                            <div key={reading.id} className={`flex justify-between items-center ${colors.bg} p-2 rounded`}>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${colors.text} bg-white`}>
                                  {typeLabels[reading.type]}
                                </span>
                                <span className={`font-bold ${colors.text}`}>{reading.velocity} mph</span>
                                <span className="text-xs text-gray-500">{reading.time}</span>
                              </div>
                              <button
                                onClick={() => deleteReading(day.date, reading.id)}
                                className="text-red-500 hover:text-red-700 text-xs"
                              >
                                Delete
                              </button>
                            </div>
                          );
                        })}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Day Notes</label>
                        <textarea
                          value={day.notes}
                          onChange={(e) => updateDayNotes(day.date, e.target.value)}
                          className="w-full px-3 py-2 border rounded text-sm"
                          placeholder="How did you feel? Any observations?"
                          rows={2}
                        />
                      </div>
                    </div>
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
