/**
 * @soulbuilder/assessment
 *
 * SoulBuilder 2.0 Agent 评估引擎
 *
 * @packageDocumentation
 */

// 核心引擎
export { AssessmentEngine, assessmentEngine } from './AssessmentEngine'

// 解析器
export {
  OpenClawParser,
  openClawParser,
  MarkdownParser,
  parseMarkdown,
} from './parsers'
export type { WorkspaceFiles, ParsedField, Section } from './parsers'

// 评分器
export {
  ScoringEngine,
  scoringEngine,
  identityScorer,
  soulScorer,
  userScorer,
  toolsScorer,
  agentsScorer,
  memoryScorer,
} from './scorers'
export type { ScorerResult, DimensionKey } from './scorers'

// 组件
export { RadarChart } from './components'
export type { RadarChartProps } from './components'

// 重新导出 shared 中的相关类型
export type {
  Agent,
  Assessment,
  AssessmentDimensions,
  AssessmentDetails,
  AgentRank,
  AgentStatus,
} from '@soulbuilder/shared'
export {
  ASSESSMENT_WEIGHTS,
  RANK_THRESHOLDS,
  calculateRank,
  calculateTotalScore,
  generateRadarData,
  MATRIX_COLORS,
} from '@soulbuilder/shared'
