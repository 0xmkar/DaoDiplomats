import { IAgentRuntime } from '@elizaos/core';
import { SnapshotService } from '../src/service';
import { createMockRuntime } from '@elizaos/core/test';

describe('SnapshotService', () => {
  let runtime: IAgentRuntime;

  beforeEach(() => {
    runtime = createMockRuntime();
  });

  it('should fetch proposals successfully', async () => {
    const service = await SnapshotService.start(runtime);
    await service.fetchProposals();
    const proposals = service.getProposals();
    expect(proposals).toBeInstanceOf(Array);
  });
});