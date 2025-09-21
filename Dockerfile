FROM jenkins/agent:latest-jdk17

# Install Docker CLI, curl, and Node.js LTS
USER root
RUN apt-get update && \
    apt-get install -y docker.io curl && \
    curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Add Jenkins user to docker group
RUN usermod -aG docker jenkins

# Create app folder and set permissions
RUN mkdir -p /app && chown -R jenkins:jenkins /app

# Switch to Jenkins user
USER jenkins
WORKDIR /app

# Copy package.json first for caching
COPY --chown=jenkins:jenkins package*.json ./

# Install dependencies
RUN npm install

# Copy rest of app files
COPY --chown=jenkins:jenkins . .

# Default command
CMD ["bash"]
