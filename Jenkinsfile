pipeline {
    agent { label 'docker-agent' }

    environment {
        BASE_URL = 'https://fakerestapi.azurewebsites.net'
        DOCKER_IMAGE = 'bookstore-api-js-tests'
    }

    stages {
        stage('Checkout SCM') {
            steps { checkout scm }
        }

        stage('Build Docker Image') {
            steps { sh "docker build -t ${DOCKER_IMAGE} ." }
        }

        stage('Run Tests in Container') {
            steps {
                sh "mkdir -p ${WORKSPACE}/reports"
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
            archiveArtifacts artifacts: 'reports/**', allowEmptyArchive: true
            junit allowEmptyResults: true, testResults: 'reports/**/*.xml'
        }
    }
}
