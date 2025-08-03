"use client"

import { useState, useEffect } from "react"
import { Plus, Filter, Search, X } from "lucide-react"

export default function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [teamMembers, setTeamMembers] = useState([])

  const [showTaskModal, setShowTaskModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filterStatus, setFilterStatus] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "Pending",
    priority: "medium",
    assignedTo: "",
    projectId: "",
    deadline: "",
  })

  useEffect(() => {
    fetch("http://localhost:5000/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))

    fetch("http://localhost:5000/team")
      .then((res) => res.json())
      .then((data) => setTeamMembers(data))

    fetch("http://localhost:5000/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
  }, [])

  const getAssigneeName = (id) => {
    const member = teamMembers.find((m) => m.id === id)
    return member ? member.name : "Unknown"
  }

  const getProjectName = (id) => {
    const project = projects.find((p) => p.id === id)
    return project ? project.name : "Unknown"
  }

  const handleCreateOrUpdateTask = (e) => {
    e.preventDefault()
    if (!newTask.title || !newTask.projectId || !newTask.assignedTo) {
      alert("Please fill in title, project, and assignee")
      return
    }

    const endpoint = editingTask
      ? `http://localhost:5000/tasks/${editingTask.id}`
      : `http://localhost:5000/tasks`

    const method = editingTask ? "PUT" : "POST"

    fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then((res) => res.json())
      .then(() => {
        fetch("http://localhost:5000/tasks")
          .then((res) => res.json())
          .then((data) => {
            setTasks(data)
            resetForm()
          })
      })
      .catch(() => alert("Error saving task"))
  }

  const handleEditTask = (task) => {
    setNewTask(task)
    setEditingTask(task)
    setShowTaskModal(true)
  }

  const handleDeleteTask = (id) => {
    fetch(`http://localhost:5000/tasks/${id}`, { method: "DELETE" }).then(() => {
      setTasks(tasks.filter((t) => t.id !== id))
    })
  }

  const resetForm = () => {
    setNewTask({
      title: "",
      description: "",
      status: "Pending",
      priority: "medium",
      assignedTo: "",
      projectId: "",
      deadline: "",
    })
    setEditingTask(null)
    setShowTaskModal(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-300"
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 border-green-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = filterStatus === "All" || task.status === filterStatus
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 py-10">
      <div className="container mx-auto px-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent">
              Tasks
            </h1>
            <p className="text-purple-600 text-lg font-medium">Manage and track your tasks</p>
          </div>
          <button
            onClick={() => setShowTaskModal(true)}
            className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white px-6 py-3 rounded-2xl hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 flex items-center space-x-3 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <Plus className="h-5 w-5" />
            <span className="font-semibold">Add Task</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 h-6 w-6" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 border-2 border-purple-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="h-6 w-6 text-purple-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border-2 border-purple-300 rounded-2xl px-6 py-4 text-purple-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-200 overflow-x-auto">
          <table className="min-w-full divide-y divide-purple-200">
            <thead className="bg-purple-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-purple-800">Task</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-purple-800">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-purple-800">Priority</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-purple-800">Assignee</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-purple-800">Project</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-purple-800">Deadline</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-purple-800">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-purple-100">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-purple-50 transition-all duration-200">
                  <td className="px-6 py-4 font-medium text-gray-900">{task.title}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center text-sm font-semibold px-4 py-1 border rounded-full whitespace-nowrap ${getStatusColor(task.status)}`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex text-sm font-semibold px-4 py-1 border rounded-full capitalize ${getPriorityColor(task.priority)}`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-purple-700">{getAssigneeName(task.assignedTo)}</td>
                  <td className="px-6 py-4 text-purple-700">{getProjectName(task.projectId)}</td>
                  <td className="px-6 py-4 text-purple-700">{task.deadline}</td>
                  <td className="px-6 py-4 space-x-3">
                    <button
                      onClick={() => handleEditTask(task)}
                      className="text-purple-600 hover:text-purple-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal remains same (You can ask for polished modal next) */}
        {showTaskModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-xl w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{editingTask ? "Edit Task" : "Create Task"}</h2>
                <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleCreateOrUpdateTask} className="space-y-6">
                <input
                  type="text"
                  required
                  placeholder="Title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl"
                />
                <textarea
                  placeholder="Description"
                  rows="3"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl"
                />
                <select
                  value={newTask.projectId}
                  onChange={(e) => setNewTask({ ...newTask, projectId: Number(e.target.value) })}
                  className="w-full px-4 py-3 border rounded-xl"
                  required
                >
                  <option value="">Select Project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <select
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: Number(e.target.value) })}
                  className="w-full px-4 py-3 border rounded-xl"
                  required
                >
                  <option value="">Select Assignee</option>
                  {teamMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl"
                />
                <div className="flex gap-4">
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                    className="flex-1 px-4 py-3 border rounded-xl"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="flex-1 px-4 py-3 border rounded-xl"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 border rounded-xl px-6 py-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-purple-700 text-white rounded-xl px-6 py-3"
                  >
                    {editingTask ? "Update Task" : "Create Task"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
