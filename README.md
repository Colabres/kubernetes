# KubernetesSubmissions

## Exercises

### Chapter 2

- [1.1.](https://github.com/Colabres/kubernetes/tree/1.1/log-output)
- [1.2.](https://github.com/Colabres/kubernetes/tree/1.2/todo-app)
- [1.3.](https://github.com/Colabres/kubernetes/tree/1.3/log-output)
- [1.4.](https://github.com/Colabres/kubernetes/tree/1.4/todo-app)
- [1.5.](https://github.com/Colabres/kubernetes/tree/1.5/todo-app)
- [1.6.](https://github.com/Colabres/kubernetes/tree/1.6/todo-app)
- [1.7.](https://github.com/Colabres/kubernetes/tree/1.7/log-output)
- [1.8.](https://github.com/Colabres/kubernetes/tree/1.8/todo-app)
- [1.9.](https://github.com/Colabres/kubernetes/tree/1.9/ping-pong)
- [1.10.](https://github.com/Colabres/kubernetes/tree/1.10/log-output)
- [1.11.](https://github.com/Colabres/kubernetes/tree/1.11/log-output)
- [1.12.](https://github.com/Colabres/kubernetes/tree/1.12/todo-app)
- [1.13.](https://github.com/Colabres/kubernetes/tree/1.13/todo-app)

### Chapter 3


- [2.1.](https://github.com/Colabres/kubernetes/tree/2.1v2/log-output)
- [2.2.](https://github.com/Colabres/kubernetes/tree/2.2/todo-backend)
- [2.3.](https://github.com/Colabres/kubernetes/tree/2.3/log-output)
- [2.4.](https://github.com/Colabres/kubernetes/tree/2.4/todo-app)
- [2.5.](https://github.com/Colabres/kubernetes/tree/2.5/log-output)
- [2.6.](https://github.com/Colabres/kubernetes/tree/2.6/todo-app)
- [2.7.](https://github.com/Colabres/kubernetes/tree/2.7/log-output)
- [2.8.](https://github.com/Colabres/kubernetes/tree/2.8/todo)
- [2.9.](https://github.com/Colabres/kubernetes/tree/2.9/todo)
- [2.10.](https://github.com/Colabres/kubernetes/tree/2.10/todo)

### Chapter 4

- [3.1.](https://github.com/Colabres/kubernetes/tree/3.1/log-output)
- [3.2.](https://github.com/Colabres/kubernetes/tree/3.2/log-output)
- [3.3.](https://github.com/Colabres/kubernetes/tree/3.3/log-output)
- [3.4.](https://github.com/Colabres/kubernetes/tree/3.4/log-output)
- [3.5.](https://github.com/Colabres/kubernetes/tree/3.5/todo)
- [3.6.](https://github.com/Colabres/kubernetes/tree/3.6/todo)
- [3.7.](https://github.com/Colabres/kubernetes/tree/3.7/todo)
- [3.8.](https://github.com/Colabres/kubernetes/tree/3.8/todo)
- [3.9.](https://github.com/Colabres/kubernetes/tree/3.9)




## PostgreSQL in GKE (StatefulSet + PVC)

### Advantages
- Lower cost.
- Full control over PostgreSQL configuration.
- Portable to any Kubernetes cluster.


### Disadvantages
- You are responsible for installation, upgrades and maintenance.
- You must configure backups yourself.
- Lower availability.
- Uses CPU and memory from your Kubernetes cluster.

## Google Cloud SQL (DBaaS)

### Advantages
- Very little database administration.
- Automatic backups and easy restore.
- High availability and failover are built in.
- Does not consume resources from the Kubernetes cluster.

### Disadvantages
- Higher cost.
- Less control over the database server.
- Tied to Google Cloud services.