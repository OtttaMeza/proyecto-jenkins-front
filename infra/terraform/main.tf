provider "docker" {}

resource "docker_container" "master" {
  name  = "k8s-master"
  image = "ubuntu:22.04"
  tty   = true
}

resource "docker_container" "worker1" {
  name  = "k8s-worker1"
  image = "ubuntu:22.04"
  tty   = true
}

resource "docker_container" "worker2" {
  name  = "k8s-worker2"
  image = "ubuntu:22.04"
  tty   = true
}