from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain.llms import OpenAI
import os
from dotenv import load_dotenv
from support_agents import get_agent_response

load_dotenv()

llm = OpenAI(api_key=os.getenv('OPENAI_API_KEY'), temperature=0.7)

user_prompt = PromptTemplate(
    input_variables=["history", "input", "context"],
    template="You are an autonomous User Agent for care-ai. Your task is to resolve the user's complaint by interacting with a {context} Support Agent on their behalf. Be proactive, polite, and persistent until resolved.\n\n{history}\nUser Complaint: {input}\nUser Agent: "
)

user_agent = LLMChain(llm=llm, prompt=user_prompt, memory=ConversationBufferMemory())

def resolve_complaint(context, complaint):
    messages = [{"role": "user", "content": complaint}]
    max_turns = 5  # Limit conversation turns to avoid infinite loops
    for _ in range(max_turns):
        user_message = user_agent.run(input=complaint, context=context)
        messages.append({"role": "user_agent", "content": user_message})
        support_response = get_agent_response(context, user_message)
        messages.append({"role": "support", "content": support_response})
        if "resolved" in support_response.lower():  # Simple resolution check
            break
        complaint = support_response  # Feed support response back as next input
    return messages