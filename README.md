# TaskFlow — Project & Task Management Dashboard

TaskFlow is a web-based project and task management dashboard built with **React, Vite, Tailwind CSS, Node.js, and Express.js**. It provides an interface for managing projects and tasks, tracking progress, viewing team information, and monitoring project activity through dashboard summaries and charts.

> **Project status:** TaskFlow is a development prototype. Its backend stores data in a local JSON file (`backend/data.json`), rather than MongoDB or another database. Some API routes and integrations require fixes before production deployment.

## Features

- **Dashboard Overview:** Displays project and task statistics, completion rates, pending tasks, upcoming deadlines, and chart-based summaries.
- **Project Management:** Create, view, update, and delete projects, including descriptions, status, progress, deadlines, and team-member associations.
- **Task Management:** Manage tasks with titles, descriptions, project associations, assignees, priorities, statuses, and deadlines.
- **Search and Filtering:** Search tasks by title or description and filter tasks by status.
- **Team Management Interface:** View team members, add member records, and update roles through the available interface.
- **REST API:** Provides Express endpoints for project, task, team, and dashboard data.
- **Responsive User Interface:** Built with React and Tailwind CSS, with charts from Recharts and icons from Lucide React.

## Technology Stack

### Frontend
- React 19
- Vite
- React Router
- Tailwind CSS
- Recharts
- Lucide React
- Framer Motion (dependency included in the project)

### Backend
- Node.js
- Express 5
- CORS
- JSON-file persistence

## Project Structure

```text
taskflow-dashboard-main/
├── backend/
│   ├── data.json
│   ├── package.json
│   └── server.js
├── public/
├── src/
│   ├── components/
│   │   └── dashboard/
│   ├── pages/
│   │   └── Landing.jsx
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

Install the following before running the application:

- Node.js (a current LTS release is recommended)
- npm

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
cd taskflow-dashboard-main
```

Replace `YOUR_REPOSITORY_URL` with your actual repository URL. If you already have the project ZIP, extract it and open a terminal in the extracted directory instead.

### 2. Install Frontend Dependencies

From the project root, run:

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Start the Backend Server

From the `backend` directory:

```bash
node server.js
```

The API is expected to run at:

```text
http://localhost:5000
```

Keep this terminal running.

### 5. Start the Frontend

Open a second terminal in the project root and run:

```bash
npm run dev
```

Open the local development URL displayed by Vite, usually:

```text
http://localhost:5173
```

### Available Frontend Scripts

Run these commands from the project root:

```bash
npm run dev      # Start the development server
npm run build    # Build the frontend
npm run preview  # Preview the production build
npm run lint     # Run ESLint
```

## API Endpoints

The Express backend exposes the following routes on `http://localhost:5000`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | Retrieve dashboard statistics and upcoming tasks |
| GET | `/tasks` | Retrieve tasks |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |
| GET | `/projects` | Retrieve projects |
| POST | `/projects` | Create a project |
| PUT | `/projects/:id` | Update a project |
| DELETE | `/projects/:id` | Delete a project |
| GET | `/team` | Retrieve team members |
| POST | `/team` | Add a team-member record |
| PUT | `/team/:id` | Update a team-member record |
| DELETE | `/team/:id` | Delete a team-member record; currently requires a fix |
| GET | `/team/project/:projectId` | Retrieve members associated with a project; currently requires a fix |

### Example API Request

Retrieve the current task list:

```bash
curl http://localhost:5000/tasks
```

You can also test the endpoints using Postman or another HTTP client.

## Data Storage

TaskFlow currently stores project, task, and team records in `backend/data.json`.

This approach is suitable for a local development prototype and makes the sample data easy to inspect. However, JSON-file persistence does not provide the concurrency control, scalability, or data-management capabilities expected from a production database.

**Note:** MongoDB is not currently connected to the repository's backend.

## Known Limitations

The following issues should be addressed before production deployment:

1. **JSON persistence:** Data is stored in a local JSON file rather than a database.
2. **Team API inconsistencies:** Some team endpoints reference `data.teamMembers`, while the provided data structure uses `data.team`.
3. **Team deletion identifier:** The frontend sends a member name in the delete request, while the backend route expects a numeric ID.
4. **Route casing:** The landing page navigates to `/dashboard`, while the application declares `/Dashboard`. These should be aligned.
5. **API configuration:** The frontend uses hard-coded `http://localhost:5000` URLs, which need configuration for deployment.
6. **Authentication:** Although Clerk is included as a dependency, authentication is not fully integrated into the application.
7. **Automated testing:** A backend automated test suite is not configured.

## Future Improvements

- Replace JSON-file storage with MongoDB or another suitable database.
- Correct team-member association and deletion logic.
- Standardize frontend routes and configure the API base URL through environment variables.
- Add request validation and consistent error handling.
- Implement and verify authentication and authorization.
- Add automated API and frontend tests.
- Configure and document production deployment.
