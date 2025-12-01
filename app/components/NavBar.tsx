'use client';

export default function NavBar() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-gray-800 w-full sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-8">
            <button
              onClick={() => scrollToSection('weight-loss')}
              className="text-white hover:text-blue-400 transition font-semibold"
            >
              Weight Loss
            </button>
            <button
              onClick={() => scrollToSection('programming')}
              className="text-white hover:text-blue-400 transition font-semibold"
            >
              Programming
            </button>
            <button
              onClick={() => scrollToSection('throwing-tracker')}
              className="text-white hover:text-blue-400 transition font-semibold"
            >
              Throwing Tracker
            </button>
            <button
              onClick={() => scrollToSection('velocity-tracker')}
              className="text-white hover:text-blue-400 transition font-semibold"
            >
              Velocity Tracker
            </button>
            <button
              onClick={() => scrollToSection('exercise-database')}
              className="text-white hover:text-blue-400 transition font-semibold"
            >
              Exercises
            </button>
            <button
              onClick={() => scrollToSection('simulator')}
              className="text-white hover:text-blue-400 transition font-semibold"
            >
              Simulator
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
