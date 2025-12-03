'use client';

import { useState, useEffect } from 'react';
import { supabase, VelocityReading } from '../../lib/supabase';

type VelocityType = 'pitching' | 'pulldown' | 'infield' | 'knees';

const typeLabels: Record<VelocityType, string> = {
  pitching: 'Pitching',
  pulldown: 'Pull Down',
  infield: 'Infield',
  knees: 'Knees',
};

const typeColors: Record<VelocityType, { bg: string; text: string; border: string }> = {
  pitching: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
  pulldown: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
  infield: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
  knees: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
};

export default function DailyVelocityLog() {
  const [readings, setReadings] = useState<VelocityReading[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [velocity, setVelocity] = useState<number>(0);
  const [velocityType, setVelocityType] = useState<VelocityType>('pitching');
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch readings from Supabase
  useEffect(() => {
    fetchReadings();
  }, []);

  const fetchReadings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('velocity_readings')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching readings:', error);
    } else {
      setReadings(data || []);
    }
    setLoading(false);
  };

  const addReading = async () => {
    if (velocity <= 0) return;
    setSaving(true);

    const newReading: VelocityReading = {
      velocity,
      type: velocityType,
      date: selectedDate,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const { data, error } = await supabase
      .from('velocity_readings')
      .insert([newReading])
      .select()
      .single();

    if (error) {
      console.error('Error adding reading:', error);
      alert('Failed to save reading. Please try again.');
    } else if (data) {
      setReadings(prev => [data, ...prev]);
      setVelocity(0);
    }
    setSaving(false);
  };

  const deleteReading = async (id: string) => {
    const { error } = await supabase
      .from('velocity_readings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting reading:', error);
    } else {
      setReadings(prev => prev.filter(r => r.id !== id));
    }
  };

  // Group readings by date
  const groupedByDate = readings.reduce((acc, reading) => {
    if (!acc[reading.date]) {
      acc[reading.date] = [];
    }
    acc[reading.date].push(reading);
    return acc;
  }, {} as Record<string, VelocityReading[]>);

  const sortedDates = Object.keys(groupedByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const getTypeStats = (type: VelocityType) => {
    const typeReadings = readings.filter(r => r.type === type);
    if (typeReadings.length === 0) return { max: 0, avg: 0, count: 0 };
    const velocities = typeReadings.map(r => r.velocity);
    return {
      max: Math.max(...velocities),
      avg: velocities.reduce((a, b) => a + b, 0) / velocities.length,
      count: typeReadings.length,
    };
  };

  const getDayStats = (dayReadings: VelocityReading[], type: VelocityType) => {
    const typeReadings = dayReadings.filter(r => r.type === type);
    if (typeReadings.length === 0) return null;
    const velocities = typeReadings.map(r => r.velocity);
    return {
      max: Math.max(...velocities),
      count: typeReadings.length,
    };
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const currentDayReadings = groupedByDate[selectedDate] || [];


  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-4">Daily Velocity Log</h2>
      <p className="text-center text-gray-600 mb-8">
        Track pitching, pull down, and infield velocities day by day
      </p>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading readings...</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-black">Add Reading</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-black">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-black">Type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
                <label className="block text-sm font-semibold mb-2 text-black">Velocity (mph)</label>
                <input
                  type="number"
                  value={velocity || ''}
                  onChange={(e) => setVelocity(Number(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-2xl font-bold text-center text-black"
                  placeholder="0"
                />
              </div>

              <button
                onClick={addReading}
                disabled={velocity <= 0 || saving}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Add Reading'}
              </button>
            </div>

            {/* Today's Readings */}
            {currentDayReadings.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold mb-3 text-black">Readings for {formatDate(selectedDate)}</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {currentDayReadings.map((reading) => {
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
                          onClick={() => reading.id && deleteReading(reading.id)}
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
            <h3 className="text-2xl font-bold mb-6 text-black">Daily History</h3>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {sortedDates.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No readings logged yet. Add your first velocity!</p>
              ) : (
                sortedDates.map((date) => {
                  const dayReadings = groupedByDate[date];
                  return (
                    <div key={date} className="border rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedDay(expandedDay === date ? null : date)}
                        className="w-full p-4 bg-gray-50 hover:bg-gray-100 transition text-left"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-bold text-black">{formatDate(date)}</p>
                            <p className="text-xs text-gray-500">{dayReadings.length} readings</p>
                          </div>
                          <div className="flex gap-3">
                            {(Object.keys(typeLabels) as VelocityType[]).map((type) => {
                              const stats = getDayStats(dayReadings, type);
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
                      
                      {expandedDay === date && (
                        <div className="p-4 border-t bg-white">
                          <div className="space-y-2">
                            {dayReadings.map((reading) => {
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
                                    onClick={() => reading.id && deleteReading(reading.id)}
                                    className="text-red-500 hover:text-red-700 text-xs"
                                  >
                                    Delete
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
