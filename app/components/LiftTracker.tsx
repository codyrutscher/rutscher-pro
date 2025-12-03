'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

type LiftType = 
  | 'deadlift' 
  | 'back_squat' 
  | 'front_squat' 
  | 'lunge' 
  | 'bench' 
  | 'dumbbell_bench' 
  | 'cable_throws' 
  | 'cable_pulls' 
  | 'rows' 
  | 'leg_press' 
  | 'tricep_extensions';

interface LiftRecord {
  id?: string;
  lift_type: LiftType;
  weight: number;
  reps: number;
  sets: number;
  date: string;
  notes?: string;
  created_at?: string;
}

const liftLabels: Record<LiftType, string> = {
  deadlift: 'Deadlift',
  back_squat: 'Back Squat',
  front_squat: 'Front Squat',
  lunge: 'Lunge',
  bench: 'Bench Press',
  dumbbell_bench: 'DB Bench',
  cable_throws: 'Cable Throws',
  cable_pulls: 'Cable Pulls',
  rows: 'Rows',
  leg_press: 'Leg Press',
  tricep_extensions: 'Tricep Ext',
};

const liftColors: Record<LiftType, string> = {
  deadlift: 'bg-red-100 text-red-700 border-red-200',
  back_squat: 'bg-blue-100 text-blue-700 border-blue-200',
  front_squat: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  lunge: 'bg-purple-100 text-purple-700 border-purple-200',
  bench: 'bg-green-100 text-green-700 border-green-200',
  dumbbell_bench: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  cable_throws: 'bg-orange-100 text-orange-700 border-orange-200',
  cable_pulls: 'bg-amber-100 text-amber-700 border-amber-200',
  rows: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  leg_press: 'bg-pink-100 text-pink-700 border-pink-200',
  tricep_extensions: 'bg-violet-100 text-violet-700 border-violet-200',
};

