import os
from dotenv import load_dotenv

load_dotenv()

# Blockchain
INFURA_URL = os.getenv("INFURA_URL")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")  # For Sepolia transactions

# AgentKit
COINBASE_AGENT_API = os.getenv("COINBASE_AGENT_API")

# 0g Storage CLI Path
OG_CLI_PATH = os.getenv("OG_CLI_PATH")  # e.g. "/usr/local/bin/0g"