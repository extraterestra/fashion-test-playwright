pipeline {
    agent any
    
    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['test', 'stage', 'prod'],
            description: 'Select the environment to run tests against'
        )
    }
    
    environment {
        COMPOSE_PROJECT_NAME = "fashion-playwright-${BUILD_NUMBER}"
        TEST_ENV = "${params.ENVIRONMENT}"
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                checkout scm
            }
        }
        
        stage('Environment Info') {
            steps {
                echo 'Environment Information'
                sh 'pwd'
                sh 'ls -la'
                sh 'docker --version || echo "Docker not available"'
                sh 'docker compose version || echo "Docker Compose not available"'
            }
        }
        
        stage('Clean Previous Docker Containers') {
            steps {
                echo 'Cleaning up previous Docker containers...'
                sh 'docker compose -p "$COMPOSE_PROJECT_NAME" down --remove-orphans || true'
                sh 'docker image prune -f || true'
            }
        }
        
        stage('Run Tests in Docker') {
            steps {
                echo "Running Playwright tests in Docker containers (Environment: ${params.ENVIRONMENT})..."
                sh '''
                    # Run tests with selected environment
                    docker compose -p "$COMPOSE_PROJECT_NAME" up --build --abort-on-container-exit --exit-code-from playwright-tests
                '''
            }
        }
    }
    
    post {
        always {
            echo 'Processing test results...'
            // Copy artifacts from the stopped (but not yet removed) test container
            sh '''
                set +e
                # Find container by name pattern (stopped containers still exist until 'down')
                CID=$(docker ps -a --filter "name=playwright-runner-${COMPOSE_PROJECT_NAME}" --format "{{.ID}}" | head -1)
                if [ -n "$CID" ]; then
                    echo "Copying artifacts from container: $CID"
                    mkdir -p playwright-report test-results
                    docker cp "$CID":/app/playwright-report/. ./playwright-report/ 2>/dev/null || echo "No playwright-report found"
                    docker cp "$CID":/app/test-results/. ./test-results/ 2>/dev/null || echo "No test-results found"
                    ls -la playwright-report/ || echo "playwright-report is empty"
                    ls -la test-results/ || echo "test-results is empty"
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
            
            // Publish JUnit test results (for Test Result Trend)
            junit allowEmptyResults: true, testResults: 'test-results/junit-results.xml'
            
            // Archive test results
            archiveArtifacts artifacts: 'playwright-report/**/*,test-results/**/*', allowEmptyArchive: true
            
            echo '🧹 Cleaning up Docker containers...'
            sh 'docker compose -p "$COMPOSE_PROJECT_NAME" down --remove-orphans || true'
        }
        
        success {
            echo 'Pipeline completed successfully!'
        }
        
        failure {
            echo 'Pipeline failed!'
        }
    }
}