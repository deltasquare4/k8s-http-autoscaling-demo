# HorizontalPodAutoscaler HTTP Server Demo

This demo application demonstrates use of Kubernetes' `HorizontalPodAutoscaler` to scale HTTP servers based on `requests-per-second` metric tracked using Prometheus.

## Prerequisites

* Docker
* Minikube with driver `none`: `minikube start --vm-driver none`
  * `metrics-server` and `heapster` addons enabled on minikube: `minikube addons enable <addon>`
* Prometheus deployed on the minikue cluster

## Installation and Configuration

```
docker build -t server .
minikube start --vm-driver none
```

```
# Setting Up Minikube
# Add the following argument to controller manager
--horizontal-pod-autoscaler-downscale-delay=30s
```

```
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

minikube service prom-demo --url

ab -n 100000 -c 20 $(minikube service prom-demo --url)/

kubectl apply -f k8s/hpa.yaml
```

```
kubectl get --raw /apis/custom.metrics.k8s.io/v1beta1

kubectl get --raw "/apis/custom.metrics.k8s.io/v1beta1/namespaces/default/pods/*/http_requests"
```
