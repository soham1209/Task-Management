# Task Manager

A full-stack task management application. The backend is a Django REST
Framework API backed by SQLite; the frontend is a React (Vite) single-page
app styled with Tailwind CSS. Users can create tasks, filter them by status,
update a task's status, and delete tasks — all changes are persisted via the
API in real time.

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Backend  | Django 6, Django REST Framework, SQLite, django-cors-headers |
| Frontend | React 19, Vite, Axios, Tailwind CSS v4, lucide-react |

## Project Structure

```
task-manager/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── API_TESTING_CHECKLIST.md   # manual API test cases with example requests/responses
│   ├── db.sqlite3                 # created after running migrations (gitignored)
│   ├── task_manager/              # Django project config
│   │   ├── settings.py
│   │   └── urls.py
│   └── tasks/                     # Django app — all task functionality lives here
│       ├── models.py              # Task model
│       ├── serializers.py         # TaskSerializer, TaskStatusUpdateSerializer
│       ├── views.py                # TaskListCreateView, TaskDetailView
│       ├── urls.py                 # /api/tasks/ routes
│       ├── admin.py
│       └── fixtures/
│           └── sample_tasks.json  # 6 sample tasks for local development
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx                 # top-level layout, owns shared filter/refresh state
        ├── main.jsx
        ├── api/
        │   ├── tasks.js             # axios calls: getTasks, createTask, updateTaskStatus, deleteTask
        │   └── errors.js            # parses DRF error responses into display-friendly messages
        ├── hooks/
        │   └── useTasks.js          # data fetching + create/update/delete state, used by TaskList
        ├── components/
        │   ├── TaskForm.jsx         # create-task form
        │   ├── TaskFilter.jsx       # status filter pills
        │   ├── TaskList.jsx         # fetches and renders the task list
        │   ├── TaskItem.jsx         # single task card (status dropdown + delete)
        │   ├── FormField.jsx        # shared labeled input/textarea with validation styling
        │   └── Spinner.jsx          # shared loading spinner
        └── constants/
            └── taskStatus.js        # single source of truth for status values/labels/colors
```

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 18+ and npm

### Backend Setup

```bash
cd task-manager/backend

# 1. Create a virtual environment
python -m venv venv

# 2. Activate it
source venv/Scripts/activate      # Windows (Git Bash)
# venv\Scripts\Activate.ps1       # Windows (PowerShell)
# source venv/bin/activate        # macOS/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Apply database migrations
python manage.py migrate

# 5. Load sample data (6 tasks: 2 pending, 2 in_progress, 2 done)
python manage.py loaddata sample_tasks

# 6. Run the development server
python manage.py runserver
```

The API is now running at **http://localhost:8000/api/**.

> Re-running `loaddata sample_tasks` at any time is safe — it overwrites the
> same fixed-id rows rather than duplicating them.

### Frontend Setup

In a separate terminal:

```bash
cd task-manager/frontend

# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```

The app is now running at **http://localhost:3000/** and talks to the
backend at `http://localhost:8000/api` (configured in `src/api/tasks.js`).

Both servers need to be running at the same time for the app to work.

## API Endpoints

Base URL: `http://localhost:8000/api`

| Method   | Endpoint            | Description                                  |
|----------|----------------------|-----------------------------------------------|
| `GET`    | `/tasks/`            | List all tasks, newest first |
| `GET`    | `/tasks/?status=<status>` | List tasks filtered by status (`pending`, `in_progress`, or `done`); invalid values return `400` |
| `POST`   | `/tasks/`            | Create a task. Body: `{ "title": str, "description"?: str, "status"?: str }`. `title` is required and non-blank; `status` defaults to `pending` |
| `PATCH`  | `/tasks/<id>/`       | Update **only** a task's status. Body: `{ "status": str }` |
| `DELETE` | `/tasks/<id>/`       | Delete a task. Returns `204 No Content` |

All validation errors return `400` with a JSON body describing what's wrong,
e.g. `{"title": ["Title cannot be empty."]}`. A missing task on `PATCH`/`DELETE`
returns `404`. See [`backend/API_TESTING_CHECKLIST.md`](backend/API_TESTING_CHECKLIST.md)
for the full set of request/response examples used to manually verify the API.

## Assumptions & Design Decisions

- **No authentication.** All tasks belong to a single shared list — there's
  no concept of users or ownership. Adding auth was out of scope for this
  assignment.
- **Status is the only field that can be updated after creation.** There is
  no endpoint to edit a task's title or description once created, by design
  — `PATCH` is intentionally limited to `status` only.
- **Status values are fixed** to `pending` / `in_progress` / `done`. There's
  no API or UI for defining custom statuses.
- **SQLite is used as-is**, suitable for local development and review, not
  intended as a production database choice.
- **No pagination** on `GET /tasks/` — acceptable given the expected size of
  the task list for this assignment; would need to be added for large
  datasets.
- **CORS is restricted to `http://localhost:3000`** (the frontend dev
  server's origin) and the frontend's API base URL is hardcoded to
  `http://localhost:8000/api` — both assume local development, not a
  configurable multi-environment deployment.
- **Deleting a task asks for confirmation in the browser** (`window.confirm`)
  before calling the API; there's no soft-delete or undo.
- **No automated test suite.** Backend and frontend behavior were verified
  manually throughout development (see `API_TESTING_CHECKLIST.md` for the
  backend) rather than with an automated test suite like `pytest` or
  `vitest`.
