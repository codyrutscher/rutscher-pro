import Link from 'next/link';
import { Exercise } from '../data/exercises';

interface ExerciseCardProps {
    exercise: Exercise;
}

export default function ExerciseCard({ exercise }: ExerciseCardProps) {
    return (
        <Link href={`/exercises/${exercise.id}`} className="group">
            <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-white dark:bg-gray-800 h-full flex flex-col">
                <div className="relative h-48 w-full overflow-hidden">
                    <img
                        src={exercise.imageUrl}
                        alt={exercise.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        {exercise.category}
                    </div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                        {exercise.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4 flex-grow">
                        {exercise.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                        <span className={`text-xs px-2 py-1 rounded-full ${exercise.difficulty === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                                exercise.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                            }`}>
                            {exercise.difficulty}
                        </span>
                        <span className="text-blue-600 text-sm font-medium group-hover:underline">
                            View Details &rarr;
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
