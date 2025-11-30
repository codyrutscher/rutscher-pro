export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: number;
  weight?: string; // Weight recommendation for 200lb athlete
}

export interface WorkoutDay {
  title: string;
  type: 'workout' | 'throwing' | 'recovery';
  exercises: WorkoutExercise[];
  description?: string;
  focus?: string;
}

// 7-Day Velocity Training Program for 200lb, 30-year-old throwing 81mph
// Goal: Increase velocity through power development, rotational strength, and arm care
export const velocityProgram: WorkoutDay[] = [
  {
    title: 'Monday - Lower Power',
    type: 'workout',
    focus: 'Explosive lower body power for ground force production',
    exercises: [
      { name: 'Box Jumps (24")', sets: 4, reps: 5, weight: 'Bodyweight' },
      { name: 'Trap Bar Deadlift', sets: 4, reps: 5, weight: '225-275 lbs' },
      { name: 'Front Squat', sets: 4, reps: 6, weight: '155-185 lbs' },
      { name: 'Bulgarian Split Squat', sets: 3, reps: 8, weight: '40-50 lb DBs' },
      { name: 'Lateral Bounds', sets: 3, reps: 6, weight: 'Bodyweight' },
      { name: 'Glute Bridge (Barbell)', sets: 3, reps: 10, weight: '135-185 lbs' },
    ],
  },
  {
    title: 'Tuesday - Upper Push/Pull + Throwing',
    type: 'workout',
    focus: 'Horizontal push/pull balance with light throwing',
    exercises: [
      { name: 'DB Bench Press', sets: 4, reps: 6, weight: '70-85 lb DBs' },
      { name: 'Weighted Pull-ups', sets: 4, reps: 6, weight: '+25-45 lbs' },
      { name: 'Single Arm Cable Row', sets: 3, reps: 10, weight: '50-70 lbs' },
      { name: 'Landmine Press', sets: 3, reps: 8, weight: '45-70 lbs' },
      { name: 'Face Pulls', sets: 3, reps: 15, weight: '30-40 lbs' },
      { name: 'Band Pull-Aparts', sets: 3, reps: 20, weight: 'Light band' },
    ],
    description: 'Follow with 30 throws: warm-up to 75% intensity',
  },
  {
    title: 'Wednesday - Rotational Power + Arm Care',
    type: 'workout',
    focus: 'Core rotation and shoulder stability',
    exercises: [
      { name: 'Med Ball Rotational Throws', sets: 4, reps: 6, weight: '8-10 lb ball' },
      { name: 'Cable Woodchops (High to Low)', sets: 3, reps: 10, weight: '40-60 lbs' },
      { name: 'Pallof Press', sets: 3, reps: 12, weight: '30-40 lbs' },
      { name: 'Half-Kneeling Cable Lift', sets: 3, reps: 10, weight: '30-40 lbs' },
      { name: 'Prone Y-T-W Raises', sets: 2, reps: 10, weight: '5-8 lb DBs' },
      { name: 'External Rotation (Side-lying)', sets: 2, reps: 15, weight: '5-8 lbs' },
      { name: 'Sleeper Stretch', sets: 2, reps: 30, weight: '30 sec hold' },
    ],
  },
  {
    title: 'Thursday - Lower Strength',
    type: 'workout',
    focus: 'Single-leg strength and hip mobility',
    exercises: [
      { name: 'Back Squat', sets: 4, reps: 5, weight: '185-225 lbs' },
      { name: 'Romanian Deadlift', sets: 4, reps: 8, weight: '155-185 lbs' },
      { name: 'Walking Lunges', sets: 3, reps: 10, weight: '40-50 lb DBs' },
      { name: 'Single Leg RDL', sets: 3, reps: 8, weight: '30-40 lb DB' },
      { name: 'Hip Flexor March (Banded)', sets: 3, reps: 12, weight: 'Medium band' },
      { name: 'Calf Raises', sets: 3, reps: 15, weight: '135-185 lbs' },
    ],
  },
  {
    title: 'Friday - Upper Power + Throwing',
    type: 'workout',
    focus: 'Explosive upper body with high-intent throwing',
    exercises: [
      { name: 'Med Ball Chest Pass', sets: 4, reps: 6, weight: '10-12 lb ball' },
      { name: 'Explosive Push-ups', sets: 4, reps: 8, weight: 'Bodyweight' },
      { name: 'Lat Pulldown', sets: 4, reps: 8, weight: '120-150 lbs' },
      { name: 'DB Incline Press', sets: 3, reps: 8, weight: '60-75 lb DBs' },
      { name: 'Bent Over Row', sets: 3, reps: 8, weight: '135-165 lbs' },
      { name: 'Tricep Dips', sets: 3, reps: 10, weight: '+25-45 lbs' },
    ],
    description: 'Follow with 40 throws: build to 85-90% intensity, include weighted balls',
  },
  {
    title: 'Saturday - Long Toss Day',
    type: 'throwing',
    focus: 'Arm strength and extension through long toss',
    exercises: [
      { name: 'Dynamic Warm-up', sets: 1, reps: 10, weight: '10 min' },
      { name: 'Band Arm Care Circuit', sets: 1, reps: 15, weight: 'Light band' },
      { name: 'Wrist Weights Throws', sets: 1, reps: 10, weight: '1 lb weights' },
    ],
    description: 'Long toss progression: Start at 60ft, build to max distance (aim for 250-300ft), then compress back. Total 50-60 throws. Include 10 pull-downs at end.',
  },
  {
    title: 'Sunday - Active Recovery',
    type: 'recovery',
    focus: 'Recovery, mobility, and light arm care',
    exercises: [
      { name: 'Foam Rolling (Full Body)', sets: 1, reps: 1, weight: '15 min' },
      { name: 'Hip 90/90 Stretch', sets: 2, reps: 30, weight: '30 sec hold' },
      { name: 'Thoracic Spine Rotation', sets: 2, reps: 10, weight: 'Bodyweight' },
      { name: 'Cat-Cow Stretch', sets: 2, reps: 10, weight: 'Bodyweight' },
      { name: 'Light Band External Rotation', sets: 2, reps: 15, weight: 'Light band' },
      { name: 'Walking or Light Jog', sets: 1, reps: 1, weight: '20-30 min' },
    ],
    description: 'No throwing. Focus on recovery and preparing for next week.',
  },
];

