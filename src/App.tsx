import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './components/Login';
import { Rules } from './components/Rules';
import { Exam } from './components/Exam';
import { Result } from './components/Result';
import { FacultyPage } from './components/FacultyPage';
import { useExamStore } from './store/examStore';
import './App.css';

function App() {
  const { examStarted, examCompleted } = useExamStore();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/rules"
          element={
            <Rules />
          }
        />
        <Route
          path="/exam"
          element={
            examStarted ? <Exam /> : <Navigate to="/rules" />
          }
        />
        <Route
          path="/result"
          element={
            examCompleted ? <Result /> : <Navigate to="/exam" />
          }
        />
        <Route path="/admin" element={<FacultyPage />} />
      </Routes>
    </Router>
  );
}

export default App;