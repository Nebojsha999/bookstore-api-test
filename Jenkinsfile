pipeline {
    agent any

    environment {
        BASE_URL = 'https://fakerestapi.azurewebsites.net'
        DOCKER_IMAGE = 'bookstore-api-js-tests'
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image ${DOCKER_IMAGE}..."
                sh "docker build -t ${DOCKER_IMAGE} ."
            }
        }

        stage('Run Tests in Container') {
            steps {
                echo "Running tests in Docker container..."
                
                // Make sure reports folder exists in workspace
                sh "mkdir -p ${WORKSPACE}/reports"

                // Run Docker container with workspace reports folder mounted
                sh """
                    docker run --rm \
                        --network host \
                        -e BASE_URL=${BASE_URL} \
                        -v ${WORKSPACE}/reports:/app/reports \
                        ${DOCKER_IMAGE}
                """
            }
        }
    }

    post {
        always {
            // Archive test artifacts (reports)
            archiveArtifacts artifacts: 'reports/**', allowEmptyArchive: true
            
            // Optional: record JUnit test results if you generate XML
            junit allowEmptyResults: true, testResults: 'reports/**/*.xml'
        }
    }
}
