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
                 sh 'docker build -t react-app:latest .'
                 sh 'docker save -o react-app.tar react-app:latest'
             }
         }
         
         stage('Terraform Infra') {
             steps {
                 echo 'Building terraform infra...'
                 dir('infra/terraform') {
                     sh 'terraform init'
                     sh 'terraform apply -auto-approve'
                 }
             }
         }

         stage('Configure Nodes') {
             steps {
                 echo 'Configuring Nodes...'
                 sh 'ansible-playbook -i infra/ansible/inventory/hosts.yml infra/ansible/playbooks/setup-k8s.yml'
                 
                 echo 'Transferring images to nodes...'
                 sh 'docker cp react-app.tar master:/tmp/'
                 sh 'docker cp react-app.tar worker1:/tmp/'
                 sh 'docker cp react-app.tar worker2:/tmp/'
                 sh 'docker exec master ctr -n k8s.io images import /tmp/react-app.tar'
                 sh 'docker exec worker1 ctr -n k8s.io images import /tmp/react-app.tar'
                 sh 'docker exec worker2 ctr -n k8s.io images import /tmp/react-app.tar'
                 
                 echo 'Patching kube-proxy for Docker Desktop compatibility...'
                 sh "docker exec master sh -c 'kubectl get cm kube-proxy -n kube-system -o yaml | sed \"s/maxPerCore: null/maxPerCore: 0/\" | kubectl apply -f -'"
                 sh "docker exec master kubectl rollout restart ds kube-proxy -n kube-system"
             }
         }

           stage('Deploy K8s'){
              steps{
                echo 'Deploying Nodes...'
                sh 'ansible master -i infra/ansible/inventory/hosts.yml -m copy -a "src=infra/k8s dest=/tmp/"'
                sh 'ansible master -i infra/ansible/inventory/hosts.yml -m command -a "kubectl apply -f /tmp/k8s" --become'
              }
           }
    }
}