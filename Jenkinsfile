pipeline {
    agent { label 'docker-agent' }

    environment {
        BASE_URL = 'https://fakerestapi.azurewebsites.net'
        DOCKER_IMAGE = 'bookstore-api-tests'
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
                echo "Running tests inside Docker container..."

                // Ensure reports folder exists in Jenkins workspace
                sh "mkdir -p ${WORKSPACE}/reports"

                // Run tests as root to avoid permission issues
                sh """
                    docker run --rm \
                        --network host \
                        -e BASE_URL=${BASE_URL} \
                        -v ${WORKSPACE}/reports:/app/reports \
                        --user root \
                        --entrypoint "" \
                        ${DOCKER_IMAGE} \
                        npm test
                """
            }
        }
    }

    post {
        always {
            // Archive Mochawesome XML/JSON reports
            junit allowEmptyResults: true, testResults: 'reports/**/*.xml'
            archiveArtifacts artifacts: 'reports/**', allowEmptyArchive: true
        }
    }
}
