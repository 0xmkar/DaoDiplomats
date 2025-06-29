const baseUrl = "http://localhost:3000";

async function chatWithAgent() {
  try {
    // Step 1: Get agents
    console.log("Fetching agents...");
    const res = await fetch(`${baseUrl}/api/agents`);
    
    if (!res.ok) {
      throw new Error(`Failed to fetch agents: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    console.log("Agents response:", data);
    
    const agents = data.data.agents;
    if (!agents || agents.length === 0) {
      throw new Error("No agents found");
    }

    const agentId = agents[0].id;
    console.log("Using agent ID:", agentId);

    // Step 2: Prepare message with all required fields
    const message = {
      senderId: "user123", // Replace with actual sender ID
      roomId: "room456",   // Replace with actual room ID
      text: "Hello, how are you?",
      source: "api"       // Source of the message
    };
    
    // Optional: Add worldId as query parameter (defaults to zero UUID if not provided)
    const worldId = "00000000-0000-0000-0000-000000000000"; // Replace with actual world ID if needed
    const messageUrl = `${baseUrl}/api/agents/${agentId}/message?worldId=${worldId}`;
    
    console.log("Sending message to:", messageUrl);
    console.log("Message payload:", JSON.stringify(message, null, 2));

    const reply = await fetch(messageUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(message)
    });

    console.log("Response status:", reply.status, reply.statusText);

    if (!reply.ok) {
      const errorData = await reply.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`API Error ${reply.status}: ${JSON.stringify(errorData)}`);
    }

    const responseData = await reply.json();
    console.log("✅ Agent response:", responseData);
    
    return responseData;

  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

// Alternative version without worldId query parameter
async function chatWithAgentSimple() {
  try {
    const res = await fetch(`${baseUrl}/api/agents`);
    const data = await res.json();
    const agentId = data.data.agents[0].id;

    const message = {
      senderId: "user123",
      roomId: "room456", 
      text: "Hello, how are you?",
      source: "api"
    };
    
    // Without worldId query parameter (will use default zero UUID)
    const messageUrl = `${baseUrl}/api/agents/${agentId}/message`;

    const reply = await fetch(messageUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(message)
    });

    if (reply.ok) {
      const responseData = await reply.json();
      console.log("✅ Success:", responseData);
      return responseData;
    } else {
      const errorData = await reply.json().catch(() => ({}));
      console.log("❌ Error:", reply.status, errorData);
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

// Equivalent curl command for reference
function showCurlExample() {
  console.log("🧪 Equivalent curl command:");
  console.log(`curl -X POST 'http://localhost:3000/api/agents/YOUR_AGENT_ID/message?worldId=YOUR_WORLD_ID' \\`);
  console.log(`  -H 'Content-Type: application/json' \\`);
  console.log(`  -d '{`);
  console.log(`    "senderId": "user123",`);
  console.log(`    "roomId": "room456",`);
  console.log(`    "text": "Hello, how are you?",`);
  console.log(`    "source": "api"`);
  console.log(`  }'`);
  console.log();
}

// Run the chat function
showCurlExample();
chatWithAgent();