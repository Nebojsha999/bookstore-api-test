pipeline {
    agent { label 'docker' }

    stages {
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t bookstore-api-tests .'
            }
        }
        stage('Run Tests') {
            steps {
                sh 'docker run --rm bookstore-api-tests'
            }
        }
    }
}
