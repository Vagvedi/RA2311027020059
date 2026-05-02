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

# Stage 3: Query Optimization and Indexing

## Given Query

```sql
SELECT * FROM notifications
WHERE studentId = 1042 AND isRead = false
ORDER BY createdAt DESC;
```

---

## Is this Query Correct?

Yes, the query is logically correct. It retrieves unread notifications for a specific student sorted by latest first.

However, it is **inefficient for large datasets**.

---

## Why is the Query Slow?

As the dataset grows (millions of records), performance degrades due to:

* Full table scan when indexes are absent
* Sorting overhead on large result sets
* Fetching unnecessary columns using `SELECT *`

---

## Should We Add Indexes on Every Column?

No, adding indexes on every column is not effective because:

* It increases storage overhead
* Slows down insert/update operations
* Not all columns are frequently queried

👉 Indexing should be strategic and query-driven.

---

## Optimized Index Strategy

Use a **composite index**:

```sql
CREATE INDEX idx_notifications_student_read_time
ON notifications (studentId, isRead, createdAt DESC);
```

### Benefits:

* Efficient filtering on `studentId` and `isRead`
* Faster sorting using indexed order
* Eliminates full table scan

---

## Optimized Query

```sql
SELECT id, type, message, createdAt
FROM notifications
WHERE studentId = 1042 AND isRead = false
ORDER BY createdAt DESC
LIMIT 20;
```

### Improvements:

* Avoids unnecessary data fetch
* Uses pagination
* Leverages index efficiently

---

## Query: Placement Notifications in Last 7 Days

```sql
SELECT id, message, createdAt
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL 7 DAY;
```

---

## Time Complexity

* Without index → **O(n)**
* With index → **O(log n)**

---

## Summary

The query can be significantly optimized using:

* Composite indexing
* Pagination
* Selective field retrieval

This ensures efficient performance at scale.

---

# Stage 4: System Scaling and Performance Optimization

## Problem

Notifications are fetched on every page load for each student.
This results in:

* High database load
* Increased response time
* Poor user experience

---

## Proposed Solutions

### 1. Caching (Redis)

* Cache frequently accessed notifications (especially unread ones)
* Reduce repeated database queries

**Flow:**

* First request → fetch from DB → store in cache
* Subsequent requests → serve from cache

---

### 2. Pagination

* Load notifications in chunks (e.g., 20 per request)
* Prevents large data transfer

---

### 3. Lazy Loading / Infinite Scroll

* Load data only when user scrolls
* Reduces initial load time

---

### 4. Asynchronous Processing (Queue)

* Use message queues (Kafka/RabbitMQ) for notification creation
* Decouple write-heavy operations from user requests

---

### 5. Database Optimization

* Use indexing (from Stage 3)
* Partition tables based on time
* Archive old notifications

---

### 6. Read Replicas

* Use replica databases for read-heavy operations
* Reduces load on primary DB

---

## Trade-offs

| Strategy      | Advantage               | Trade-off                     |
| ------------- | ----------------------- | ----------------------------- |
| Caching       | Fast response time      | Cache invalidation complexity |
| Pagination    | Reduced load            | Requires multiple requests    |
| Queues        | Scalable writes         | Added system complexity       |
| Read Replicas | Better read performance | Data replication lag          |

---

## Recommended Approach

A combination of:

* **Caching (Redis)**
* **Pagination**
* **Read replicas**

provides the best balance of performance and scalability.

---

## Summary

To handle large-scale traffic, the system should:

* Reduce direct DB access using caching
* Optimize queries using indexing
* Distribute load using replicas and queues

This ensures high performance and a smooth user experience.

---

