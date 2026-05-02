# Vehicle Scheduler Backend 🚗⚙️

A backend microservice system designed to optimize vehicle maintenance scheduling and manage notification systems efficiently.

---

## 🚀 Quick Preview

* Logging Middleware → `/test-log`
* Scheduler Output → `/schedule`
* Priority Notifications → `/priority`

👉 Designed to handle real-world backend workloads with optimization and scalability.

---

## 📌 Features

* 🔹 Logging Middleware with external API integration
* 🔹 Vehicle Maintenance Scheduler (Knapsack-based optimization)
* 🔹 Priority Notification System (Placement > Result > Event)
* 🔹 REST APIs for scheduling and logging
* 🔹 System Design for scalable notification architecture

---

## 🏛️ System Architecture

```
Client → Express Server → Services
                      ↳ Logging Middleware
                      ↳ Scheduler Engine
                      ↳ Notification Service

External APIs → Data Source
```

---

## 🏗️ Project Structure

```
vehicle-scheduler-backend/
│
├── logging_middleware/
│   ├── auth.js
│   └── logger.js
│
├── vehicle_maintenance_scheduler/
│   ├── scheduler.js
│   └── server.js
│
├── notification_app_be/
│   └── priority.js
│
├── screenshots/
│   ├── test-log.png
│   ├── scheduler.png
│   ├── scheduler-visualized.png
│   └── priority.png
│
├── notification_system_design.md
├── package.json
├── .gitignore
```

---

## ⚙️ Setup Instructions

```bash
npm install
node vehicle_maintenance_scheduler/server.js
```

Server runs on:

```
http://localhost:3000
```

---

## 📡 API Endpoints

### 1. Test Logging

```
GET /test-log
```

### 2. Vehicle Scheduler

```
GET /schedule
```

### 3. Priority Notifications

```
GET /priority
```

---

## 📊 Output Screenshots

### 🔹 Logging Middleware Test

Validates external logging integration
![Test Log](screenshots/test-log.png)

---

### 🔹 Vehicle Scheduling Output

Optimized task allocation maximizing impact under constraints
![Scheduler](screenshots/scheduler.png)

---

### 🔹 Scheduler Visualization

Structured and readable output representation
![Scheduler Visualization](screenshots/scheduler-visualized.png)

---

### 🔹 Priority Notifications (Stage 6)

![Priority](screenshots/priority.png)

---

## 🧠 Approach

### Vehicle Scheduling

* Used greedy/knapsack-based approach
* Maximizes impact under time constraints
* Handles large input efficiently

### Logging Middleware

* Centralized logging function
* Sends logs to external API
* Supports levels: debug, info, warn, error, fatal

### Notification System

* Priority-based ranking system:

  * Placement > Result > Event
* Sorted by recency + importance
* Returns top N notifications efficiently

---

## 🧠 Key Engineering Decisions

* Used knapsack-based optimization for scheduling efficiency
* Decoupled notification system from scheduler for scalability
* Implemented priority ranking using weighted scoring
* Used external logging service to simulate real-world observability

---

## ⚡ Performance Considerations

* Pagination used to limit response size
* Sorting optimized using priority scoring
* Efficient async API handling
* Designed for scalability with caching/queue support

---

## 🛡️ Edge Cases Handled

* No valid tasks within time constraint
* Large dataset handling
* API failures or delays
* Priority conflicts resolved using timestamp

---

## 🚀 Future Improvements

* Add Redis caching for faster reads
* Introduce message queue (Kafka/RabbitMQ)
* Build frontend dashboard
* Add authentication layer

---

## 🌍 Real-World Relevance

* Optimizes limited resource allocation (mechanic hours)
* Simulates real notification systems
* Demonstrates scalable backend architecture

---

## ⚡ Tech Stack

* Node.js
* Express.js
* Axios

---

## 📌 Notes

* No personal details included in repository as per guidelines
* External APIs used for data fetching
* Designed with scalability and production practices in mind

---

## 🚀 Author

Backend Developer | System Design Enthusiast
