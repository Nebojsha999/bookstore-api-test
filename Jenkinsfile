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
                sh "mkdir -p \"${WORKSPACE}/reports\""

                sh """
                    docker run --rm \
                        -e BASE_URL=${BASE_URL} \
                        -v \"${WORKSPACE}/reports:/app/reports\" \
                        --entrypoint "" \
                        ${DOCKER_IMAGE} \
                        npm test
                """
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'reports/**/*.xml'
            archiveArtifacts artifacts: 'reports/**', allowEmptyArchive: true
        }
    }
}