export default function LiftTracker() {
  const [records, setRecords] = useState<LiftRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [liftType, setLiftType] = useState<LiftType>('deadlift');
  const [weight, setWeight] = useState<number>(0);
  const [reps, setReps] = useState<number>(0);
  const [sets, setSets] = useState<number>(1);
  const [notes, setNotes] = useState('');
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('lift_records')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching lift records:', error);
    } else {
      setRecords(data || []);
    }
    setLoading(false);
  };

  const addRecord = async () => {
    if (weight <= 0 || reps <= 0) return;
    setSaving(true);

    const newRecord: LiftRecord = {
      lift_type: liftType,
      weight,
      reps,
      sets,
      date: selectedDate,
      notes: notes || undefined,
    };

    const { data, error } = await supabase
      .from('lift_records')
      .insert([newRecord])
      .select()
      .single();

    if (error) {
      console.error('Error adding lift record:', error);
      alert('Failed to save. Please try again.');
    } else if (data) {
      setRecords(prev => [data, ...prev]);
      setWeight(0);
      setReps(0);
      setSets(1);
      setNotes('');
    }
    setSaving(false);
  };

  const deleteRecord = async (id: string) => {
    const { error } = await supabase
      .from('lift_records')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting record:', error);
    } else {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  // Group by date
  const groupedByDate = records.reduce((acc, record) => {
    if (!acc[record.date]) acc[record.date] = [];
    acc[record.date].push(record);
    return acc;
  }, {} as Record<string, LiftRecord[]>);

  const sortedDates = Object.keys(groupedByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  // Get PR (max weight) for each lift
  const getPR = (type: LiftType) => {
    const typeRecords = records.filter(r => r.lift_type === type);
    if (typeRecords.length === 0) return null;
    return Math.max(...typeRecords.map(r => r.weight));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const currentDayRecords = groupedByDate[selectedDate] || [];


  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-4">Lift Tracker</h2>
      <p className="text-center text-gray-600 mb-8">
        Track your lifts and PRs over time
      </p>

      {/* PR Stats */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
        {(Object.keys(liftLabels) as LiftType[]).map((type) => {
          const pr = getPR(type);
          return (
            <div key={type} className={`p-3 rounded-lg shadow border ${liftColors[type]}`}>
              <p className="text-xs font-semibold mb-1">{liftLabels[type]}</p>
              <p className="text-xl font-bold">
                {pr ? `${pr} lbs` : '—'}
              </p>
              <p className="text-xs opacity-70">PR</p>
            </div>
          );
        })}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading records...</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-black">Log Lift</h3>
            
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
                <label className="block text-sm font-semibold mb-2 text-black">Exercise</label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {(Object.keys(liftLabels) as LiftType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setLiftType(type)}
                      className={`px-2 py-2 rounded-lg font-medium transition border-2 text-xs ${
                        liftType === type
                          ? liftColors[type]
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {liftLabels[type]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-black">Weight (lbs)</label>
                  <input
                    type="number"
                    value={weight || ''}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black text-center font-bold"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-black">Reps</label>
                  <input
                    type="number"
                    value={reps || ''}
                    onChange={(e) => setReps(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black text-center font-bold"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-black">Sets</label>
                  <input
                    type="number"
                    value={sets || ''}
                    onChange={(e) => setSets(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black text-center font-bold"
                    placeholder="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-black">Notes (optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="How did it feel?"
                />
              </div>

              <button
                onClick={addRecord}
                disabled={weight <= 0 || reps <= 0 || saving}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Add Lift'}
              </button>
            </div>

            {/* Today's Lifts */}
            {currentDayRecords.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold mb-3 text-black">Lifts for {formatDate(selectedDate)}</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {currentDayRecords.map((record) => (
                    <div key={record.id} className={`flex justify-between items-center p-2 rounded border ${liftColors[record.lift_type]}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold">{liftLabels[record.lift_type]}</span>
                        <span className="font-bold">{record.weight} lbs</span>
                        <span className="text-sm">× {record.reps} × {record.sets}</span>
                      </div>
                      <button
                        onClick={() => record.id && deleteRecord(record.id)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* History Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-black">Lift History</h3>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {sortedDates.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No lifts logged yet. Add your first lift!</p>
              ) : (
                sortedDates.map((date) => {
                  const dayRecords = groupedByDate[date];
                  return (
                    <div key={date} className="border rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedDay(expandedDay === date ? null : date)}
                        className="w-full p-4 bg-gray-50 hover:bg-gray-100 transition text-left"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-bold text-black">{formatDate(date)}</p>
                            <p className="text-xs text-gray-500">{dayRecords.length} lifts</p>
                          </div>
                          <div className="flex flex-wrap gap-1 max-w-[200px] justify-end">
                            {[...new Set(dayRecords.map(r => r.lift_type))].map((type) => (
                              <span key={type} className={`text-xs px-2 py-0.5 rounded ${liftColors[type]}`}>
                                {liftLabels[type]}
                              </span>
                            ))}
                          </div>
                        </div>
                      </button>
                      
                      {expandedDay === date && (
                        <div className="p-4 border-t bg-white space-y-2">
                          {dayRecords.map((record) => (
                            <div key={record.id} className={`flex justify-between items-center p-2 rounded border ${liftColors[record.lift_type]}`}>
                              <div>
                                <span className="text-xs font-semibold">{liftLabels[record.lift_type]}</span>
                                <span className="font-bold ml-2">{record.weight} lbs</span>
                                <span className="text-sm ml-1">× {record.reps} reps × {record.sets} sets</span>
                                {record.notes && <p className="text-xs opacity-70 mt-1">{record.notes}</p>}
                              </div>
                              <button
                                onClick={() => record.id && deleteRecord(record.id)}
                                className="text-red-500 hover:text-red-700 text-xs"
                              >
                                Delete
                              </button>
                            </div>
                          ))}
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
