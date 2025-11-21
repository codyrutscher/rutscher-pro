export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: number;
}

export interface WorkoutDay {
  title: string;
  type: 'workout' | 'throwing';
  exercises: WorkoutExercise[];
  description?: string;
}

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
