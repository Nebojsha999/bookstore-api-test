FROM jenkins/agent:latest-jdk17

# Install Docker CLI
USER root
RUN apt-get update && \
    apt-get install -y docker.io && \
    rm -rf /var/lib/apt/lists/*

# Switch back to Jenkins user
USER jenkins