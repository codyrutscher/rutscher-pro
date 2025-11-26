'use client';

import { useState, useEffect } from 'react';

export default function WeightLossTracker() {
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [targetWeight, setTargetWeight] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [age, setAge] = useState<number>(0);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activityLevel, setActivityLevel] = useState<number>(1.2);
  const [dailyCaloriesConsumed, setDailyCaloriesConsumed] = useState<number>(0);
  const [exerciseCalories, setExerciseCalories] = useState<number>(0);
  
  const [bmr, setBmr] = useState<number>(0);
  const [tdee, setTdee] = useState<number>(0);
  const [dailyDeficit, setDailyDeficit] = useState<number>(0);
  const [daysToGoal, setDaysToGoal] = useState<number>(0);

  useEffect(() => {
    if (currentWeight && height && age) {
      // Mifflin-St Jeor Equation for BMR
      let calculatedBmr;
      if (gender === 'male') {
        calculatedBmr = 10 * (currentWeight * 0.453592) + 6.25 * (height * 2.54) - 5 * age + 5;
      } else {
        calculatedBmr = 10 * (currentWeight * 0.453592) + 6.25 * (height * 2.54) - 5 * age - 161;
      }
      
      setBmr(calculatedBmr);
      
      // TDEE = BMR * Activity Level + Exercise Calories
      const calculatedTdee = calculatedBmr * activityLevel + exerciseCalories;
      setTdee(calculatedTdee);
      
      // Daily calorie deficit
      const deficit = calculatedTdee - dailyCaloriesConsumed;
      setDailyDeficit(deficit);
      
      // Calculate days to goal (3500 calories = 1 lb)
      if (deficit > 0 && targetWeight < currentWeight) {
        const totalWeightToLose = currentWeight - targetWeight;
        const totalCaloriesNeeded = totalWeightToLose * 3500;
        const days = Math.ceil(totalCaloriesNeeded / deficit);
        setDaysToGoal(days);
      } else {
        setDaysToGoal(0);
      }
    }
  }, [currentWeight, targetWeight, height, age, gender, activityLevel, dailyCaloriesConsumed, exerciseCalories]);

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-4">Weight Loss Tracker</h2>
      <p className="text-center text-gray-600 mb-12">
        Calculate your daily calorie needs and predict weight loss timeline
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-6">Your Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Current Weight (lbs)</label>
              <input
                type="number"
                value={currentWeight || ''}
                onChange={(e) => setCurrentWeight(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter current weight"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Target Weight (lbs)</label>
              <input
                type="number"
                value={targetWeight || ''}
                onChange={(e) => setTargetWeight(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter target weight"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Height (inches)</label>
              <input
                type="number"
                value={height || ''}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter height"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Age</label>
              <input
                type="number"
                value={age || ''}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter age"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Activity Level</label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="1.2">Sedentary (little or no exercise)</option>
                <option value="1.375">Lightly active (1-3 days/week)</option>
                <option value="1.55">Moderately active (3-5 days/week)</option>
                <option value="1.725">Very active (6-7 days/week)</option>
                <option value="1.9">Extremely active (athlete)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Daily Calories Consumed</label>
              <input
                type="number"
                value={dailyCaloriesConsumed || ''}
                onChange={(e) => setDailyCaloriesConsumed(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter daily calories"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Exercise Calories Burned</label>
              <input
                type="number"
                value={exerciseCalories || ''}
                onChange={(e) => setExerciseCalories(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter exercise calories"
              />
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-gradient-to-br from-blue-50 to-green-50 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-6">Your Results</h3>
          
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600 mb-1">Basal Metabolic Rate (BMR)</p>
              <p className="text-3xl font-bold text-blue-600">{bmr.toFixed(0)} cal/day</p>
              <p className="text-xs text-gray-500 mt-1">Calories burned at rest</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600 mb-1">Total Daily Energy Expenditure (TDEE)</p>
              <p className="text-3xl font-bold text-green-600">{tdee.toFixed(0)} cal/day</p>
              <p className="text-xs text-gray-500 mt-1">Total calories burned daily</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600 mb-1">Daily Calorie Deficit</p>
              <p className={`text-3xl font-bold ${dailyDeficit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {dailyDeficit > 0 ? '+' : ''}{dailyDeficit.toFixed(0)} cal/day
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {dailyDeficit > 0 ? 'You are in a calorie deficit' : 'You are in a calorie surplus'}
              </p>
            </div>

            {daysToGoal > 0 && (
              <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6 rounded-lg shadow-lg text-white">
                <p className="text-sm mb-2">Estimated Time to Goal</p>
                <p className="text-4xl font-bold mb-2">{daysToGoal} days</p>
                <p className="text-sm opacity-90">
                  ({(daysToGoal / 7).toFixed(1)} weeks or {(daysToGoal / 30).toFixed(1)} months)
                </p>
                <p className="text-xs mt-3 opacity-80">
                  Weight to lose: {(currentWeight - targetWeight).toFixed(1)} lbs
                </p>
              </div>
            )}

            {dailyDeficit <= 0 && currentWeight > 0 && (
              <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700 font-semibold">
                  You need to create a calorie deficit to lose weight. Try reducing calories consumed or increasing exercise.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h4 className="font-bold text-lg mb-2">How it works:</h4>
        <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
          <li>BMR calculated using Mifflin-St Jeor Equation (most accurate for modern populations)</li>
          <li>TDEE = BMR × Activity Level + Exercise Calories</li>
          <li>Daily Deficit = TDEE - Calories Consumed</li>
          <li>3,500 calories = 1 pound of body weight</li>
          <li>Safe weight loss: 1-2 lbs per week (500-1000 cal deficit/day)</li>
        </ul>
      </div>
    </div>
  );
}
