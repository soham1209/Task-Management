# Task API Testing Checklist

Manual testing checklist for the `tasks` API. All examples were run against
the dev server (`python manage.py runserver`) at `http://localhost:8000`.

Load sample data first so list/filter checks have something to return:

```bash
python manage.py migrate
python manage.py loaddata sample_tasks
```

---

## GET /api/tasks/

- [ ] Returns `200 OK`
- [ ] Returns a JSON array of all tasks
- [ ] Tasks are ordered newest first (`-created_at`)
- [ ] Each task includes `id`, `title`, `description`, `status`, `created_at`

**Request**
```
GET /api/tasks/
```

**Response — `200 OK`**
```json
[
  {
    "id": 6,
    "title": "Set up CI pipeline",
    "description": "Configure automated test runs on every push.",
    "status": "done",
    "created_at": "2026-06-20T14:45:00Z"
  },
  {
    "id": 1,
    "title": "Set up project repository",
    "description": "Initialize git repo and push the initial commit.",
    "status": "pending",
    "created_at": "2026-06-18T09:00:00Z"
  }
]
```
*(abbreviated — actual response includes all tasks in the database)*

---

## GET /api/tasks/?status=pending

- [ ] Returns `200 OK`
- [ ] Returns only tasks with `status: "pending"`

**Request**
```
GET /api/tasks/?status=pending
```

**Response — `200 OK`**
```json
[
  {
    "id": 2,
    "title": "Design database schema",
    "description": "Define the Task model fields and relationships.",
    "status": "pending",
    "created_at": "2026-06-18T09:15:00Z"
  },
  {
    "id": 1,
    "title": "Set up project repository",
    "description": "Initialize git repo and push the initial commit.",
    "status": "pending",
    "created_at": "2026-06-18T09:00:00Z"
  }
]
```

---

## GET /api/tasks/?status=in_progress

- [ ] Returns `200 OK`
- [ ] Returns only tasks with `status: "in_progress"`

**Request**
```
GET /api/tasks/?status=in_progress
```

**Response — `200 OK`**
```json
[
  {
    "id": 4,
    "title": "Build frontend task list",
    "description": "Create a React component to display tasks fetched from the API.",
    "status": "in_progress",
    "created_at": "2026-06-19T11:30:00Z"
  },
  {
    "id": 3,
    "title": "Implement task API",
    "description": "Build REST endpoints for listing, creating, and updating tasks.",
    "status": "in_progress",
    "created_at": "2026-06-19T10:00:00Z"
  }
]
```

---

## GET /api/tasks/?status=done

- [ ] Returns `200 OK`
- [ ] Returns only tasks with `status: "done"`

**Request**
```
GET /api/tasks/?status=done
```

**Response — `200 OK`**
```json
[
  {
    "id": 6,
    "title": "Set up CI pipeline",
    "description": "Configure automated test runs on every push.",
    "status": "done",
    "created_at": "2026-06-20T14:45:00Z"
  },
  {
    "id": 5,
    "title": "Write unit tests",
    "description": "",
    "status": "done",
    "created_at": "2026-06-20T08:00:00Z"
  }
]
```

---

## GET /api/tasks/?status=invalid

- [ ] Returns `400 Bad Request`
- [ ] Returns a clear error message naming the invalid value and the allowed values
- [ ] Does **not** return any task data

**Request**
```
GET /api/tasks/?status=invalid
```

**Response — `400 Bad Request`**
```json
{
  "status": "Invalid status 'invalid'. Must be one of: pending, in_progress, done."
}
```

---

## POST /api/tasks/

- [ ] Valid request returns `201 Created`
- [ ] Response body is the full created task, including server-assigned `id` and `created_at`
- [ ] Omitting `status` defaults it to `"pending"`
- [ ] Omitting `description` defaults it to `""`
- [ ] Empty `title` (`""`) returns `400` with a clear message
- [ ] Missing `title` key returns `400` with a clear message
- [ ] Invalid `status` value returns `400` with a clear message

**Request — valid, with description**
```
POST /api/tasks/
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

**Response — `201 Created`**
```json
{
  "id": 7,
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "status": "pending",
  "created_at": "2026-06-24T04:21:39.602742Z"
}
```

**Request — invalid, empty title**
```
POST /api/tasks/
Content-Type: application/json

{
  "title": "",
  "description": "Milk, eggs, bread"
}
```

**Response — `400 Bad Request`**
```json
{
  "title": ["Title cannot be empty."]
}
```

**Request — invalid, missing title**
```
POST /api/tasks/
Content-Type: application/json

{
  "description": "Milk, eggs, bread"
}
```

**Response — `400 Bad Request`**
```json
{
  "title": ["Title is required."]
}
```

**Request — invalid status**
```
POST /api/tasks/
Content-Type: application/json

{
  "title": "Buy groceries",
  "status": "archived"
}
```

**Response — `400 Bad Request`**
```json
{
  "status": ["Status must be one of: pending, in_progress, done."]
}
```

---

## PATCH /api/tasks/<id>/

- [ ] Valid `status` update returns `200 OK`
- [ ] Response body is the full task with the updated `status`
- [ ] Sending `title`/`description` alongside `status` does not change them (status-only endpoint)
- [ ] Invalid `status` value returns `400` with a clear message
- [ ] Missing `status` key returns `400` with a clear message
- [ ] Non-existent `id` returns `404`
- [ ] `PUT` on this endpoint returns `405 Method Not Allowed` (PATCH-only)

**Request — valid**
```
PATCH /api/tasks/7/
Content-Type: application/json

{
  "status": "in_progress"
}
```

**Response — `200 OK`**
```json
{
  "id": 7,
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "status": "in_progress",
  "created_at": "2026-06-24T04:21:39.602742Z"
}
```

**Request — invalid status**
```
PATCH /api/tasks/7/
Content-Type: application/json

{
  "status": "archived"
}
```

**Response — `400 Bad Request`**
```json
{
  "status": ["Status must be one of: pending, in_progress, done."]
}
```

**Request — missing status**
```
PATCH /api/tasks/7/
Content-Type: application/json

{}
```

**Response — `400 Bad Request`**
```json
{
  "status": ["Status is required."]
}
```

**Request — non-existent id**
```
PATCH /api/tasks/9999/
Content-Type: application/json

{
  "status": "done"
}
```

**Response — `404 Not Found`**
```json
{
  "detail": "No Task matches the given query."
}
```
