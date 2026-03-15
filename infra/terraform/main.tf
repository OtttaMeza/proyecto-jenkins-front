terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

resource "docker_image" "ubuntu_systemd" {
  name         = "jrei/systemd-ubuntu:22.04"
  keep_locally = true
}

resource "docker_volume" "master_containerd" {}
resource "docker_volume" "worker1_containerd" {}
resource "docker_volume" "worker2_containerd" {}

resource "docker_container" "master" {
  name       = "master"
  image      = docker_image.ubuntu_systemd.name
  privileged = true
  tty        = true

  volumes {
    host_path      = "/sys/fs/cgroup"
    container_path = "/sys/fs/cgroup"
    read_only      = false
  }
  
  volumes {
    volume_name    = docker_volume.master_containerd.name
    container_path = "/var/lib/containerd"
  }
}

resource "docker_container" "worker1" {
  name       = "worker1"
  image      = docker_image.ubuntu_systemd.name
  privileged = true
  tty        = true

  volumes {
    host_path      = "/sys/fs/cgroup"
    container_path = "/sys/fs/cgroup"
    read_only      = false
  }

  volumes {
    volume_name    = docker_volume.worker1_containerd.name
    container_path = "/var/lib/containerd"
  }
}

resource "docker_container" "worker2" {
  name       = "worker2"
  image      = docker_image.ubuntu_systemd.name
  privileged = true
  tty        = true

  volumes {
    host_path      = "/sys/fs/cgroup"
    container_path = "/sys/fs/cgroup"
    read_only      = false
  }

  volumes {
    volume_name    = docker_volume.worker2_containerd.name
    container_path = "/var/lib/containerd"
  }
}