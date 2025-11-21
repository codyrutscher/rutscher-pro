import { Exercise } from '../data/exercises';
import ExerciseCard from './ExerciseCard';

interface ExerciseGridProps {
    exercises: Exercise[];
}

export default function ExerciseGrid({ exercises }: ExerciseGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            {exercises.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
        </div>
    );
}
