# API Documentation

Complete API reference for the Kanban Board application.

## Base URL

\`\`\`
Development: http://localhost:3000/api
Production: https://yourdomain.com/api
\`\`\`

## Authentication

All API requests require authentication via NextAuth.js session cookies.

### Headers

\`\`\`http
Cookie: next-auth.session-token=<token>
Content-Type: application/json
\`\`\`

---

## Boards

### List Boards

Get all boards the user has access to.

**Endpoint:** \`GET /api/boards\`

**Response:**
\`\`\`json
[
  {
    "id": "board_123",
    "name": "Project Alpha",
    "description": "Main project board",
    "background": "#3b82f6",
    "isArchived": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "creatorId": "user_123",
    "creator": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "image": "https://..."
    },
    "members": [...],
    "columns": [...],
    "_count": {
      "tasks": 15
    }
  }
]
\`\`\`

---

### Create Board

Create a new board with default columns.

**Endpoint:** \`POST /api/boards\`

**Request:**
\`\`\`json
{
  "name": "New Project",
  "description": "Project description",
  "background": "#3b82f6"
}
\`\`\`

**Response:** \`201 Created\`
\`\`\`json
{
  "id": "board_124",
  "name": "New Project",
  "description": "Project description",
  "background": "#3b82f6",
  "isArchived": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "creatorId": "user_123",
  "columns": [
    {
      "id": "col_1",
      "name": "To Do",
      "position": 0,
      "color": "#60a5fa"
    },
    {
      "id": "col_2",
      "name": "In Progress",
      "position": 1,
      "color": "#fbbf24"
    },
    {
      "id": "col_3",
      "name": "Done",
      "position": 2,
      "color": "#34d399"
    }
  ]
}
\`\`\`

---

### Get Board

Get detailed information about a specific board.

**Endpoint:** \`GET /api/boards/:id\`

**Parameters:**
- \`id\` (string, required) - Board ID

**Response:**
\`\`\`json
{
  "id": "board_123",
  "name": "Project Alpha",
  "description": "Main project board",
  "background": "#3b82f6",
  "isArchived": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "creatorId": "user_123",
  "creator": {...},
  "members": [...],
  "columns": [...],
  "labels": [...]
}
\`\`\`

**Errors:**
- \`404\` - Board not found
- \`403\` - Access denied

---

### Update Board

Update board details.

**Endpoint:** \`PUT /api/boards/:id\`

**Request:**
\`\`\`json
{
  "name": "Updated Project Name",
  "description": "Updated description",
  "background": "#f59e0b",
  "isArchived": false
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": "board_123",
  "name": "Updated Project Name",
  ...
}
\`\`\`

---

### Delete Board

Delete a board and all its contents.

**Endpoint:** \`DELETE /api/boards/:id\`

**Response:**
\`\`\`json
{
  "success": true
}
\`\`\`

**Errors:**
- \`403\` - Only board owner can delete
- \`404\` - Board not found

---

## Tasks

### List Board Tasks

Get all tasks for a specific board.

**Endpoint:** \`GET /api/boards/:id/tasks\`

**Parameters:**
- \`id\` (string, required) - Board ID

**Response:**
\`\`\`json
[
  {
    "id": "task_123",
    "title": "Implement authentication",
    "description": "Add NextAuth.js",
    "position": 0,
    "priority": "HIGH",
    "dueDate": "2024-12-31T00:00:00.000Z",
    "startDate": null,
    "timeEstimate": 240,
    "timeSpent": 120,
    "isArchived": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "boardId": "board_123",
    "columnId": "col_2",
    "column": {
      "id": "col_2",
      "name": "In Progress"
    },
    "assignees": [...],
    "labels": [...],
    "comments": [...],
    "attachments": [...],
    "checklistItems": [...]
  }
]
\`\`\`

---

### Create Task

Create a new task in a board.

**Endpoint:** \`POST /api/boards/:id/tasks\`

**Request:**
\`\`\`json
{
  "title": "New Task",
  "description": "Task description",
  "columnId": "col_1",
  "position": 0,
  "priority": "MEDIUM",
  "dueDate": "2024-12-31",
  "startDate": "2024-01-01",
  "timeEstimate": 120,
  "assigneeIds": ["user_123"],
  "labelIds": ["label_1", "label_2"]
}
\`\`\`

**Response:** \`201 Created\`
\`\`\`json
{
  "id": "task_124",
  "title": "New Task",
  ...
}
\`\`\`

**Errors:**
- \`400\` - Missing required fields
- \`404\` - Board or column not found

---

### Get Task

Get detailed information about a task.

**Endpoint:** \`GET /api/tasks/:id\`

**Response:**
\`\`\`json
{
  "id": "task_123",
  "title": "Implement authentication",
  "description": "Add NextAuth.js",
  ...
  "dependencies": [
    {
      "id": "dep_1",
      "blockingTask": {
        "id": "task_100",
        "title": "Setup database"
      }
    }
  ],
  "dependents": [...]
}
\`\`\`

---

### Update Task

Update task details.

**Endpoint:** \`PUT /api/tasks/:id\`

**Request:**
\`\`\`json
{
  "title": "Updated title",
  "description": "Updated description",
  "priority": "URGENT",
  "dueDate": "2024-12-25",
  "timeSpent": 180
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": "task_123",
  "title": "Updated title",
  ...
}
\`\`\`

---

### Move Task

Move a task to a different column or position.

**Endpoint:** \`POST /api/tasks/:id/move\`

**Request:**
\`\`\`json
{
  "destinationColumnId": "col_3",
  "destinationPosition": 2
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": "task_123",
  "columnId": "col_3",
  "position": 2,
  ...
}
\`\`\`

**Note:** This endpoint handles position updates for all affected tasks automatically.

---

### Delete Task

Delete a task.

**Endpoint:** \`DELETE /api/tasks/:id\`

**Response:**
\`\`\`json
{
  "success": true
}
\`\`\`

---

## Priority Levels

\`\`\`typescript
enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT"
}
\`\`\`

---

## WebSocket Events

### Connection

\`\`\`javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  path: '/api/socket',
});
\`\`\`

### Events

#### Join Board
\`\`\`javascript
socket.emit('board:join', {
  boardId: 'board_123',
  userId: 'user_123'
});
\`\`\`

#### Leave Board
\`\`\`javascript
socket.emit('board:leave', {
  boardId: 'board_123',
  userId: 'user_123'
});
\`\`\`

#### Task Created
\`\`\`javascript
// Emit
socket.emit('task:created', {
  boardId: 'board_123',
  task: {...}
});

// Listen
socket.on('task:created', (data) => {
  console.log('New task created:', data);
});
\`\`\`

#### Task Updated
\`\`\`javascript
socket.on('task:updated', (data) => {
  console.log('Task updated:', data);
});
\`\`\`

#### Task Moved
\`\`\`javascript
socket.on('task:moved', (data) => {
  console.log('Task moved:', data);
});
\`\`\`

#### User Presence
\`\`\`javascript
// Send cursor position
socket.emit('user:presence', {
  boardId: 'board_123',
  userId: 'user_123',
  cursor: { x: 100, y: 200 }
});

// Receive other users' cursors
socket.on('user:presence', (data) => {
  console.log('User cursor:', data);
});
\`\`\`

---

## Error Responses

All errors follow this format:

\`\`\`json
{
  "error": "Error message description"
}
\`\`\`

### Status Codes

- \`200\` - Success
- \`201\` - Created
- \`400\` - Bad Request
- \`401\` - Unauthorized
- \`403\` - Forbidden
- \`404\` - Not Found
- \`500\` - Internal Server Error

---

## Rate Limiting

- **Rate:** 100 requests per minute per user
- **Burst:** 10 requests per second

Exceeded limits return \`429 Too Many Requests\`.

---

## Pagination

For endpoints returning large datasets:

**Query Parameters:**
- \`page\` (number, default: 1)
- \`limit\` (number, default: 50, max: 100)

**Response:**
\`\`\`json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "pages": 3
  }
}
\`\`\`

---

## Filtering & Sorting

### Task Filters

\`\`\`
GET /api/boards/:id/tasks?priority=HIGH,URGENT&assignee=user_123
\`\`\`

**Available Filters:**
- \`priority\` - Filter by priority (comma-separated)
- \`assignee\` - Filter by assignee ID
- \`label\` - Filter by label ID
- \`search\` - Search in title and description

### Sorting

\`\`\`
GET /api/boards/:id/tasks?sortBy=dueDate&order=asc
\`\`\`

**Sort Fields:**
- \`createdAt\`
- \`updatedAt\`
- \`dueDate\`
- \`priority\`
- \`title\`

**Order:**
- \`asc\` - Ascending
- \`desc\` - Descending

---

## SDK Example

\`\`\`typescript
import { createKanbanClient } from '@/lib/api-client';

const client = createKanbanClient({
  baseUrl: 'http://localhost:3000/api',
});

// List boards
const boards = await client.boards.list();

// Create task
const task = await client.tasks.create(boardId, {
  title: 'New Task',
  columnId: 'col_1',
  priority: 'HIGH',
});

// Move task
await client.tasks.move(taskId, {
  destinationColumnId: 'col_2',
  destinationPosition: 0,
});
\`\`\`

---

For more information or support, visit our [GitHub repository](https://github.com/yourorg/kanban-board).


