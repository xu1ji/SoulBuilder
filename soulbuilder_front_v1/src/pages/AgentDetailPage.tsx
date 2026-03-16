import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { useStore } from '../stores/useStore';
import { RankBadge } from '../components/ui/RankBadge';
import { ProgressBar } from '../components/ui/ProgressBar';

const AgentDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const agent = useStore((state) => state.agents.find(a => a.id === id));

  if (!agent) return <div>Agent not found</div>;

  // Mock assessment data
  const assessment = {
    dimensions: [
      { subject: '身份档案', value: 95, fullMark: 100, weight: 22 },
      { subject: '灵魂深度', value: 92, fullMark: 100, weight: 22 },
      { subject: '雇主信息', value: 88, fullMark: 100, weight: 17 },
      { subject: '工具配置', value: 98, fullMark: 100, weight: 17 },
      { subject: '协作关系', value: 85, fullMark: 100, weight: 11 },
      { subject: '记忆管理', value: 94, fullMark: 100, weight: 11 },
    ],
    details: {
      identityFields: ['姓名', '岗位', '性格特质', '沟通风格', '背景故事'],
      soulFields: ['使命', '价值观', '边界底线'],
      userFields: ['行业', '场景', '目标'],
      suggestions: [
        '可以添加更多行业场景细节，让 Agent 更了解你的业务',
        '建议为 Agent 配置更多协作关系，形成 Agent 团队协作'
      ]
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="text-2xl hover:scale-110 transition-transform">←</button>
          <div>
            <h1 className="text-2xl font-bold">{agent.name}</h1>
            <p className="text-sm text-gray-500">{agent.title}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="matrix-btn-secondary">导出</button>
          <Link to={`/agents/${agent.id}/train`} className="matrix-btn-primary">训练</Link>
        </div>
      </header>

      <div className="bg-gray-50 rounded-2xl p-6 mb-8 flex items-center gap-8">
        <RankBadge rank={agent.rank} score={agent.score} size="lg" />
        <div>
          <div className="text-sm text-gray-500 mb-1">综合评分</div>
          <div className="text-4xl font-bold text-gray-900">{agent.score}</div>
        </div>
        <div className="h-12 w-px bg-gray-200 mx-4" />
        <div>
          <div className="text-sm text-gray-500 mb-1">最后训练时间</div>
          <div className="text-lg font-medium">{agent.lastTrained || '从未训练'}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="matrix-card h-[400px]">
          <h3 className="font-bold mb-4">能力雷达图</h3>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={assessment.dimensions}>
              <PolarGrid stroke="#E5E7EB" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 12 }} />
              <Radar
                name={agent.name}
                dataKey="value"
                stroke="#00FF41"
                fill="#00FF41"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="matrix-card">
          <h3 className="font-bold mb-6">评估详情</h3>
          <div className="space-y-6">
            {assessment.dimensions.map((dim) => (
              <div key={dim.subject}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">{dim.subject}</span>
                  <span className="text-gray-400">权重 {dim.weight}%</span>
                </div>
                <ProgressBar value={dim.value} showValue />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="matrix-card">
          <h3 className="font-bold mb-4">已填写字段</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">身份档案</h4>
              <div className="flex flex-wrap gap-2">
                {assessment.details.identityFields.map(f => (
                  <span key={f} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">{f}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">灵魂深度</h4>
              <div className="flex flex-wrap gap-2">
                {assessment.details.soulFields.map(f => (
                  <span key={f} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">{f}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="matrix-card">
          <h3 className="font-bold mb-4">改进建议</h3>
          <ul className="space-y-3">
            {assessment.details.suggestions.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-600">
                <span className="text-matrix-green">💡</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailPage;
