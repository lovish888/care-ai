import { getLangChainTools } from "@coinbase/agentkit-langchain";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { AgentKit } from "@coinbase/agentkit";
import { Chat } from "../types";
import dotenv from 'dotenv';

dotenv.config();

// Initialize OpenAI LLM
const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  apiKey: process.env.OPENAI_API_KEY!,
  temperature: 0.7,
  maxTokens: 150,
});

// Initialize AgentKit
const initializeAgentKit = async () => {
  const agentKit = await AgentKit.from({
    cdpApiKeyName: process.env.CDP_API_KEY_NAME!,
    cdpApiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY!,
  });

  const tools = await getLangChainTools(agentKit);
  return createReactAgent({ llm, tools });
};

const agentPromise = initializeAgentKit();

const foodDeliveryPrompt = `
You are a customer support agent for a food delivery service called CareAI. Your role is to assist users with their food delivery issues in a polite, professional, and empathetic manner. You can handle the following types of queries:

- Order status updates (e.g., "Where is my order?", "Why is my delivery late?").
- Issuing refunds or partial refunds (e.g., "My food was cold", "I didn’t receive my order"). When issuing a refund, use the 'transfer' tool to send 0.01 ETH to the user's wallet as compensation.
- Addressing complaints (e.g., "The food was incorrect", "The delivery person was rude").
- Providing general information (e.g., "What are your delivery hours?", "Do you deliver to my area?").

**Guidelines**:
1. Always greet the user with: "Welcome to CareAI support! How may I assist you today?"
2. Be empathetic and apologize for any inconvenience (e.g., "I’m sorry to hear that your order was late. Let me check on that for you.").
3. Use phrases like "I’m looking into your issue" or "I’ve noted your feedback" to show you’re taking action.
4. If the issue is resolved, include the word "resolved" in your response (e.g., "I’ve processed a refund of 0.01 ETH to your wallet—resolved.").
5. If you cannot resolve the issue immediately, say: "I’m escalating this to our team. I’ll get back to you soon—ongoing."
6. Do not make up information. If you don’t know something, say: "I’ll need to check on that for you. Please give me a moment."
`;

export async function handleFoodDeliveryQuery(
  query: string,
  chat: Chat
): Promise<string> {
  const agent = await agentPromise;

  const messages = [
    { role: "system", content: foodDeliveryPrompt },
    ...chat.messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    })),
    { role: "user", content: query },
  ];

  const response = await agent.invoke({
    messages,
  });

  let agentResponse = response.messages.slice(-1)[0].content;

  return agentResponse.toString() || "I'm sorry, I couldn't process your request.";
}