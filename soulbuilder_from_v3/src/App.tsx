import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AgentListPage from './pages/AgentListPage';
import AgentDetailPage from './pages/AgentDetailPage';
import TrainingModePage from './pages/TrainingModePage';
import TrainingSessionPage from './pages/TrainingSessionPage';
import TrainingAnimationPage from './pages/TrainingAnimationPage';
import TrainingCompletePage from './pages/TrainingCompletePage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<AgentListPage />} />
          <Route path="/agents/:id" element={<AgentDetailPage />} />
          <Route path="/agents/:id/train" element={<TrainingModePage />} />
          <Route path="/agents/:id/train/session" element={<TrainingSessionPage />} />
          <Route path="/agents/:id/train/animation" element={<TrainingAnimationPage />} />
          <Route path="/agents/:id/train/complete" element={<TrainingCompletePage />} />
        </Routes>
      </div>
    </Router>
  );
}
