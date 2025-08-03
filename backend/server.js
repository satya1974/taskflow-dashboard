const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = "./data.json";

// Utility to read JSON
function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

// Utility to write JSON
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// === GET Routes ===

app.get("/tasks", (req, res) => {
  const data = readData();
  res.json(data.tasks);
});

app.get("/projects", (req, res) => {
  const data = readData();
  res.json(data.projects);
});

app.get("/team", (req, res) => {
  const data = readData();
  res.json(data.team);
});

// GET team members of a specific project by project ID
app.get("/team/project/:projectId", (req, res) => {
  const data = readData();
  const projectId = parseInt(req.params.projectId);
  const project = data.projects.find((p) => p.id === projectId);
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }
  // Return full member details for those IDs
  const members = data.teamMembers.filter((m) => project.teamMembers.includes(m.id));
  res.json(members);
});

// === POST Routes ===

app.post("/tasks", (req, res) => {
  const data = readData();
  const newTask = {
    id: Date.now(),
    createdAt: new Date().toISOString().split("T")[0],
    ...req.body,
  };
  data.tasks.push(newTask);
  writeData(data);
  res.status(201).json(newTask);
});

app.post("/projects", (req, res) => {
  const data = readData();
  const newProject = {
    id: Date.now(),
    ...req.body,
  };
  // Ensure teamMembers field exists as array of member IDs
  if (!newProject.teamMembers) newProject.teamMembers = [];
  data.projects.push(newProject);
  writeData(data);
  res.status(201).json(newProject);
});

app.post("/team", (req, res) => {
  const data = readData();
  const newMember = {
    id: Date.now(),
    ...req.body,
    avatar:
      req.body.avatar ||
      (req.body.name
        ? req.body.name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()
        : "NA"),
    joinedAt: new Date().toISOString().split("T")[0],
    status: req.body.status || "Pending",
    lastActive: req.body.lastActive || "Never",
  };
  data.team.push(newMember);
  writeData(data);
  res.status(201).json(newMember);
});

// === PUT (Update) Routes ===

app.put("/tasks/:id", (req, res) => {
  const data = readData();
  const taskId = parseInt(req.params.id);
  let taskExists = false;
  data.tasks = data.tasks.map((task) => {
    if (task.id === taskId) {
      taskExists = true;
      return { ...task, ...req.body };
    }
    return task;
  });
  if (!taskExists) return res.status(404).json({ error: "Task not found" });
  writeData(data);
  res.json({ message: "Task updated successfully" });
});

app.put("/projects/:id", (req, res) => {
  const data = readData();
  const projectId = parseInt(req.params.id);
  let projectExists = false;
  data.projects = data.projects.map((project) => {
    if (project.id === projectId) {
      projectExists = true;
      return { ...project, ...req.body };
    }
    return project;
  });
  if (!projectExists) return res.status(404).json({ error: "Project not found" });
  writeData(data);
  res.json({ message: "Project updated successfully" });
});

app.put("/team/:id", (req, res) => {
  const data = readData();
  const memberId = parseInt(req.params.id);
  let memberExists = false;
  data.team = data.team.map((member) => {
    if (member.id === memberId) {
      memberExists = true;
      return { ...member, ...req.body };
    }
    return member;
  });
  if (!memberExists) return res.status(404).json({ error: "Team member not found" });
  writeData(data);
  res.json({ message: "Team member updated successfully" });
});

// === DELETE Routes ===

// Delete task by id
app.delete("/tasks/:id", (req, res) => {
  const data = readData();
  const taskId = parseInt(req.params.id);
  const initialLength = data.tasks.length;
  data.tasks = data.tasks.filter((task) => task.id !== taskId);
  if (data.tasks.length === initialLength) {
    return res.status(404).json({ error: "Task not found" });
  }
  writeData(data);
  res.json({ message: "Task deleted successfully" });
});

// Delete project by id
app.delete("/projects/:id", (req, res) => {
  const data = readData();
  const projectId = parseInt(req.params.id);
  const initialLength = data.projects.length;
  data.projects = data.projects.filter((project) => project.id !== projectId);
  if (data.projects.length === initialLength) {
    return res.status(404).json({ error: "Project not found" });
  }
  writeData(data);
  res.json({ message: "Project deleted successfully" });
});

// Delete team member by id and cascade delete from projects and tasks
app.delete("/team/:id", (req, res) => {
  const data = readData();
  const memberId = parseInt(req.params.id);

  // Check if member exists
  const memberExists = data.team.some((m) => m.id === memberId);
  if (!memberExists) {
    return res.status(404).json({ error: "Team member not found" });
  }

  // Remove member from teamMembers array
  data.teamMembers = data.teamMembers.filter((m) => m.id !== memberId);

  // Remove member from projects' teamMembers arrays
  data.projects = data.projects.map((project) => {
    return {
      ...project,
      teamMembers: project.teamMembers.filter((id) => id !== memberId),
    };
  });

  // Remove tasks assigned to this member
  data.tasks = data.tasks.filter((task) => task.assignedTo !== memberId);

  writeData(data);
  res.json({ message: "Team member and related projects/tasks updated successfully" });
});

// === GET Dashboard Stats ===
app.get("/dashboard", (req, res) => {
  const data = readData();
  const tasks = data.tasks || [];
  const projects = data.projects || [];

  const statusCount = {
    Completed: 0,
    "In Progress": 0,
    Pending: 0,
  };

  const upcomingTasks = [];
  const today = new Date();

  tasks.forEach((task) => {
    if (statusCount[task.status] !== undefined) statusCount[task.status]++;
    else statusCount.Pending++;

    const taskDate = new Date(task.deadline);
    if (taskDate >= today) {
      // 🔍 Attach project name to the task
      const project = projects.find((p) => p.id === task.projectId);
      upcomingTasks.push({
        ...task,
        project: project?.name || "Unknown Project",
      });
    }
  });

  const statsResponse = {
    totalProjects: projects.length,
    totalTasks: tasks.length,
    pendingTasks: statusCount.Pending,
    completionRate:
      tasks.length === 0
        ? 0
        : Math.round((statusCount.Completed / tasks.length) * 100),
    taskStatusData: [
      { name: "Completed", value: statusCount.Completed, color: "#10B981" },
      { name: "In Progress", value: statusCount["In Progress"], color: "#8B5CF6" },
      { name: "Pending", value: statusCount.Pending, color: "#A855F7" },
    ],
    upcomingTasks: upcomingTasks.slice(0, 5), // limit to 5
  };

  res.json(statsResponse);
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
