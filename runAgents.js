async function elizaAgentWorkflow(baseUrl) {
  const logWithTimestamp = (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`, data ? data : '');
  };

  try {
    logWithTimestamp('Starting Eliza agent workflow', { baseUrl });

    // Step 1: List all agents
    logWithTimestamp('Step 1: Fetching all agents');
    const agentsResponse = await fetch(`${baseUrl}/api/agents`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!agentsResponse.ok) {
      logWithTimestamp('Error: Failed to fetch agents', {
        status: agentsResponse.status,
        statusText: agentsResponse.statusText
      });
      console.log(`Failed to fetch agents: ${agentsResponse.status} ${agentsResponse.statusText}`);
    }

    const data = await agentsResponse.json();
    logWithTimestamp('Agents fetched successfully', { agentsCount: data.data.agents.length });

    const agents = data.data.agents;
    if (!agents || agents.length < 2) {
      logWithTimestamp('Error: Insufficient agents found', { agentsCount: agents?.length || 0 });
      console.log('Less than 2 agents found');
    }

    // Get the second agent (index 1)
    const agentId = agents[0].id;
    logWithTimestamp('Step 1 completed: Selected second agent', { agentId });

    // Step 2: Create a World for the agent
    logWithTimestamp('Step 2: Creating world for agent', { agentId });
    const worldResponse = await fetch(`${baseUrl}/api/agents/${agentId}/worlds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'MyAgentWorld',
        sourceType: 'none',
        sourceId: 'custom-id', // can be any unique string
        metadata: {}
      })
    });
    if (!worldResponse.ok) {
      logWithTimestamp('Error: Failed to create world', {
        status: worldResponse.status,
        statusText: worldResponse.statusText
      });
      console.log(`Failed to create world: ${worldResponse.status} ${worldResponse.statusText}`);
    }
    const world = await worldResponse.json();
    const worldId = world.id;
    logWithTimestamp('Step 2 completed: World created', { worldId });

    // Step 3: Create a Room in the World
    logWithTimestamp('Step 3: Creating room in world', { worldId });
    const roomResponse = await fetch(
      `http://localhost:3000/api/agents/${agentId}/rooms`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'AgentChatRoom',
          worldId: worldId,
          source: 'custom',        // e.g. 'discord', 'telegram', or 'custom'
          channelId: 'chat-1234',  // unique identifier for this chat
          serverId: 'server-5678', // optional grouping identifier
          type: 'DM',              // ChannelType — DM, GROUP, THREAD, etc.
          metadata: { custom: 'value' }
        })
      }
    );

    if (!roomResponse.ok) {
      logWithTimestamp('Error: Failed to create room', {
        status: roomResponse.status,
        statusText: roomResponse.statusText
      });
      console.log(`Failed to create room: ${roomResponse.status} ${roomResponse.statusText}`);
    }
    const room = await roomResponse.json();
    const roomId = room.id;
    logWithTimestamp('Step 3 completed: Room created', { roomId });

    // Step 5: Verify agent is running
    logWithTimestamp('Step 5: Verifying agent status', { agentId });
    const statusResponse = await fetch(`${baseUrl}/api/agents/${agentId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!statusResponse.ok) {
      logWithTimestamp('Error: Failed to verify agent status', {
        status: statusResponse.status,
        statusText: statusResponse.statusText
      });
      console.log(`Failed to verify agent status: ${statusResponse.status} ${statusResponse.statusText}`);
    }
    const agentStatus = await statusResponse.json();
    if (agentStatus.status !== 'running') {
      logWithTimestamp('Error: Agent is not running', { status: agentStatus.status });
      console.log('Agent failed to start');
    }
    logWithTimestamp('Step 5 completed: Agent status verified', { status: agentStatus.status });

    // Step 6: Send a message to the agent in the room
    logWithTimestamp('Step 6: Sending message to agent', { agentId, roomId });
    const messageResponse = await fetch(`${baseUrl}/api/messaging/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agentId: agentId,
        roomId: roomId,
        authorId: 'user123',
        text: 'Hello, Agent! How can you assist me today?'
      })
    });
    if (!messageResponse.ok) {
      logWithTimestamp('Error: Failed to send message', {
        status: messageResponse.status,
        statusText: messageResponse.statusText
      });
      console.log(`Failed to send message: ${messageResponse.status} ${messageResponse.statusText}`);
    }
    const messageResult = await messageResponse.json();
    logWithTimestamp('Step 6 completed: Message sent successfully', { messageResult });

    logWithTimestamp('Workflow completed successfully', { agentId, roomId });
    return { agentId, roomId, messageResult };

  } catch (error) {
    logWithTimestamp('Error in Eliza agent workflow', { error: error.message });
    throw error;
  }
}

