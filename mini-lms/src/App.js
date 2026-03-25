import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CourseListPage from './pages/CourseListPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LessonViewPage from './pages/LessonViewPage';
import useProgress from './hooks/useProgress';

function App() {
  const progress = useProgress();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CourseListPage progress={progress} />} />
        <Route path="/course/:courseId" element={<CourseDetailPage progress={progress} />} />
        <Route path="/lesson/:lessonId" element={<LessonViewPage progress={progress} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;