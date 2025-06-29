import { Service, IAgentRuntime } from '@elizaos/core';
import fetch from 'node-fetch';

export interface Proposal {
  id: string;
  title: string;
  body: string;
  choices: string[];
  start: number;
  end: number;
  snapshot: string;
  state: string;
  author: string;
  space: {
    id: string;
    name: string;
  };
}

export class SnapshotService extends Service {
  static serviceType = 'snapshot';
  capabilityDescription = 'Fetches open proposals from Snapshot for yam.eth';
  private proposals: Proposal[] = [];
  private apiUrl: string;

  constructor(protected runtime: IAgentRuntime) {
    super();
    this.apiUrl = runtime.getSetting('SNAPSHOT_API_URL') || 'https://hub.snapshot.org/graphql';
  }

  static async start(runtime: IAgentRuntime): Promise<SnapshotService> {
    const service = new SnapshotService(runtime);
    await service.fetchProposals(); // Initial fetch on startup
    return service;
  }

  async stop(): Promise<void> {
    // No resources to clean up
  }

  async fetchProposals(): Promise<void> {
    try {
      const query = `
        query Proposals {
          proposals(
            first: 20,
            skip: 0,
            where: { space_in: ["yam.eth"], state: "open" },
            orderBy: "created",
            orderDirection: desc
          ) {
            id
            title
            body
            choices
            start
            end
            snapshot
            state
            author
            space { id name }
          }
        }
      `;
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, operationName: 'Proposals' }),
      });
      const data = await response.json();
      if (data.errors) {
        console.error('Snapshot API error:', data.errors);
        return;
      }
      this.proposals = data.data.proposals || [];
      console.log(`Fetched ${this.proposals.length} open proposals for yam.eth`);
    } catch (error) {
      console.error('Error fetching Snapshot proposals:', error);
    }
  }

  getProposals(): Proposal[] {
    return this.proposals;
  }
}