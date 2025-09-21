FROM jenkins/agent:latest-jdk17

# Install Docker CLI
USER root
RUN apt-get update && \
    apt-get install -y docker.io && \
    rm -rf /var/lib/apt/lists/*

# Give Jenkins user access to Docker socket
RUN usermod -aG docker jenkins

# Switch back to Jenkins user
USER jenkins
