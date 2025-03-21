from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain.llms import OpenAI
import os
from dotenv import load_dotenv
from support_agents_context import food_delivery, ecommerce


load_dotenv()

llm = OpenAI(api_key=os.getenv('OPENAI_API_KEY'), temperature=0.7)

food_prompt = PromptTemplate(
    input_variables=["history", "input"],
    template=food_delivery.context
)
ecommerce_prompt = PromptTemplate(
    input_variables=["history", "input"],
    template=ecommerce.context
)

food_agent = LLMChain(llm=llm, prompt=food_prompt, memory=ConversationBufferMemory())
ecommerce_agent = LLMChain(llm=llm, prompt=ecommerce_prompt, memory=ConversationBufferMemory())

def get_agent_response(context, message):
    agent = food_agent if context == "Food Delivery" else ecommerce_agent
    return agent.run(input=message)