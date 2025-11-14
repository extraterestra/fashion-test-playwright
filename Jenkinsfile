pipeline {
    agent any
    
    environment {
        COMPOSE_PROJECT_NAME = "fashion-playwright-${BUILD_NUMBER}"
        TEST_ENV = 'test'
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '📦 Checking out code from GitHub...'
                checkout scm
            }
        }
        
        stage('Environment Info') {
            steps {
                echo '🔍 Environment Information'
                sh 'pwd'
                sh 'ls -la'
                sh 'docker --version || echo "Docker not available"'
                sh 'docker compose version || echo "Docker Compose not available"'
            }
        }
        
        stage('Clean Previous Docker Containers') {
            steps {
                echo '🧹 Cleaning up previous Docker containers...'
                sh 'docker compose -p "$COMPOSE_PROJECT_NAME" down --remove-orphans || true'
                sh 'docker image prune -f || true'
            }
        }
        
        stage('Run Tests in Docker') {
            steps {
                echo '🧪 Running Playwright tests in Docker containers...'
                sh 'docker compose -p "$COMPOSE_PROJECT_NAME" up --build --abort-on-container-exit --exit-code-from playwright-tests'
            }
        }
    }
    
    post {
        always {
            echo '📊 Processing test results...'
                        // Copy artifacts out of the test container before tearing down
                        sh '''
                            set -e
                            CID=$(docker compose -p "$COMPOSE_PROJECT_NAME" ps -q playwright-tests || true)
                            if [ -n "$CID" ]; then
                                echo "Copying artifacts from container: $CID"
                                mkdir -p playwright-report test-results || true
                                docker cp "$CID":/app/playwright-report ./playwright-report || true
                                docker cp "$CID":/app/test-results ./test-results || true
                            else
                                echo "No playwright-tests container found to copy artifacts from."
                            fi
                        '''
            
            // Publish HTML reports (requires HTML Publisher plugin)
            publishHTML([
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Test Report',
                reportTitles: 'Playwright Test Results'
            ])
            
            // Archive test results
            archiveArtifacts artifacts: 'playwright-report/**/*,test-results/**/*', allowEmptyArchive: true
            
            echo '🧹 Cleaning up Docker containers...'
            sh 'docker compose -p "$COMPOSE_PROJECT_NAME" down --remove-orphans || true'
        }
        
        success {
            echo '✅ Pipeline completed successfully!'
        }
        
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}