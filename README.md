# Task Manager

Initial project scaffold for the Task Manager assignment. Backend is Django + Django REST Framework (SQLite), frontend is React (Vite) + Axios. No business logic has been implemented yet — this sets up structure, configuration, and tooling only.

## Project Structure

```
task-manager/
├── backend/
│   ├── venv/                # Python virtual environment
│   ├── manage.py
│   ├── requirements.txt
│   ├── task_manager/        # Django project (settings, urls, wsgi/asgi)
│   └── tasks/                # Django app (models/views/serializers go here)
├── frontend/
│   ├── src/
│   │   ├── components/       # React components go here
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Backend Setup

Commands used to create the backend:

```bash
cd task-manager/backend

# Create and activate virtual environment
python -m venv venv
source venv/Scripts/activate      # Windows (Git Bash)
# venv\Scripts\activate.bat       # Windows (cmd)
# venv\Scripts\Activate.ps1       # Windows (PowerShell)

# Install dependencies
python -m pip install --upgrade pip
pip install django djangorestframework django-cors-headers

# Create Django project and app
django-admin startproject task_manager .
python manage.py startapp tasks

# Freeze dependencies
pip freeze > requirements.txt

# Apply initial migrations
python manage.py migrate
```

To run the backend dev server:

```bash
cd task-manager/backend
source venv/Scripts/activate
python manage.py runserver
```

The API will be available at `http://localhost:8000/`.

### Configuration notes

- `INSTALLED_APPS` includes `rest_framework`, `corsheaders`, and `tasks`.
- `corsheaders.middleware.CorsMiddleware` is added near the top of `MIDDLEWARE` (required by django-cors-headers).
- `CORS_ALLOWED_ORIGINS` is set to `http://localhost:3000` to allow requests from the Vite frontend.
- `DATABASES` uses the default `sqlite3` backend (`db.sqlite3` in `backend/`).
- `REST_FRAMEWORK` is configured with `AllowAny` as the default permission class for now (no auth yet).

### Reinstalling dependencies

On a fresh clone, recreate the venv and install from `requirements.txt`:

```bash
cd task-manager/backend
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
```

## Frontend Setup

Commands used to create the frontend:

```bash
cd task-manager/frontend

# Scaffold a React app with Vite
npm create vite@latest . -- --template react

# Install dependencies
npm install

# Install axios
npm install axios

# Create components folder
mkdir -p src/components
```

To run the frontend dev server:

```bash
cd task-manager/frontend
npm run dev
```

The app will be available at `http://localhost:3000/` (the Vite dev server port was set to `3000` in `vite.config.js` to match the backend's CORS configuration).

## Next Steps (not yet implemented)

- Define the `Task` model in `tasks/models.py`.
- Add serializers, views/viewsets, and URL routes for the `tasks` app.
- Wire up `src/components` with components that call the API via axios.