// Weight Progression Guide (increase every 2-3 weeks if completing all reps)
export const progressionGuide = {
  week1_4: 'Use weights at lower end of ranges. Focus on form.',
  week5_8: 'Increase weights by 5-10%. Add 1 rep to throwing sessions.',
  week9_12: 'Push to upper end of weight ranges. Max effort throwing days.',
  deload: 'Every 4th week: reduce weights by 20%, reduce throwing volume by 30%',
};

// Legacy program (keeping for backwards compatibility)
export const weeklyProgram: WorkoutDay[] = [
  {
    title: 'Day 1 - Workout',
    type: 'workout',
    exercises: [
      { name: 'Single hand bent over rows', sets: 3, reps: 8 },
      { name: 'Dumbbell bench with twist', sets: 3, reps: 6 },
      { name: 'Cable machine throwing motion with resistant', sets: 2, reps: 20 },
      { name: 'Cable machine rows/pull downs', sets: 3, reps: 8 },
      { name: 'Pull ups', sets: 0, reps: 0 },
      { name: 'Squat', sets: 3, reps: 6 },
      { name: 'Run .25 mile', sets: 0, reps: 0 },
      { name: 'Shoulder raises', sets: 3, reps: 15 },
    ],
  },
  {
    title: 'Day 2 - Workout',
    type: 'workout',
    exercises: [
      { name: 'Tricep extensions', sets: 3, reps: 8 },
      { name: 'Machine rows straight on', sets: 3, reps: 8 },
      { name: 'Machine rows pull down', sets: 3, reps: 6 },
      { name: 'Cable machine throwing motion with resistant', sets: 2, reps: 20 },
      { name: 'Pull ups', sets: 0, reps: 0 },
      { name: 'Dead lifts', sets: 3, reps: 6 },
      { name: 'Shoulder raises', sets: 3, reps: 15 },
    ],
  },
  {
    title: 'Day 1 - Throwing',
    type: 'throwing',
    description: '50 throws at increasing velocity with first 20 throws including the gradys balls at varying speeds and weights',
    exercises: [],
  },
  {
    title: 'Day 2 - Throwing',
    type: 'throwing',
    description: '50 throws at increasing velocity with first 20 throws including the gradys balls at varying speeds and weights',
    exercises: [],
  },
  {
    title: 'Day 3 - Throwing',
    type: 'throwing',
    description: '50 throws at increasing velocity with first 20 throws including the gradys balls at varying speeds and weights',
    exercises: [],
  },
];
