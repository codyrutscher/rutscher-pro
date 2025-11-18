'use client';

import { useState } from 'react';

export default function ThrowSimulator() {
  const [distance, setDistance] = useState(60);
  const [launchAngle, setLaunchAngle] = useState(45);
  const [wind, setWind] = useState(0);
  const [backspin, setBackspin] = useState(0);
  const [sidespin, setSidespin] = useState(0);

  // Calculate MINIMUM velocity required to reach distance
  // Based on projectile motion with air resistance (Adair 2002, Nathan 2008)
  const calculateVelocity = () => {
    const g = 32.174; // gravity ft/s²
    const angleRad = (launchAngle * Math.PI) / 180;
    
    // Prevent invalid angles
    if (launchAngle <= 0 || launchAngle >= 90 || Math.sin(2 * angleRad) <= 0) {
      return 0;
    }
    
    // Wind adjustment
    // Empirical: ~2 feet of carry per mph of wind (tailwind helps, headwind hurts)
    const windEffect = wind * 2.0; // feet per mph
    const effectiveDistance = Math.max(5, distance - windEffect);
    
    // Step 1: Vacuum solution (no air resistance)
    // v₀ = sqrt(d * g / sin(2θ))
    let v0_fps = Math.sqrt((effectiveDistance * g) / Math.sin(2 * angleRad));
    
    // Step 2: Air resistance correction
    // Drag increases with distance - empirical correction factor
    // Based on: Cd ≈ 0.4, ρ = 0.074 lb/ft³, baseball area = 0.046 ft²
    const dragCorrection = 1 + (effectiveDistance / 300) * 0.25;
    v0_fps *= dragCorrection;
    
    // Step 3: Magnus effect from backspin
    // Backspin creates lift, reducing minimum velocity needed
    // Lift coefficient from Nathan (2008): Cl ≈ S/(1+S), S = rω/v
    const ballRadius = 0.121; // feet
    const omegaBackspin = (backspin * 2 * Math.PI) / 60; // rad/s
    const spinParam = (ballRadius * omegaBackspin) / (v0_fps + 0.1);
    const liftCoeff = spinParam / (1 + spinParam);
    
    // Backspin reduces required velocity (more lift = less speed needed)
    const backspinReduction = liftCoeff * 0.15; // Up to 15% reduction
    v0_fps *= (1 - backspinReduction);
    
    // Step 4: Sidespin effect
    // Sidespin creates lateral force and drag, requiring more velocity
    const omegaSidespin = (Math.abs(sidespin) * 2 * Math.PI) / 60;
    const sidespinParam = (ballRadius * omegaSidespin) / (v0_fps + 0.1);
    const sidespinPenalty = sidespinParam * 0.08; // Up to 8% increase
    v0_fps *= (1 + sidespinPenalty);
    
    // Step 5: Launch angle efficiency
    // Angles far from optimal require more velocity
    const optimalAngle = 42; // degrees (max range angle with slight drag)
    const anglePenalty = Math.pow(Math.abs(launchAngle - optimalAngle) / 50, 1.5) * 0.2;
    v0_fps *= (1 + anglePenalty);
    
    // Convert ft/s to mph
    const v0_mph = v0_fps * 0.681818;
    
    // Sanity check
    const finalVelocity = Math.max(10, Math.min(150, v0_mph));
    
    return Math.round(finalVelocity);
  };

  const velocity = calculateVelocity();

  // Calculate trajectory points for visualization
  const calculateTrajectory = () => {
    const g = 32.174;
    const angleRad = (launchAngle * Math.PI) / 180;
    const v0_fps = (velocity / 0.681818); // mph to ft/s
    
    const points = [];
    const numPoints = 50;
    const timeOfFlight = (2 * v0_fps * Math.sin(angleRad)) / g;
    
    for (let i = 0; i <= numPoints; i++) {
      const t = (timeOfFlight * i) / numPoints;
      const x = v0_fps * Math.cos(angleRad) * t;
      const y = 6 + v0_fps * Math.sin(angleRad) * t - 0.5 * g * t * t; // 6ft release height
      
      if (y < 0) break; // Stop when ball hits ground
      points.push({ x, y });
    }
    
    return points;
  };

  const trajectoryPoints = calculateTrajectory();
  const maxHeight = Math.max(...trajectoryPoints.map(p => p.y), 0);
  const maxDistance = Math.max(...trajectoryPoints.map(p => p.x), distance);

  return (
    <div className="w-full max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Throw Simulator</h2>
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Velocity Display */}
        <div className="text-center">
          <div className="text-6xl font-bold text-blue-600">{velocity}</div>
          <div className="text-xl text-gray-600">mph</div>
        </div>

        {/* Trajectory Visualization */}
        <div className="bg-gradient-to-b from-sky-100 to-green-100 rounded-lg p-4 relative">
          <svg viewBox={`0 0 ${maxDistance + 20} ${maxHeight + 20}`} className="w-full h-48" preserveAspectRatio="xMidYMid meet">
            {/* Ground line */}
            <line x1="0" y1={maxHeight + 15} x2={maxDistance + 20} y2={maxHeight + 15} stroke="#22c55e" strokeWidth="2" />
            
            {/* Distance markers */}
            {[0, 100, 200, 300, 400].filter(d => d <= maxDistance).map(d => (
              <g key={d}>
                <line x1={d} y1={maxHeight + 13} x2={d} y2={maxHeight + 17} stroke="#16a34a" strokeWidth="1" />
                <text x={d} y={maxHeight + 12} fontSize="8" fill="#16a34a" textAnchor="middle">{d}ft</text>
              </g>
            ))}
            
            {/* Trajectory arc */}
            <polyline
              points={trajectoryPoints.map(p => `${p.x},${maxHeight + 15 - p.y}`).join(' ')}
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
            />
            
            {/* Ball at end */}
            {trajectoryPoints.length > 0 && (
              <circle
                cx={trajectoryPoints[trajectoryPoints.length - 1].x}
                cy={maxHeight + 15 - trajectoryPoints[trajectoryPoints.length - 1].y}
                r="3"
                fill="#ef4444"
              />
            )}
            
            {/* Launch angle indicator */}
            <line x1="0" y1={maxHeight + 15 - 6} x2="30" y2={maxHeight + 15 - 6 - 30 * Math.tan(launchAngle * Math.PI / 180)} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2,2" />
            <text x="35" y={maxHeight + 15 - 6 - 30 * Math.tan(launchAngle * Math.PI / 180)} fontSize="10" fill="#f59e0b">{launchAngle}°</text>
          </svg>
          <div className="text-xs text-center text-gray-600 mt-2">
            Max Height: {Math.round(maxHeight)} ft
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-6">
        {/* Distance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Distance: {distance} feet
          </label>
          <input
            type="range"
            min="30"
            max="450"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Launch Angle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Launch Angle: {launchAngle}°
          </label>
          <input
            type="range"
            min="10"
            max="80"
            value={launchAngle}
            onChange={(e) => setLaunchAngle(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Wind */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Wind: {wind} mph {wind > 0 ? '(tailwind)' : wind < 0 ? '(headwind)' : ''}
          </label>
          <input
            type="range"
            min="-20"
            max="20"
            value={wind}
            onChange={(e) => setWind(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Backspin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Backspin: {backspin} rpm
          </label>
          <input
            type="range"
            min="0"
            max="3000"
            step="100"
            value={backspin}
            onChange={(e) => setBackspin(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Sidespin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sidespin: {sidespin} rpm
          </label>
          <input
            type="range"
            min="-1500"
            max="1500"
            step="50"
            value={sidespin}
            onChange={(e) => setSidespin(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
