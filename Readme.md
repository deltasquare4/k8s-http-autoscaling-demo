# HorizontalPodAutoscaler HTTP Server Demo

This demo application demonstrates use of Kubernetes' `HorizontalPodAutoscaler` to scale HTTP servers based on `requests-per-second` metric tracked using Prometheus.

## Prerequisites

* Docker
* Minikube with driver `none`: `minikube start --vm-driver none`
  * `metrics-server` and `heapster` addons enabled on minikube: `minikube addons enable <addon>`
* Prometheus deployed on the minikue cluster

## Installation and Configuration

```
# Build container image locally
docker build -t server .

# Configure minikube on local docker (linux)
minikube start --vm-driver none

# Add plugins to minikube
minikube addons enable heapster metrics-server

# Setting Up Minikube
# Add the following argument to controller manager to reduce delay
--horizontal-pod-autoscaler-downscale-delay=30s

# Deploy the prometheus and prometheus adapter
kubectl apply -f k8s/prometheus
kubectl apply -f k8s/prom-adapter
kubectl apply -f k8s/servicemonitor.yaml

# Depoy the application
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# Get URL to the application
minikube service prom-demo --url

# Generate load on the application using Apache Bench
ab -n 100000 -c 20 $(minikube service prom-demo --url)/

# Install/configure HPA
kubectl apply -f k8s/hpa.yaml

# Notes: Make sure the prometheus adapter is exporting metrics to the cluster
kubectl get --raw /apis/custom.metrics.k8s.io/v1beta1
kubectl get --raw "/apis/custom.metrics.k8s.io/v1beta1/namespaces/default/pods/*/http_requests"
```
