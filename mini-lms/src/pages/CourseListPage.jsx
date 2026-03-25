import { courses } from '../data/courses';
import CourseCard from '../components/CourseCard';

function CourseListPage({ progress }) {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
        <p className="text-gray-500 text-sm mt-1">
          {courses.length} courses available
        </p>
      </div>

      {/* Course Grid */}
      <div className="p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              progress={progress}
            />
          ))}
        </div>
      </div>

    </div>
  );
}

export default CourseListPage;
