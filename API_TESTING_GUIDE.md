# API Testing Guide

Quick reference for testing all endpoints.

## Employee Endpoints

### Create Employee
```bash
POST http://localhost:3000/employee
Content-Type: application/json

{
  "name": "Alice Johnson"
}
```

### Get All Employees
```bash
GET http://localhost:3000/employee
```

### Get Employee by ID
```bash
GET http://localhost:3000/employee/1
```

### Update Employee
```bash
PATCH http://localhost:3000/employee/1
Content-Type: application/json

{
  "name": "Alice Smith"
}
```

### Delete Employee
```bash
DELETE http://localhost:3000/employee/1
```

---

## Activity Endpoints

### Create Activity
```bash
POST http://localhost:3000/activity
Content-Type: application/json

{
  "employeeId": 1,
  "lastWorkedAt": "2025-12-05T10:00:00Z"
}
```

### Get All Activities
```bash
GET http://localhost:3000/activity
```

### Get Activities by Employee
```bash
GET http://localhost:3000/activity/employee/1
```

### Get Activity by ID
```bash
GET http://localhost:3000/activity/1
```

### Update Activity
```bash
PATCH http://localhost:3000/activity/1
Content-Type: application/json

{
  "lastWorkedAt": "2025-12-05T15:00:00Z"
}
```

### Delete Activity
```bash
DELETE http://localhost:3000/activity/1
```

---

## Assignment Endpoints

### Assign Task to Employee
```bash
POST http://localhost:3000/assignments/assign
Content-Type: application/json

{
  "employeeId": 1,
  "title": "Complete project documentation"
}
```

### Unassign Task
```bash
POST http://localhost:3000/assignments/unassign/1
```

### Balance Workload (Auto-assign to least busy)
```bash
POST http://localhost:3000/assignments/balance
Content-Type: application/json

{
  "title": "New urgent task"
}
```

### Get Employees with Assignment Stats
```bash
GET http://localhost:3000/assignments/employees
```

### Get Assignment Statistics
```bash
GET http://localhost:3000/assignments/stats
```

### Get Assignment Patterns (30 days)
```bash
GET http://localhost:3000/assignments/patterns/assignments
```

### Get Employee Patterns
```bash
GET http://localhost:3000/assignments/patterns/employees
```

### Get System Insights
```bash
GET http://localhost:3000/assignments/insights
```

### Cleanup Old Assignments
```bash
POST http://localhost:3000/assignments/cleanup/30
```

---

## Testing Workflow

### 1. Setup Test Data
```bash
# Create employees
POST /employee {"name": "Alice"}
POST /employee {"name": "Bob"}
POST /employee {"name": "Charlie"}

# Create activities (auto-created when assigning, but can be manual)
POST /activity {"employeeId": 1}
POST /activity {"employeeId": 2}
POST /activity {"employeeId": 3}
```

### 2. Assign Tasks
```bash
POST /assignments/assign {"employeeId": 1, "title": "Task 1"}
POST /assignments/assign {"employeeId": 1, "title": "Task 2"}
POST /assignments/assign {"employeeId": 2, "title": "Task 3"}
```

### 3. Check Statistics
```bash
GET /assignments/stats
GET /assignments/employees
```

### 4. Balance Workload
```bash
POST /assignments/balance {"title": "New Task"}
# Should assign to Charlie (least busy)
```

### 5. View Analytics
```bash
GET /assignments/patterns/assignments
GET /assignments/patterns/employees
GET /assignments/insights
```

---

## Using REST Client (VS Code Extension)

Create a file `api-tests.http`:

```http
### Create Employee
POST http://localhost:3000/employee
Content-Type: application/json

{
  "name": "Test Employee"
}

### Get All Employees
GET http://localhost:3000/employee

### Assign Task
POST http://localhost:3000/assignments/assign
Content-Type: application/json

{
  "employeeId": 1,
  "title": "Test Assignment"
}

### Get Stats
GET http://localhost:3000/assignments/stats
```

Click "Send Request" above each endpoint to test.

---

## Expected Responses

### Success Response (Create Employee)
```json
{
  "id": 1,
  "name": "Alice Johnson"
}
```

### Success Response (Get Employees with Stats)
```json
[
  {
    "id": 1,
    "name": "Alice Johnson",
    "totalAssignments": 5,
    "activeAssignments": 3,
    "lastActivity": "2025-12-05T10:30:00.000Z"
  }
]
```

### Error Response (Not Found)
```json
{
  "statusCode": 404,
  "message": "Employee with ID 999 not found",
  "error": "Not Found"
}
```

### Error Response (Validation)
```json
{
  "statusCode": 400,
  "message": [
    "name should not be empty",
    "name must be a string",
    "name must be longer than or equal to 2 characters"
  ],
  "error": "Bad Request"
}
```
