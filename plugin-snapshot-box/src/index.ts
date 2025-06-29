import { type Plugin, type IAgentRuntime, Task } from '@elizaos/core';
import { SnapshotService } from './service';
import { snapshotProposalsProvider } from './providers/proposals';

const snapshotProposalsPlugin: Plugin = {
  name: 'snapshot-proposals',
  description: 'Fetches open Snapshot proposals for yam.eth every 15 minutes',
  services: [SnapshotService],
  providers: [snapshotProposalsProvider],
  async init(config: Record<string, string>, runtime: IAgentRuntime) {
    const apiUrl = runtime.getSetting('SNAPSHOT_API_URL') || 'https://hub.snapshot.org/graphql';
    if (!apiUrl) {
      console.warn('SNAPSHOT_API_URL not provided; using default');
    }
    // Register the cron task via TaskService
    const taskService = runtime.getService('TaskService') as any;
    if (taskService) {
      await taskService.scheduleTask({
        id: 'fetch-snapshot-proposals',
        cron: '*/15 * * * *', // Every 15 minutes
        action: async () => {
          const snapshotService = runtime.getService('SnapshotService') as SnapshotService;
          if (snapshotService) {
            await snapshotService.fetchProposals();
          }
        },
      });
    } else {
      console.error('TaskService not available; cron job not scheduled');
    }
  },
};

export default snapshotProposalsPlugin;