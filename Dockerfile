# Start from Jenkins agent with JDK 17
FROM jenkins/agent:latest-jdk17

# Switch to root to install dependencies
USER root

# Install Docker CLI, curl, Node.js LTS
RUN apt-get update && \
    apt-get install -y docker.io curl && \
    curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Add Jenkins user to docker group (optional)
RUN usermod -aG docker jenkins

# Create /app folder for project and give permissions
RUN mkdir -p /app && chown -R jenkins:jenkins /app

# Switch to jenkins user
USER jenkins

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
COPY --chown=jenkins:jenkins package*.json ./
RUN npm install

# Copy the rest of the project files
COPY --chown=jenkins:jenkins . .

# Default CMD can be overridden by Jenkins
CMD ["bash"]
