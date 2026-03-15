pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        IMAGE_NAME = "react-app"
        CONTAINER_NAME = "react-container"
        PORT = "5001"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm install'
            }
        }

        stage('Build React App') {
            steps {
                echo 'Building frontend...'
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

         stage('Terraform Infra'){
             steps{
                echo 'Build terraform infra...'
                dir('infra/terraform') {
                    sh 'terraform init'
                    sh 'terraform apply -auto-approve'
                }
             }
         }

          stage('Configure Nodes'){
              steps{
                echo 'Configuring Nodes...'
                sh 'ansible-playbook infra/ansible/playbooks/setup-k8s.yml'
              }
          }

           stage('Deploy K8s'){
              steps{
              echo 'Deploying Nodes...'
                sh 'kubectl apply -f k8s/'
              }
           }
    }
}