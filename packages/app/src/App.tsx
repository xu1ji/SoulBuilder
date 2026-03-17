import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import AgentListPage from './pages/AgentListPage'
import AgentDetailPage from './pages/AgentDetailPage'
import TrainingModePage from './pages/TrainingModePage'
import TrainingSessionPage from './pages/TrainingSessionPage'
import TrainingAnimationPage from './pages/TrainingAnimationPage'
import TrainingResultPage from './pages/TrainingResultPage'
import SaveConfirmPage from './pages/SaveConfirmPage'
import UpgradeCompletePage from './pages/UpgradeCompletePage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<AgentListPage />} />
        <Route path="agents/:id" element={<AgentDetailPage />} />
        <Route path="agents/:id/train" element={<TrainingModePage />} />
        <Route path="agents/:id/train/session" element={<TrainingSessionPage />} />
        <Route path="agents/:id/train/result" element={<TrainingResultPage />} />
        <Route path="agents/:id/train/confirm" element={<SaveConfirmPage />} />
        <Route path="agents/:id/train/done" element={<UpgradeCompletePage />} />
      </Route>
      {/* 动画页面单独路由，不使用 Layout，实现全屏效果 */}
      <Route path="/agents/:id/train/animation" element={<TrainingAnimationPage />} />
    </Routes>
  )
}
