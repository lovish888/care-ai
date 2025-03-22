import { getLangChainTools } from "@coinbase/agentkit-langchain";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { AgentKit } from "@coinbase/agentkit";
import { Chat } from "../types";
import dotenv from 'dotenv';
import { prompt } from "./foodDeliveryPrompt";

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

const foodDeliveryPrompt = prompt;

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