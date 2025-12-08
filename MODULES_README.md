# NestJS CRUD Modules Documentation

This document provides an overview of all CRUD modules in the application.

## Modules Overview

### 1. **Employee Module** (`src/employee`)
Handles CRUD operations for Employee entities.

#### Endpoints:
- `POST /employee` - Create a new employee
- `GET /employee` - Get all employees (with activities and assignments)
- `GET /employee/:id` - Get a specific employee by ID
- `PATCH /employee/:id` - Update an employee
- `DELETE /employee/:id` - Delete an employee

#### DTOs:
**CreateEmployeeDto:**
```typescript
{
  name: string; // Required, min 2 characters
}
```

**UpdateEmployeeDto:**
```typescript
{
  name?: string; // Optional
}
```

#### Features:
- ✅ Full CRUD operations
- ✅ Prisma integration
- ✅ Includes related activities and assignments
- ✅ Input validation with class-validator
- ✅ Error handling and logging
- ✅ Not Found exceptions

---

### 2. **Activity Module** (`src/activity`)
Handles CRUD operations for Activity entities.

#### Endpoints:
- `POST /activity` - Create a new activity
- `GET /activity` - Get all activities
- `GET /activity/employee/:employeeId` - Get activities for a specific employee
- `GET /activity/:id` - Get a specific activity by ID
- `PATCH /activity/:id` - Update an activity
- `DELETE /activity/:id` - Delete an activity

#### DTOs:
**CreateActivityDto:**
```typescript
{
  employeeId: number; // Required
  lastWorkedAt?: string; // Optional, ISO date string
}
```

**UpdateActivityDto:**
```typescript
{
  employeeId?: number; // Optional
  lastWorkedAt?: string; // Optional, ISO date string
}
```

#### Features:
- ✅ Full CRUD operations
- ✅ Prisma integration
- ✅ Employee validation on create
- ✅ Custom route for finding by employee
- ✅ Includes related employee and assignments
- ✅ Input validation with class-validator
- ✅ Error handling and logging

---

### 3. **Employee Assignment Module** (`src/employee-assignment`)
Advanced module for managing employee assignments with analytics and cron jobs.

#### Endpoints:
- `POST /assignments/assign` - Assign a task to an employee
- `POST /assignments/unassign/:id` - Unassign a task
- `POST /assignments/balance` - Auto-assign to least busy employee
- `GET /assignments/employees` - Get all employees with assignment stats
- `GET /assignments/stats` - Get assignment statistics
- `GET /assignments/patterns/assignments` - Get assignment patterns (30 days)
- `GET /assignments/patterns/employees` - Get employee patterns
- `GET /assignments/insights` - Get system insights
- `POST /assignments/cleanup/:days` - Cleanup old assignments

#### Features:
- ✅ Assignment management
- ✅ Workload balancing
- ✅ Pattern analysis
- ✅ System insights and recommendations
- ✅ Automated cleanup
- ✅ Cron job integration
- ✅ Separated types and helpers
- ✅ Comprehensive logging

---

## Module Structure

```
src/
├── employee/
│   ├── dto/
│   │   ├── create-employee.dto.ts
│   │   └── update-employee.dto.ts
│   ├── entities/
│   │   └── employee.entity.ts
│   ├── employee.controller.ts
│   ├── employee.service.ts
│   └── employee.module.ts
│
├── activity/
│   ├── dto/
│   │   ├── create-activity.dto.ts
│   │   └── update-activity.dto.ts
│   ├── entities/
│   │   └── activity.entity.ts
│   ├── activity.controller.ts
│   ├── activity.service.ts
│   └── activity.module.ts
│
├── employee-assignment/
│   ├── employee-assignment.controller.ts
│   ├── employee-assignment.service.ts
│   ├── employee-assignment.module.ts
│   ├── employee-assignment.types.ts
│   ├── employee-assignment-cron.service.ts
│   ├── pattern-analysis.service.ts
│   ├── index.ts
│   ├── TYPES_README.md
│   └── REFACTORING_SUMMARY.md
│
└── prisma/
    ├── prisma.service.ts
    └── prisma.module.ts
```

## Database Schema

```prisma
model Employee {
  id          Int          @id @default(autoincrement())
  name        String
  activities  Activity[]
}

model Activity {
  id           Int          @id @default(autoincrement())
  employeeId   Int
  lastWorkedAt DateTime?
  employee     Employee     @relation(fields: [employeeId], references: [id])
  assignments  Assignment[]
}

model Assignment {
  id         Int          @id @default(autoincrement())
  title      String
  activityId Int
  activity   Activity     @relation(fields: [activityId], references: [id])
  assignedAt DateTime     @default(now())
  status     Boolean      @default(true)
}
```

## Dependencies

- **@nestjs/common** - NestJS core
- **@nestjs/core** - NestJS core
- **@prisma/client** - Prisma ORM
- **class-validator** - DTO validation
- **class-transformer** - DTO transformation

## Usage Examples

### Create an Employee
```bash
curl -X POST http://localhost:3000/employee \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe"}'
```

### Create an Activity
```bash
curl -X POST http://localhost:3000/activity \
  -H "Content-Type: application/json" \
  -d '{"employeeId": 1, "lastWorkedAt": "2025-12-05T10:00:00Z"}'
```

### Assign a Task
```bash
curl -X POST http://localhost:3000/assignments/assign \
  -H "Content-Type: application/json" \
  -d '{"employeeId": 1, "title": "Complete project documentation"}'
```

### Balance Workload
```bash
curl -X POST http://localhost:3000/assignments/balance \
  -H "Content-Type: application/json" \
  -d '{"title": "New urgent task"}'
```

## Best Practices

1. **Always validate input** - Use DTOs with class-validator decorators
2. **Handle errors gracefully** - Use try-catch blocks and appropriate HTTP exceptions
3. **Log important events** - Use the Logger service for debugging
4. **Include relations** - Use Prisma's include option to fetch related data
5. **Check existence** - Validate foreign keys before creating related entities
6. **Export services** - Make services available for other modules

## Testing

Run the application:
```bash
npm run start:dev
```

Test endpoints using tools like:
- Postman
- cURL
- Thunder Client (VS Code extension)
- REST Client (VS Code extension)

## Future Enhancements

- [ ] Add pagination to list endpoints
- [ ] Add filtering and sorting options
- [ ] Add bulk operations
- [ ] Add soft delete functionality
- [ ] Add audit logging
- [ ] Add API documentation with Swagger
- [ ] Add unit and e2e tests
