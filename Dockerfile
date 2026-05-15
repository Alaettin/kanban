FROM node:20-bookworm-slim

# Install Docker CLI (for managing EDC containers from within this container)
# AND Python 3.11 (for the PySD-based supply-chain simulation in /app/simulation_rl)
RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates curl gnupg \
      python3.11 python3.11-venv python3.11-dev \
      build-essential && \
    install -m 0755 -d /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc && \
    chmod a+r /etc/apt/keyrings/docker.asc && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian bookworm stable" \
      > /etc/apt/sources.list.d/docker.list && \
    apt-get update && apt-get install -y --no-install-recommends \
      docker-ce-cli docker-compose-plugin && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# Build Python venv for the simulation before copying the rest of the source —
# lets Docker cache this expensive layer when only Node/JS code changes.
COPY simulation_rl/requirements.txt /app/simulation_rl/requirements.txt
RUN python3.11 -m venv /app/simulation_rl/.venv \
    && /app/simulation_rl/.venv/bin/pip install --no-cache-dir --upgrade pip \
    && /app/simulation_rl/.venv/bin/pip install --no-cache-dir -r /app/simulation_rl/requirements.txt

COPY . .

# Ensure data directory exists for sqlite file mount/use,
# and the simulation_rl/pysd_model/models output dir (.gitignored, recreated at runtime)
RUN mkdir -p /app/data /app/simulation_rl/pysd_model/models

# Default path for the PySD simulation bridge (override via .env if needed)
ENV SIMULATION_RL_PATH=/app/simulation_rl
ENV SIMULATION_PYTHON=/app/simulation_rl/.venv/bin/python3
ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
