import { logger, type IAgentRuntime, type Project, type ProjectAgent } from '@elizaos/core';
import starterPlugin from './plugin.ts';
import snapshotProposalsPlugin from '../plugin-snapshot-box/src/index.ts';
import { character, legalRiskAgent, orchestrator, tokenomicsAgent, technicalFeasibilityAgent, voterSentimentAgent, governanceProcessAgent } from './character.ts';

const initCharacter = ({ runtime }: { runtime: IAgentRuntime }) => {
  logger.info('Initializing character');
  logger.info('Name: ', character.name);
};

export const projectAgent: ProjectAgent = {
  character,
  init: async (runtime: IAgentRuntime) => await initCharacter({ runtime }),
  plugins: [starterPlugin],
};

export const orchestratorAgent: ProjectAgent = {
  character: orchestrator,
  init: async (runtime: IAgentRuntime) => await initCharacter({ runtime }),
  plugins: [starterPlugin, snapshotProposalsPlugin],
};

// Legal Risk Agent
export const legalAgent: ProjectAgent = {
  character: legalRiskAgent,
  init: async (runtime: IAgentRuntime) => await initCharacter({ runtime }),
  plugins: [starterPlugin, snapshotProposalsPlugin],
};

// Tokenomics Agent
export const tokenomicsAgentInstance: ProjectAgent = {
  character: tokenomicsAgent,
  init: async (runtime: IAgentRuntime) => await initCharacter({ runtime }),
  plugins: [starterPlugin, snapshotProposalsPlugin],
};

// Technical Feasibility Agent
export const technicalAgent: ProjectAgent = {
  character: technicalFeasibilityAgent,
  init: async (runtime: IAgentRuntime) => await initCharacter({ runtime }),
  plugins: [starterPlugin, snapshotProposalsPlugin],
};

// Voter Sentiment Agent
export const sentimentAgent: ProjectAgent = {
  character: voterSentimentAgent,
  init: async (runtime: IAgentRuntime) => await initCharacter({ runtime }),
  plugins: [starterPlugin, snapshotProposalsPlugin],
};

// Governance Process Agent
export const governanceAgent: ProjectAgent = {
  character: governanceProcessAgent,
  init: async (runtime: IAgentRuntime) => await initCharacter({ runtime }),
  plugins: [starterPlugin, snapshotProposalsPlugin],
};

const project: Project = {
  agents: [projectAgent, orchestratorAgent, legalAgent, tokenomicsAgentInstance, technicalAgent, sentimentAgent, governanceAgent],
};

// Export test suites for the test runner
export { testSuites } from './__tests__/e2e';
export { character } from './character.ts';

export default project;
