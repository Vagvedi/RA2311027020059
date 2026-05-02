# Stage 1: Notification System API Design

## Overview

The notification system enables students to receive real-time updates regarding placements, events, and results. It is designed to be scalable, low-latency, and capable of handling high volumes of notifications efficiently.

---

## Core Functionalities

* Send notifications to one or multiple students
* Retrieve all notifications for a user
* Retrieve only unread notifications
* Mark notifications as read
* Support real-time delivery

---

## API Design

### 1. Create Notification

**POST /notifications**

**Description:** Create and send a notification to a student

**Request Body:**

```json
{
  "studentId": "string",
  "type": "Placement | Event | Result",
  "message": "string"
}
```

**Response:**

```json
{
  "notificationId": "string",
  "status": "created"
}
```

---

### 2. Get All Notifications

**GET /notifications/{studentId}**

**Description:** Fetch all notifications for a student

**Response:**

```json
[
  {
    "id": "string",
    "type": "Placement",
    "message": "Company hiring",
    "timestamp": "ISO8601",
    "read": false
  }
]
```

---

### 3. Get Unread Notifications

**GET /notifications/{studentId}/unread**

**Description:** Fetch only unread notifications

**Response:**

```json
[
  {
    "id": "string",
    "type": "Event",
    "message": "Tech fest",
    "timestamp": "ISO8601",
    "read": false
  }
]
```

---

### 4. Mark Notification as Read

**PATCH /notifications/{notificationId}/read**

**Description:** Mark a notification as read

**Response:**

```json
{
  "status": "updated"
}
```

---

## Real-Time Notification Design

To enable real-time updates, the system will use:

### WebSockets

* Persistent connection between client and server
* Server pushes notifications instantly
* Suitable for high-frequency updates

### Server-Sent Events (SSE)

* Lightweight alternative to WebSockets
* Suitable for unidirectional updates (server → client)

---

## System Components

* **API Layer:** Handles HTTP requests and validation
* **Service Layer:** Business logic for notifications
* **Delivery Layer:** Handles real-time push (WebSocket/SSE)
* **Storage Layer:** Stores notifications persistently

---

## Error Handling

* Return appropriate HTTP status codes (200, 400, 500)
* Validate request payload before processing
* Provide meaningful error messages

---

## Security Considerations

* Authenticate API requests using tokens (JWT)
* Authorize access based on user identity
* Prevent unauthorized access to notifications

---

# Stage 2: Database Design and Scalability

## Database Choice

A **NoSQL database (MongoDB)** is preferred.

### Reasons:

* Flexible schema for evolving notification structure
* High write throughput (important for bulk notifications)
* Easy horizontal scaling using sharding
* Better suited for large-scale distributed systems

---

## Data Model

### Collection: `notifications`

```json
{
  "_id": "ObjectId",
  "studentId": "string",
  "type": "Placement | Event | Result",
  "message": "string",
  "timestamp": "ISODate",
  "read": false
}
```

---

## Indexing Strategy

To optimize performance:

* Index on `studentId` → fast user queries
* Index on `read` → efficient unread filtering
* Index on `timestamp` → sorting latest notifications

```js
db.notifications.createIndex({ studentId: 1, read: 1, timestamp: -1 })
```

---

## Scaling Challenges

### 1. High Write Load

* Bulk notification events (e.g., placements)
* Thousands of users receiving notifications simultaneously

### 2. Large Data Volume

* Notifications grow rapidly over time
* Storage and query performance degrade

### 3. Query Performance Issues

* Fetching unread notifications becomes slow without indexing

---

## Solutions

### 1. Sharding

* Partition data by `studentId`
* Distributes load across multiple database nodes

### 2. Archiving Strategy

* Move old notifications to cold storage
* Keeps active dataset small and efficient

### 3. Caching (Redis)

* Cache frequently accessed notifications
* Reduces database read load

### 4. Pagination

* Fetch notifications in batches
* Improves response time and scalability

---

## Sample Queries

### Fetch unread notifications

```js
db.notifications.find({
  studentId: "123",
  read: false
}).sort({ timestamp: -1 }).limit(20)
```

---

### Mark notification as read

```js
db.notifications.updateOne(
  { _id: "notificationId" },
  { $set: { read: true } }
)
```

---

## Summary

The system uses a scalable NoSQL architecture with indexing, sharding, caching, and pagination to efficiently handle large-scale notification workloads.

---