// Example usage
const baseUrl = 'http://localhost:3000';
elizaAgentWorkflow(baseUrl)
  .then(result => console.log('Workflow completed:', result))
  .catch(error => console.error('Workflow failed:', error));

// const baseUrl = "http://localhost:3000";

// async function chatWithAgent() {
//   try {
//     // Step 1: Get agents
//     console.log("Fetching agents...");
//     const res = await fetch(`${baseUrl}/api/agents`);
    
//     if (!res.ok) {
//       console.log(`Failed to fetch agents: ${res.status} ${res.statusText}`);
//     }
    
//     const data = await res.json();
//     console.log("Agents response:", data);
    
//     const agents = data.data.agents;
//     if (!agents || agents.length === 0) {
//       console.log("No agents found");
//     }

//     const agentId = agents[0].id;
//     console.log("Using agent ID:", agentId);

//     // Step 2: Prepare message with all required fields
//     const message = {
//       senderId: "user123", // Replace with actual sender ID
//       roomId: "room456",   // Replace with actual room ID
//       text: "Hello, how are you?",
//       source: "api"       // Source of the message
//     };
    
//     // Optional: Add worldId as query parameter (defaults to zero UUID if not provided)
//     const worldId = "00000000-0000-0000-0000-000000000000"; // Replace with actual world ID if needed
//     const messageUrl = `${baseUrl}/api/agents/${agentId}/message?worldId=${worldId}`;
    
//     console.log("Sending message to:", messageUrl);
//     console.log("Message payload:", JSON.stringify(message, null, 2));

//     const reply = await fetch(messageUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(message)
//     });

//     console.log("Response status:", reply.status, reply.statusText);

//     if (!reply.ok) {
//       const errorData = await reply.json().catch(() => ({ error: 'Unknown error' }));
//       console.log(`API Error ${reply.status}: ${JSON.stringify(errorData)}`);
//     }

//     const responseData = await reply.json();
//     console.log("✅ Agent response:", responseData);
    
//     return responseData;

//   } catch (err) {
//     console.error("❌ Error:", err.message);
//   }
// }

// // Alternative version without worldId query parameter
// async function chatWithAgentSimple() {
//   try {
//     const res = await fetch(`${baseUrl}/api/agents`);
//     const data = await res.json();
//     const agentId = data.data.agents[0].id;

//     const message = {
//       senderId: "user123",
//       roomId: "room456", 
//       text: "Hello, how are you?",
//       source: "api"
//     };
    
//     // Without worldId query parameter (will use default zero UUID)
//     const messageUrl = `${baseUrl}/api/agents/${agentId}/message`;

//     const reply = await fetch(messageUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(message)
//     });

//     if (reply.ok) {
//       const responseData = await reply.json();
//       console.log("✅ Success:", responseData);
//       return responseData;
//     } else {
//       const errorData = await reply.json().catch(() => ({}));
//       console.log("❌ Error:", reply.status, errorData);
//     }
//   } catch (err) {
//     console.error("❌ Error:", err.message);
//   }
// }

// chatWithAgent();