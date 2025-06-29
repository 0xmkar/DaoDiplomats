import { Provider, IAgentRuntime } from '@elizaos/core';
import { SnapshotService, Proposal } from '../service';

export const snapshotProposalsProvider: Provider = {
  name: 'snapshotProposals',
  description: 'Provides open Snapshot proposals for yam.eth',
  async get(runtime: IAgentRuntime) {
    const snapshotService = runtime.getService('SnapshotService') as SnapshotService;
    if (!snapshotService) {
      console.error('SnapshotService not available');
      return [];
    }
    return snapshotService.getProposals();
  },
};