import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ProgressProvider } from "./hooks/useUserProgress";
import { AuthPage } from "./pages/AuthPage";
import { CourseLevelMapPage } from "./pages/CourseLevelMapPage";
import { CoursesPage } from "./pages/CoursesPage";
import { HomePage } from "./pages/HomePage";
import { LessonPage } from "./pages/LessonPage";
import { ProfilePage } from "./pages/ProfilePage";

function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/corsi" element={<CoursesPage />} />
            <Route path="/corsi/:courseId" element={<CourseLevelMapPage />} />
            <Route
              path="/corsi/:courseId/:lessonId"
              element={<LessonPage />}
            />
            <Route path="/tu" element={<ProfilePage />} />
            <Route path="/accedi" element={<AuthPage />} />
          </Routes>
        </BrowserRouter>
      </ProgressProvider>
    </AuthProvider>
  );
}

export default App;
